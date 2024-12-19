import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthProvider.tsx";
import ToastProvider from "./contexts/ToastProvider.tsx";
import HouseholdProvider from "./contexts/HouseholdProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const queryClient = new QueryClient()

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <HouseholdProvider>
              <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <App/>
              </ThemeProvider>
            </HouseholdProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
