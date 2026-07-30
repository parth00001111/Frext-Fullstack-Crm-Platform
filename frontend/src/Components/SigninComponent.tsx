    import React, { useState, type ChangeEvent, type FormEvent } from 'react'
    import { useNavigate } from 'react-router-dom';
    import logoo from "../assets/logo.png"
    import axios from "axios"
    import SignupInput from './SignupInput';
    interface IFormData {
        email: string, 
        password: string,
    }

    const SigninComponent: React.FC = () => {
        const [formData, setFormData] = useState({
            email: "", 
            password: "",
        })
        const navigate = useNavigate();
        const [loading, setLoading] = useState<boolean>(false);

        const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            if(!formData.email || !formData.password){
                alert("Fil all the fields");
            }
            try {

                const response = await axios.post(`http://localhost:5000/api/v1/signin`, formData);
                console.log("Signin Successfully", response.data);
                alert("Signin Successfully");
                navigate("/dashBoard")
                

            }catch(e: any) {
                if(axios.isAxiosError(e) && e.response) {
                    if(e.response.status === 404){
                        alert("User does not exist. Create new account")
                        navigate("/signup")

                    }else if(e.response.status === 401) {
                        alert("Incorrect password");
                    }else {
                        alert(e.response.data?.message || "Something went wrong")
                    }
                }else {
                    alert("Cannot connect to the server")
                }
                
            }finally{
                setLoading(false)
            }

        }
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))

        }

    return (
        <div className="main-div">
            <div className="signinDiv">
                <form onSubmit={ handleSubmit }>
                    <img className="logoo" src={ logoo } alt="" />
                    <SignupInput name="email" value={ formData.email } onChange={ handleChange} type="email" placeholder="Enter email..."/>
                    <SignupInput name="password" value={ formData.password } onChange={ handleChange} type="password" placeholder="Enter password..." />
                    <button className="button" type="submit" >Signin</button>

                    <div style={{marginTop:"10px", fontSize:"17px"}}>
                <span style={{marginLeft:"60px"}}>Create a new account.</span>
                <span onClick={() => navigate("/signup")} style={{marginLeft:"10px", color:"rgb(30, 132, 205)", cursor: "pointer"}}>Sigup</span>
            </div>
                </form>
            </div>
        
        </div>
    )
    }

    export default SigninComponent
