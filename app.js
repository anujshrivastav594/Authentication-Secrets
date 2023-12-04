require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view-engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/secretsDB");

const userSchema = new mongoose.Schema({
    email: String,
    passcode: String
});

// // const secret = "xxxxxxxxxxxxxxxxxxx";  //shifted to env file
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["passcode"]});

const User = mongoose.model("User", userSchema);
  
app.get("/", function(req, res) {
    res.render("home.ejs");
});

app.get("/login", function(req, res) {
    res.render("login.ejs");
});

app.get("/register", function(req, res) {
    res.render("register.ejs");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        passcode: md5(req.body.password)
    })
    newUser.save().then(() => {
        res.render("secrets.ejs")
    }).catch((err) => {
        console.log(err);
      });
});

app.post("/login", function(req, res) {
    
    User.findOne({email: req.body.username}).then((foundUser) => {
        if(foundUser.passcode === md5(req.body.password)) {
            res.render("secrets.ejs");
        } else {
            res.send("Incorrect credentials");
        }
    }).catch((err) => {
        res.send(err);
    })
   
});

app.listen(3000, function(){
    console.log("server is running on port 3000.");
});