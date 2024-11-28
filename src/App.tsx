import './App.css'
import {Route, Routes} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import Overview from "./components/pages/Overview.tsx";

function App() {

  return (
    <Routes>
      <Route path={"/"} element={<Overview/>} />
      <Route path={"/login"} element={<LoginPage/>}/>
      <Route path={"/register"} element={<RegisterPage/>}/>
    </Routes>
  )
}

export default App
