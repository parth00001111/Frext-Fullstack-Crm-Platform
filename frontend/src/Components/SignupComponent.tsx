    import React, { useState, type ChangeEvent, type FormEvent } from 'react'
    import "../index.css";
    import { useNavigate } from "react-router-dom";
    import axios from 'axios';
    interface FormData {
        name: string, 
        role: string, 
        email: string, 
        password: string,
        
    }
    const SignupComponent: React.FC = () => {
        const [formData, setFormData] = useState<FormData>({
            name: "", 
            role:"",
            email:"", 
            password: "",
        })
        
        const [loading, setLoading] = useState<boolean>(false);
        const navigate = useNavigate();

        const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            try {
                const response = await axios.post(`http://localhost:5000/api/v1/signup`, formData);
                console.log("signup create", response.data);
                alert("Account created successfully")
                navigate("/signin")

            }catch(err: any) {
                console.log("Error", err.message);
                alert(err.message || "Somethings wrong in this");
                
            }finally {
                setLoading(false)
            }
        }
        const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value}))
        }
    return (
        <div className={"mainContainer"}>
        <div className="inputbox">
            <form onSubmit={handleSubmit} >
                <p style={{fontSize:"40px", marginLeft:"105px"}}>Sign up</p>
                <div>
                    <input className="inputfield" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name..." />
                </div>
                <div>
                    <input className="inputfield" type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Enter role..." />
                </div>
                <div>
                    <input className="inputfield" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email..." />
                </div>
                <div>
                    <input className="inputfield" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password..." />
                </div>
                <div>
                    <button type="submit" className="signupButton">Sign up</button>
                </div>
                <div style={{marginTop:"20px"}}>
                    <span style={{marginLeft:"55px"}}>Already have an account?</span>
                    <span onClick={() => navigate("/signin")} style={{marginLeft:"5px", color:"#4781b0", cursor:"pointer"}}>Login</span>
                </div>
            </form>

        </div>
        </div>
    )
    }

    export default SignupComponent
