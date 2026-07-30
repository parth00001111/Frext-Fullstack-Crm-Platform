import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import SignupInput from './SignupInput';
import axios from "axios";
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';

interface IFormData {
  name: string, 
  role: string, 
  email: string, 
  password: string,
}

const SignupComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "", 
    role: "", 
    email: "", 
    password: "", 
  })
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if(!formData.email || !formData.password || !formData.name || !formData.role) {
      alert("Fill all field")
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/v1/signup`, formData)
      console.log("Signup Successfully", response.data);
      alert("Signup Successfully")
      navigate("/signin")
      

    }catch(e: any) {
      console.log(e.message);
      
      alert(e.message);
      const message = e.response || "Something went wrong";
      if(axios.isAxiosError(e) && e.response) {
        if(e.response.status === 409) {
          alert("User Already exists")
          navigate("/signin");

        }else {
          alert(e.response.data?.message || "Something went wrong");
        }
      } else if (axios.isAxiosError(e) && e.request) {
          alert("Not able to connect with the server. Check your internet.");

      }else {
        alert("Something went wrong")
      }
    }finally {
      setLoading(false)
    }

  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

  }


  return (
    <div className="main-div">
      <div className="signupDiv">

          <form onSubmit={handleSubmit}>
            <img className="logo" src={ logo } alt="" />
            <SignupInput type="text" placeholder="Enter name..." value={ formData.name } onChange={ handleChange } name="name"  />
            <SignupInput type="text" placeholder="Enter role..." value={ formData.role } onChange={ handleChange } name="role"  />
            <SignupInput type="email" placeholder="Enter email..." value={ formData.email } onChange={ handleChange } name="email"  />
            <SignupInput type="password" placeholder="Enter password..." value={ formData.password } onChange={ handleChange } name="password"  />
            <button className="button" type="submit">Sign up</button>

           <div style={{marginTop:"10px", fontSize:"17px"}}>
            <span style={{marginLeft:"50px"}}>Already have an account?</span>
            <span onClick={() => navigate("/signin")} style={{marginLeft:"10px", color:"rgb(30, 132, 205)", cursor: "pointer"}}>Login</span>
           </div>
           
          </form>

      </div>
      
    </div>
  )
}

export default SignupComponent
