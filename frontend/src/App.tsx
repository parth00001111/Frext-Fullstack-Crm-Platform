import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupComponent from "./Components/SignupComponent";
import SigninComponent from "./Components/SigninComponent"
import DashBoardComponent from "./Components/DashBoard";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/signup" element={ <SignupComponent/> } />
        <Route path="/signin" element={ <SigninComponent/> } />
        <Route path="/dashboard" element={ <DashBoardComponent/> } />
      </Routes>
    </BrowserRouter>
    
  )
}
export default App;