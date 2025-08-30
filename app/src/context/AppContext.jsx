import axios from 'axios'; 
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({children})=>{
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);
    const [requestStatus,setRequestStatus] = useState('pending');
    const [sent,setSent] = useState(false);
    const [requestSent,setRequestSent] = useState(false);

    // Check if user is authenticated - token is enough for initial check
    const isAuthenticated = !!token;

    // Login function
    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(userData);
        setLoading(false); // Set loading to false immediately after login
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate('/signin'); // Navigate to signin instead of home
    };

    // Check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    // Enhanced axios interceptor for token handling
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (token && !isTokenExpired(token)) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else if (token && isTokenExpired(token)) {
                    // Token is expired, logout user
                    logout();
                    return Promise.reject(new Error('Token expired'));
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    // Fetch user profile on token change - IMPROVED VERSION
    useEffect(() => {
        const fetchUserProfile = async () => {
            // Don't fetch if no token or token is expired
            if (!token || isTokenExpired(token)) {
                setLoading(false);
                return;
            }

            // Don't fetch profile if we just logged in (user data already available)
            if (token && user) {
                setLoading(false);
                return;
            }

            // Only fetch if we have token but no user data and token is valid
            if (token && !user && !isTokenExpired(token)) {
                try {
                    const response = await axios.get("/api/user/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.success) {
                        setUser(response.data.data);
                    } else {
                        // Profile fetch failed but not due to auth - keep user logged in
                        console.error("Profile fetch failed:", response.data.message);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    // Only logout if it's actually a token issue, not network issues
                    if (error.response?.status === 401) {
                        logout();
                    }
                    // For other errors (network, 500, etc.), don't logout
                }
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [token]); // Remove user dependency to prevent infinite loops

    const value = {
        navigate,
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        axios,
        requestStatus,
        setRequestStatus,
        sent,
        setSent,
        requestSent,
        setRequestSent,
        setUser,
        setToken
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)
