import express from "express";
import { isLoggedIn } from "../middleware.js";
import { countLikes } from "../controllers/likes.js";


const router=express.Router({mergeParams:true});

router.get("/",isLoggedIn,countLikes)

export default router;