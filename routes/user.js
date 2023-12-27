import express from "express";
import { forgotForm, forgotPassword, login, loginForm, logout, register, registerForm, setuserpassword } from "../controllers/user.js";
import passport from "passport";
import { isAuthor, isLoggedIn, storeReturnTo } from "../middleware.js";
import { User } from "../models/user.js";
import LocalStrategy from "passport-local";


const router=express.Router();
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.route("/register")
      .get(registerForm)
      .post(register)

router.route("/login")      
      .get(loginForm)
      .post(storeReturnTo,passport.authenticate("local",{ failureFlash:true,failureRedirect:"/user/login"}) ,login);


router.route("/forgot")
      .get(forgotForm)
      .post(forgotPassword)

router.post("/setpassword",setuserpassword)      

router.get("/logout",isLoggedIn, logout);






export default router;