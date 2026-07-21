    import React, { useState, type ChangeEvent, type FormEvent } from 'react'
    import "../index.css";
    import { useNavigate } from "react-router-dom";
    import axios from 'axios';
    interface FormData { 
        email: string, 
        password: string,
        
    }
    const SigninComponent: React.FC = () => {
        const [formData, setFormData] = useState<FormData>({    
            email:"", 
            password: "",
        })
        
        const [loading, setLoading] = useState<boolean>(false);
        const navigate = useNavigate();

        const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            try {
                const response = await axios.post(`http://localhost:5000/api/v1/signin`, formData);
                console.log("signin Done", response.data);
                alert("Login successfully")
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
        <div style={{height:"300px", width:"400px"}} className="inputbox">
            <form onSubmit={handleSubmit} >
                <p style={{fontSize:"40px", marginLeft:"105px"}}>Sign in</p>
                
                <div>
                    <input style={{height:"40px", width:"350px", marginTop:"20px", borderRadius:"10px", paddingLeft:"5px", fontSize:"16px", border:"2px solid grey", outline:"none"}} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email..." />
                </div>
                <div>
                    <input style={{height:"40px", width:"350px", marginTop:"20px", borderRadius:"10px", paddingLeft:"5px", fontSize:"16px", border:"2px solid grey", outline:"none"}} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password..." />
                </div>

                <div>
                    <button type="submit" className="signupButton">Sign in</button>
                </div>
                <div style={{marginLeft:"70px", marginTop:"10px"}}>
                    <span>Don't have an account?  </span>
                    <span style={{cursor:"pointer", color:"#4781b0"}} onClick={() => navigate("/signup")} >Signup</span>
                </div>
                
            </form>

        </div>
        </div>
    )
    }

    export default SigninComponent
