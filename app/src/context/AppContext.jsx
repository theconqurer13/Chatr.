import axios from 'axios'; 
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {useUser,useAuth} from '@clerk/clerk-react'
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({children})=>{

    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();
    

    const value = {
        navigate,user,getToken,axios
    }

     return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
     )
}

export const useAppContext = ()=> useContext(AppContext)
