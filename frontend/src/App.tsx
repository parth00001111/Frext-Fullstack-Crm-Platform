import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupComponent from "./Components/SignupComponent";
import SigninComponent from "./Components/SigninComponent"



const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/signup" element={ <SignupComponent/> } />
        <Route path="/signin" element={ <SigninComponent/> } />
      </Routes>
    </BrowserRouter>
    
  )
}
export default App;