import React from 'react'
import qrcode from '../components/Assets/qrcode.png'

const Payment = () => {
  return (
    <div style={{display:"flex", justifyContent:"center", marginBlock:"4rem"}} className='payment'>
      <img src={qrcode} alt="payment"/>
    </div>
  )
}

export default Payment
