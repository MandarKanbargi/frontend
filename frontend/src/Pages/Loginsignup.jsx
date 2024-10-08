import React from 'react'
import './CSS/Loginsignup.css'
import { useState, } from 'react'

const Loginsignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })
  const [error, setError] = useState('');

  const changeHandler= (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value})
    const { name, value } = e.target;
    
    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validate email
    if (!value) {
      setError('Email address is required.');
    } else if (!/\S+@gmail\.com/.test(value)) {
      setError('Email address must end with @gmail.com.');
    } else {
      setError('');
    }
  }

  const login = async ()=>{
    console.log("Login Executed",formData);
    let responseData;
    await fetch("http://localhost:4000/login",{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem("auth-token",responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  const signup = async ()=>{
    console.log("Sign Up Executed",formData);
    let responseData;
    await fetch("http://localhost:4000/signup",{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem("auth-token",responseData.token);
      window.location.replace("/");
    }
    else{
      alert(responseData.errors)
    }
  }

  return (
    <div className='login-signup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up"?<input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name"/>:<></>}
          {/* <input name="email" value={formData.email} onChange={changeHandler}  type="email" placeholder="Email Addtress"></input> */}
          <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" required/>
      {error && <div style={{ color: 'red' }}>{error}</div>}

          <input name="password" value={formData.password} onChange={changeHandler}  type="password" placeholder="Password"></input>
        </div>
        <button onClick={()=>{state === "Login"?login():signup()}}>Continue</button>
        {state === "Sign Up"
        ? <p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Login Here</span></p>
      : <p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign Up")}}>Click Here</span></p>}
       
        <div className="loginsignup-agree">
          <input type="checkbox" name=" " id=" " />
          <p>By continuing, I agree to  use the terms of use & privacy policy</p> 
        </div>
      </div>
      
    </div>
  )
}

export default Loginsignup
