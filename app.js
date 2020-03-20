require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true});


//mongoose schema
const userSchema = new mongoose.Schema({
  email : String,
  password: String
});

console.log(process.env.API_KEY)
userSchema.plugin(encrypt,{secret: process.env.SECRET , encryptedFields: ["password"]});

//mongoose Model
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});


app.get("/submit",function(req,res){
  res.render("submit");
});

app.post("/register",function(req,res){
    const newUser = new User({
      email : req.body.username,
      password : req.body.password
    });
    newUser.save(function(err){
      if(!err){
        res.render("secrets");
        console.log("data has been successfully saved");
      }
      else
      {
        console.log(err);
      }
    });
});
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else
    {
      if(foundUser.password == password)
      {
        res.render("secrets");
      }
      else
      {
        console.log("invalid password");
      }
    }
  })
})
app.listen(3000,function(){
  console.log("server is started at 3000");
})
