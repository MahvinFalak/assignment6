const userSchema = require("../models/User");
const bcrypt=require('bcrypt');// to hash the data
const { activateAccountMail } = require("../services/mailService");
const { json } = require("express");
const SALT_ROUNDS=10;


const registerUser=async(req,res)=>{

    try {

        if(req.session.username){
            return res.redirect('/menu')
        }
        else{
            const {name,email,password,mobile,address}=req.body;
            let userData=await userSchema.findOne({email:email});
            if(!userData){
                let hashedPassword=await bcrypt.hash(password,SALT_ROUNDS);
                user=new userSchema({name,email,password:hashedPassword,mobile,address});
                user.save();
                activateAccountMail(user);
                return res.render("regis", { succs: "Activation Email Sended to your mail",title:"Register" ,form:"form.css"});
            }
            else{
                return res.render("regis", { error: "User Already Registered",title:"Register",form:"form.css"});
            }

        }
        
    } catch (error) {
        console.log(error);
    }

}

const login=async(req,res)=>{
    const {email,password}=req.body;
    // console.log({email,password});
    if(req.session.username){
        return res.redirect('/menu')
    }
    try {
        let data=await userSchema.findOne({email:email});
       // console.log(data);
        if(data){
            if(bcrypt.compareSync(password,data.password)){
                req.session.username=data.name;
                req.session.email=data.email;
                return res.redirect('/menu')
            }
            else{
                return res.render("login", { error: "Incorrect Password" , title:"Login",form:"form.css"});
            }
        }
        else{
            return res.render("login", { error: "Incorrect Email Id",title:"Login" ,form:"form.css"});
        }
        
    } catch (error) {
        console.log(error);
    }

}

const signupView=(req,res)=>{

    if(req.session.username){
        return res.redirect('/menu')
    }
    return res.render('regis',{title:"Register",form:"form.css"})
}

const loginView=(req,res)=>{

    if(req.session.username){
        return res.redirect('/menu')
    }
    return res.render('login',{title:"Login",form:"form.css"})
}

const activateAccount=async(req,res)=>{
    const {id}=req.params;
    try {
        await userSchema.findOneAndUpdate({_id:id},{$set:{status:1}});
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect("/login");
    }
}

const logout=(req,res)=>{
    req.session.destroy((err) => {
        res.redirect('/') 
    })
}

const defaultPage=(req,res)=>{
    if(req.session.username){
        return res.redirect('/menu')
    }
    return res.render('index',{title:"Pizza Delivery"})
}

const profileHandler=async(req,res)=>{
    try {
        if(!req.session.username){
            return res.redirect('/')
        }
        const email=req.session.email;
        let data=await userSchema.findOne({email:email});
        if(data){
            return res.render('profile',{data:data.toJSON(),title:"Profile"});
        }
    } catch (error) {
       console.log(error); 
    }
}

const showupdateuser = async(req,res)=>{
    try {
        if(!req.session.username){
            return res.redirect('/')
        }else{
        const {id}=req.params;
        let data=await userSchema.findOne({_id:id});
        return res.render("updateuser",{data:data,title:"Profile",form:"form.css"});
        }
    } catch (error) {
       console.log(error); 
    }
    
}

const updateuser = async(req,res)=>{
    try {
        if(!req.session.username){
            return res.redirect('/')
        }else{
        const bodyData=req.body;
        const {id}=req.params;
        await userSchema.findByIdAndUpdate({_id:id},{$set:bodyData});
        res.redirect("/profile"); 
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteuser =async(req,res)=>{

    const {id}=req.params;
    try {
        await userSchema.findByIdAndRemove({_id:id});
    req.session.destroy((err) => {
        res.redirect('/') 
    })
    } catch (error) {
        console.log(error);
    }    
};

module.exports={
    defaultPage,
    registerUser,
    activateAccount,
    login,
    signupView,
    loginView,
    logout,
    profileHandler,
    showupdateuser,
    updateuser,
    deleteuser
}