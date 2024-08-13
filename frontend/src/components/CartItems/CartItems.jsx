import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext }from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import { useNavigate } from 'react-router-dom'

const CartItems = () => {
    const navigate = useNavigate();
    const {getTotalCartAmount,all_product, cartItems, removeFromCart } = useContext(ShopContext);
    return (

        <div className='cartitems'>
            <div className="cartitems-format-main ">
                <p>Products</p>
                <p>Title</p>
                <p>Prize</p>
                <p>Quantitiy</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e)=>{
                if(cartItems[e.id]>0)                            // id product already available 
                {
                    return <div>
                                <div className='cartitems-format cartitems-format-main'>
                                    <img src={e.image} alt="" className='carticon-product-icon' />
                                    <p>{e.name}</p>
                                    <p>Rs{e.new_price}</p>
                                    <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                    <p>Rs{e.new_price * cartItems[e.id]}</p>
                                    <img className="cartitems-remove-icon" src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
                                </div>
                                <hr />
                            </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>cart totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>SubTotal</p>
                            <p>Rs{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>Rs{getTotalCartAmount()}</h3>
                        </div>
                        <button onClick={() => navigate("/payment")} >PROCEED TO CHECKOUT</button>
                    </div>
                    <div className="cartitems-promo-code">
                        <p>If you have a promo code, Enter it here</p>
                        <div className="cartItems-promobox">
                            <input type="text" placeholder="promo code" />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CartItems