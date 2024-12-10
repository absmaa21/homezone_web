import './App.css'
import {Route, Routes} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import Overview from "./components/pages/Overview.tsx";
import Header from "./components/Header.tsx";
import {Grid2} from "@mui/material";

function App() {

  return (
    <Grid2 direction={"column"}>
      <Header/>
      <div className={'content'}>
        <Routes>
          <Route path={"/"} element={<Overview/>}/>
          <Route path={"/login"} element={<LoginPage/>}/>
          <Route path={"/register"} element={<RegisterPage/>}/>
        </Routes>
      </div>
    </Grid2>
  )
}

export default App
