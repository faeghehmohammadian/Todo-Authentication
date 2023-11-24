const UsersModel=require("../models/users-model");
//const signinhtml=require("../client/signin.html");

const signin  = async (req, res ,next) => {
    //res.sendFile(signinhtml);
};

const signup  = async (req, res ,next) => {};

const signout = async (req, res,next) => {};

module.exports = {
    signin,
    signup,
    signout
}