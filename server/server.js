const express = require('express');
const fs= require("fs");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");
const port = 5500;
const bodyParser=require("body-parser");

const server = express();

const mainpath=path.normalize(__dirname + "//..");
server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(express.static(mainpath +"/client"));
server.listen(port, () => {
console.log(`Server running on PORT: ${port}/`);
});
server.use(express.json());
server.use(express.urlencoded({extended:true}));
const userRouter=require("../routes/users-route");
const users=[];
//server.use("/user",userRouter)
// server.use(router);
server.get("/",(req,res)=>{
    res.render("index.ejs");
});
server.get('/signin', (req, res) => {
    //res.sendFile(mainpath +"/client/signin.html");
    res.render("signin.ejs")
});
// const usersData = require('../users/usersdata.json');
//server.get("/signin",userRouter)
// server.post('/signin', (req, res) => {
//     // const email = req.body.email;
//     // const password = req.body.password;

//     // const user = usersData.find(user => user.username === username && user.password === password);

//     // if (user) {
//     //     // Generate a JWT token
//     //     const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

//     //     res.json({ token });
//     // } else {
//     //     res.status(401).send('Invalid username or password');
//     // }
// });
server.get('/signup', (req, res) => {
    res.render("signup.ejs");
});
//server.get("/signin",userRouter)
server.post('/signup', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
    
            console.log(users);
            
        fs.writeFile(mainpath + '/users/usersdata.json', JSON.stringify(users, null, ' '), { encoding: 'utf-8' }, (err) => {
            if (err) {
            res.send(err);
            return;
            }
        });
        res.redirect("/signin"); 
        // Move the redirection here
        } catch (err) {
        console.log(err);
        res.redirect('/signin');
        }
    });
server.get("/download",(req,res)=>{
    fs.readFile(mainpath +"/client/file/data.json",{oncoding: "utf-8"}, (err,data)=>{
        if (err){
            res.send(err);
            return;
        }
        res.send(data);
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
