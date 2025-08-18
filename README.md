## Chatr

A full‑stack chat application with Clerk authentication, a React + Vite frontend, and an Express + MongoDB backend. This README covers setup, local development, environment variables, and a place to showcase your landing page.
### Landing Page
Example placeholder (replace with real content):
```md
![Landing Page](app/src/assets/LandingPage.png)

Welcome to Chatr — a secure, modern, and fast way to connect.
```
### Features
- **Authentication**: User auth via Clerk
- **Modern UI**: React 19, Vite, Tailwind CSS, Lucide icons, toasts
- **Routing**: Client-side routing for dashboard and messaging flows
- **Backend**: Node.js/Express API with MongoDB/Mongoose
- **Webhook Handling**: Secure Clerk webhook verification

### Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, react-hot-toast, lucide-react
- **Auth**: Clerk
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Tooling**: ESLint, Nodemon

### Project Structure
```text
Chatr/
  app/                # React + Vite frontend
    src/
      Pages/
        HeroSection.jsx         # Landing page
        Dashboard/              # Dashboard and sub-pages
      components/               # Reusable UI components
      context/                  # App context
      main.jsx                  # App bootstrap (Clerk provider)
      App.jsx                   # Routes
    package.json
    vite.config.js
  server/             # Express backend
    configs/db.js
    controllers/
    middleware/
    models/
    routes/
    server.js
    package.json
  README.md
```

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string
- A Clerk application (Publishable Key, Secret Key, and a Webhook Secret)

### Environment Variables
Create two `.env` files—one for the frontend and one for the backend.

1) Frontend: `app/.env`
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

2) Backend: `server/.env`
```bash
MONGODB_URL=your_mongodb_connection_url
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

### Installation
Install dependencies in both workspaces.
```bash
cd app && npm install
cd ../server && npm install
```

### Running Locally
Open two terminals:

1) Frontend (Vite dev server)
```bash
cd app
npm run dev
```

2) Backend (Express + Nodemon)
```bash
cd server
npm start
```

### Scripts
- Frontend (`app`):
  - `npm run dev` – Start Vite dev server
  - `npm run build` – Production build
  - `npm run preview` – Preview built app locally
  - `npm run lint` – Lint the frontend codebase

- Backend (`server`):
  - `npm start` – Start the server with Nodemon



### Clerk Setup Notes
- In the frontend, the Clerk provider is initialized using `VITE_CLERK_PUBLISHABLE_KEY`.
- In the backend, Clerk middleware reads credentials from environment variables and verifies incoming webhooks using `CLERK_WEBHOOK_SECRET`.

### Database
The backend connects to MongoDB using `MONGODB_URL` and creates/uses a `chatting-application` database.

### Troubleshooting
- Ensure both `.env` files are present and correctly set.
- Make sure the backend is running before testing authenticated flows.
- Verify your Clerk keys and webhook secret if authentication or events appear to fail.
- Confirm MongoDB is reachable from your environment.




