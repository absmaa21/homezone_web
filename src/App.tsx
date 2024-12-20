import './App.css'
import {Route, Routes} from "react-router-dom";
import Overview from "./components/pages/Overview.tsx";
import Header from "./components/Header.tsx";
import {Grid2} from "@mui/material";
import {useAuth} from "./hooks/useAuth.tsx";
import LoggedInWarning from "./components/LoggedInWarning.tsx";

function App() {
  const Auth = useAuth()

  return (
    <Grid2>
      <Header/>
      {!Auth.user && <LoggedInWarning/>}
      <div className={'content'}>
        <Routes>
          <Route path={"/"} element={<Overview/>}/>
        </Routes>
      </div>
    </Grid2>
  )
}

export default App
