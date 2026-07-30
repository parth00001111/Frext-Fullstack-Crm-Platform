import React from 'react'
import "../index.css";
interface InputProps {
    label?: string, 
    type?: string ,
    placeholder? : string, 
    name? : string, 
    value: string, 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SignupInput: React.FC<InputProps> = ({ label, type, placeholder, name, value, onChange }) => {
  return (
    <div className="inputField">
      { label && <label> { label } </label>}
      <input className="inputV" name={name} type={type} placeholder={placeholder}  value={value} onChange={onChange} />
    </div>
  )
}

export default SignupInput
