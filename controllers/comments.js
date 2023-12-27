import { Post } from "../models/blog.js";
import { Comment } from "../models/comments.js";
import { catchAsync } from "../utils/CatchAsync.js";
import {  storeJoinedDate } from "../utils/CurrentDate.js";




const postComment=catchAsync(async (req,res)=>{
    const {id}=req.params;
   const foundcomment=await Comment.findOne({
    post:id,
    user:req.user._id,
   })
   if(!foundcomment){
    const comment=new Comment({
      body:req.body.comment,
      author:req.user._id,
      post:id,
      date: storeJoinedDate(new Date())
    })
    await comment.save();
   }else{
    req.flash('error',"you already commented on this post")
   }
  
  res.redirect(`/post/${id}`); 
  })

const deleteComment=catchAsync(async (req,res,next)=>{
    const{Commentid}=req.params;
    await Comment.findByIdAndDelete(Commentid);
    req.flash('success',"comment deleted successfully");
    res.redirect(`/post/${id}`);
  })


  export{postComment,deleteComment};