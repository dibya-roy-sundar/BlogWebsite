import express from "express";
import { composePost, deletePost, editForm, newForm, showPost, updateCampground } from "../controllers/blogs.js";
import { isAuthor, isLoggedIn, validatepost } from "../middleware.js";

const router=express.Router();



//   validation is temporarily closed

router.get("/new",isLoggedIn, newForm);

router.post("/",isLoggedIn,validatepost, composePost);
// 

router.route("/:id")
    .get( showPost)
    .put(isLoggedIn,isAuthor,validatepost, updateCampground)
    .delete(isLoggedIn,isAuthor,deletePost)
    // 


router.get("/:id/edit",isLoggedIn,isAuthor,editForm)


  
  

  export default router;