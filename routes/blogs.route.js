import express from "express";
import { composePost, deletePost, editForm, newForm, showPost, updateCampground } from "../controllers/blogs.controller.js";
import { isAuthor, isLoggedIn, validatepost } from "../middleware.js";
import multer from "multer";
import { storage } from "../cloudinary/index.cloudinary.js";

const router=express.Router();
const upload=multer({storage})



//   validation is temporarily closed

router.get("/new",isLoggedIn, newForm);

router.post("/",isLoggedIn,upload.single('image'),validatepost, composePost);


router.route("/:id")
    .get( showPost)
    .put(isLoggedIn,isAuthor,upload.single('image'),validatepost, updateCampground)
    .delete(isLoggedIn,isAuthor,deletePost)
    // 


router.get("/:id/edit",isLoggedIn,isAuthor,editForm)


  
  

  export default router;