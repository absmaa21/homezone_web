import './App.css'
import {Route, Routes} from "react-router-dom";
import Overview from "./components/pages/Overview.tsx";
import Header from "./components/Header.tsx";
import {Grid2} from "@mui/material";

function App() {
  return (
    <Grid2>
      <Header/>
      <div className={'content'}>
        <Routes>
          <Route path={"/"} element={<Overview/>}/>
        </Routes>
      </div>
    </Grid2>
  )
}

export default App
