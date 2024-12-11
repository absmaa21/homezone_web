import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./contexts/UserProvider.tsx";
import ToastProvider from "./contexts/ToastProvider.tsx";
import HouseholdProvider from "./contexts/HouseholdProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <HouseholdProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </HouseholdProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
