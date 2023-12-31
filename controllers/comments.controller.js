import { Post } from "../models/blog.model.js";
import { Comment } from "../models/comments.model.js";
import { catchAsync } from "../utils/CatchAsync.js";
import {  storeJoinedDate } from "../utils/CurrentDate.js";




const postComment=catchAsync(async (req,res)=>{
    const {id}=req.params;
   
    
    const comment=new Comment({
      body:req.body.comment.content,
      author:req.user._id,
      post:id,
      date: storeJoinedDate(new Date())
    })
    await comment.save();
   
  
  res.redirect(`/post/${id}`); 
  })

const deleteComment=catchAsync(async (req,res,next)=>{
    const{id,Commentid}=req.params;
    await Comment.findByIdAndDelete(Commentid);
    req.flash('success',"comment deleted successfully");
    res.redirect(`/post/${id}`);
  })


  export{postComment,deleteComment};