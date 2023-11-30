if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const server = express();
const port = 5500;
const path = require("path");
const mainpath=path.normalize(__dirname + "//..");
const bodyParser = require("body-parser");
const fs= require("fs");
const router = express.Router();

const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const json = require('json');

const users=[]


server.use(express.json());
server.use(express.static(path.join(__dirname, "../client")));
server.use(express.static(path.join(__dirname, "../views")));
server.use(bodyParser.urlencoded({ extended: true }));

const initializePassport = require("./passport-config");
initializePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id)
);
server.set('view engine', 'ejs');
server.use(express.urlencoded({extended:false}));

server.use(flash());
server.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
server.use(passport.initialize());
server.use(passport.session());
// server.get("/account", Router.users-router);

server.post("/signin", checkNotAuthenticated, passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true
}  
));

server.post("/signup",checkNotAuthenticated, async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            todos:[]
        });
        //console.log(users);
        fs.writeFile(mainpath + '/users/usersdata.json',
                    JSON.stringify(users, null, ' '),
                    { encoding: 'utf-8' }, (err) => {
            if (err) {
                res.send(err) // Still redirect on error if file write fails
                return;
            }
        })
        // Successful file write, now redirect
        res.redirect("/signin")
        } catch (err) {
        console.log(err);
        res.redirect("/signup")
        }
    });

server.get("/",(req,res)=>{
    if (req.user) {
        res.render('index.ejs', { username: req.user.username});
    } else {
        res.render('index.ejs', { username: 'Guest'});
    }
    });

server.post("/",function(req,res){
    const curuser=users.find((user) => user.id === req.user.id)
    curuser.todos=[];
    for(var i=0;i<req.body.length;i++){
        curuser.todos.push((req.body)[i])
    }
    fs.writeFile(mainpath + '/users/usersdata.json',
                    JSON.stringify(users, null, ' '),
                    { encoding: 'utf-8' }, (err) => {
            if (err) {
                res.send(err) // Still redirect on error if file write fails
                return;
            }
        })
    //console.log(users);
    res.redirect("/")
});

server.get("/signin", (req, res) => {
    res.render("signin.ejs");
});

server.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

server.get("/download",(req,res)=>{
        
    fs.readFile(mainpath + '/users/usersdata.json',{oncoding: "utf-8"}, (err,data)=>{
        if (err){
            res.send(err);
            return;
        }
        const usersjson = JSON.parse(data);
        console.log(JSON.parse(data));
        const curuser=usersjson.find((user) => user.id === req.user.id)
        console.log(curuser);
        const curusertodos=curuser.todos;
        console.log(curusertodos);
        res.send(curusertodos);
    })
})
server.post("/upload",(req,res)=>{
    const data=req.body;
    fs.writeFile(mainpath +"/client/file/data.json",JSON.stringify(data ,null ," "),{oncoding: "utf-8"}, (err)=>{
        if (err){
            res.send(err);
            return;
        }
        res.json("succes");
    })
})
function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
        return next();
        }
        res.redirect("/signin");
    }
    
    function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
        return res.redirect("/");
        }
        next();
    }
    
server.get("/signout", (req, res) => {
    console.log('logOut')
    req.logOut(function(err) {
        if (err) { return next(err); }
        res.redirect("/signin");
    })
    })

    server.listen(port, () => {
        console.log(`Server running on PORT: ${port}/`);
        });