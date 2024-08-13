import React from 'react'
import './Newsletter.css'
import { useNavigate } from 'react-router-dom';


const Newsletter = () => {
const navigate = useNavigate();
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers on your Email</h1>
      <p>Subscribe to our newsletter and stay updated.</p>
      <div>
        <input type="email" placeholder='Your Email ID' />
        <button onClick={() => navigate("/women")} >
            Subscribe
        </button>
      </div>
    </div>
  )
}

export default Newsletter
