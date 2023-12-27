import express from "express";
import { isLoggedIn } from "../middleware.js";
import { addLike,  removeLike } from "../controllers/likes.js";


const router=express.Router({mergeParams:true});

router.get("/add",isLoggedIn,addLike)
router.get("/remove",isLoggedIn,removeLike)

export default router;