const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const authrouter = require('./routes/authRouter')
const postsrouter = require('./routes/postsRouter')
const {identifier,verifyToken,authenticateToken} = require("./middlewares/identification")


const app = express()
app.use(cors({
    origin: "http://localhost:3000", // ✅ Change this to your frontend URL
    credentials: true // ✅ Allow credentials (cookies)
}));
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

const uri = 'mongodb+srv://naderelfeel:nader123@cluster0.tiq3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your DB URL

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth',authrouter)
app.use(postsrouter)

//app.use(authrouter);
app.get('/',authenticateToken,(req,res)=>{
    const existingUser = req.user;
    console.log(existingUser)
    res.render('main',{User:existingUser})
    //res.json({message:"app is working"});
})

app.listen(3000,()=>{
    console.log("listening on port 3000");
})