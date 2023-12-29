import express from "express"
import { showTagRelatedPosts } from "../controllers/tag.controller.js";

const router=express.Router({mergeParams:true});


router.get("/",showTagRelatedPosts)

export default router

