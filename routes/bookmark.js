import express from "express";
import { isLoggedIn } from "../middleware.js";
import { addBookmark } from "../controllers/bookmark.js";

const router=express.Router({mergeParams:true});


router.get("/",isLoggedIn,addBookmark);


export default router;