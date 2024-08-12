import React, {useState} from 'react'
import './Addproduct.css'
import upload_area from '../../assets/upload_area.svg'

const Addproduct = () => {
  const [image,setImage]= useState(false);
  const [productDetails,setProductDetails] = useState({
      name:"",
      image:"",
      category:"women",
      new_price:"",
      old_price:""
  })

  const imageHandler = (e)=>{
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) =>{
    setProductDetails({...productDetails,[e.target.name]:e.target.value}
    )
  }

  const Add_Product = async () =>{
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product",image);

    await fetch('http://localhost:4000/upload',{
      method:'POST',
      headers:{
        Accept:'application/json',
      },
      body:formData,
    }).then((resp) => resp.json()).then((data)=>{responseData=data});
      
    if(responseData.success){
      product.image= responseData.image_url;
      console.log(product);
      await fetch('http://localhost:4000/addproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
          data.success?alert("Product Added"):alert("Failed");
      })
    }
  } 
   
  return (
    <div className='add-product'>
      <div className="addproduct-item-field">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here' />
      </div>
      <div className="addproduct-price">
      <div className="addproduct-item-field">
      <p>Price</p>
      <input value={productDetails.old_price} onChange={changeHandler} type="number" name="old_price" placeholder='Type here' />
      </div>
      <div className="addproduct-item-field">
      <p>Offer Price</p>
      <input value={productDetails.new_price} onChange={changeHandler} type="number" name="new_price" placeholder='Type here' />
      </div>
      </div>
      <div className="addproduct-item-field">
        <p>Product category</p>
        <select value={productDetails.category} onChange={changeHandler} name='category' className='addproduct-selector'>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-item-field">
        <label htmlFor='file-input'>
          <img src={image?URL.createObjectURL(image):upload_area} className="addproduct-thumbnail-img" alt=""/>
        </label>
        <input onChange={imageHandler} type="file" name="image" id='file-input' hidden />
      </div>
      <button onClick={() => {Add_Product()}} className='addproduct-button'>ADD</button>
    </div>
  )
}

export default Addproduct
