import express from "express";
import { deleteComment, postComment } from "../controllers/comments.js";
import { isCommentAuthor, isLoggedIn, validatecomment } from "../middleware.js";

const router=express.Router({mergeParams:true});



  router.post("/",isLoggedIn, validatecomment,postComment)
//  
  router.delete("/:Commentid",isLoggedIn,isCommentAuthor, deleteComment)

  export default router;