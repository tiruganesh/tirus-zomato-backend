//importing all required external modules after instalation
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')

//Middleware
const PORT=3000
const app=express()
app.use(express.json())

//Connecting Mongodb Atlas
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfully...")
).catch(
    (err)=>console.log(err)
)

//API landing page http://localhost:3000/
app.get('/',async(req, res)=>{
    try{
        res.send("<h1 align=center>Welcome to the backend and Week 2</h1>")
    }
    catch(err)
    {
        console.log(err)
    }
})

//API registration page http://localhost:3000/register

app.post('/register',async(req,res)=>{
    const {user,email, password}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({user,email,password:hashPassword})
        await newUser.save()
        console.log("New user is registered successfully...")
        res.json({message:'User created....'})
    }
    catch(err)
    {
        console.log(err)
    }
})

//API Login page 
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) 
            {
             return res.status(400).json({ message: "Invalid Credentials" });
            }
          res.json({ message: "Login Successful", username: user.username });
    }
    catch(err)
    {
        console.log(err)
    }
})

//Server running and testing
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Server is running on port  : "+PORT)
})