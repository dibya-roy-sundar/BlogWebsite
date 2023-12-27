import express from "express";
import { isLoggedIn } from "../middleware.js";
import { addBookmark, removeBookmark } from "../controllers/bookmark.js";

const router=express.Router({mergeParams:true});


router.get("/add",isLoggedIn,addBookmark)
router.get("/remove",isLoggedIn,removeBookmark)


export default router;