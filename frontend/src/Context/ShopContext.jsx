import React, {createContext} from 'react'
import {useState} from 'react'
import all_product from '../components/Assets/all_product';

export const ShopContext = createContext(null); 

const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index < all_product.length+1; index++){
       cart[index]=0;
    }
    return cart;          //variable creation and exporting it
}
const ShopContextProvider = (props)=>{

    const[cartItems,setCartItems] = useState(getDefaultCart());
   

    const addToCart =(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))           // providing value for the key
        console.log(cartItems);
    }

    const removeFromCart =(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))           // providing value for the key
    }

    const getTotalCartAmount = () => { 
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo = all_product.find((product)=>product.id===(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }
    const contextValue= {getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};   
    console.log(all_product);         //send functions and data
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

