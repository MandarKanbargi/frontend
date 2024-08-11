const port = 4000;
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json());

// Directory Setup
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Database connection with MongoDB
mongoose.connect("mongodb+srv://adyaakalagounda:Project123@cluster0.lzgfclo.mongodb.net/e-commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Image storage engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/images', express.static(uploadDir));

// Routes
app.get("/", (req, res) => {
    res.send("Express App is running");
});

//image upload endpoint - add new images to endpoint
app.post("/upload", upload.single('product'), (req, res) => {
    console.log("File Upload Request Received");
    console.log("File Info:", req.file);

    if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({
            success: 0,
            message: "No file uploaded"
        });
    }

    console.log("File successfully uploaded:", req.file);

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});


// Product Schema
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const Product = mongoose.model("Product", productSchema);

//adding new products, and get see in database
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({}); 
        let id;                                                 //creating id 
        if(products.length>0)
        {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id+1;
        }
        else{
            id = 1;
        }
        const product = new Product({
            id:id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({
            success: false,
            message: "Error saving product"
        });
    }
});

//creating api for deleting products
app.post ('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products= await Product.find({});
    console.log("all Products fetched");
    res.send(products);
})

//schema creating for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
   email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//creating endpoint for registering the user
app.post('/signup', async (req, res) => {

        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email id" });
        }

        // Initialize cart
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create and save new user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        // Generate token
        const secret = process.env.JWT_SECRET || 'secret_ecom';
        const token = jwt.sign(data, secret, { expiresIn: '1h' });

        res.json({ success: true, token });
});

//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false, errors:"Wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email id"})
    }
})

// Start Server
app.listen(port, (error) => {
    if (!error) {
        console.log(`Server running on port ${port}`);
    } else {
        console.error(`Error: ${error}`);
    }
});
