import { Post } from "../models/blog.js";
import { Comment } from "../models/comments.js";
import { catchAsync } from "../utils/CatchAsync.js";
import { CurrentTime } from "../utils/CurrentDate.js";




const postComment=catchAsync(async (req,res)=>{
    const {id}=req.params;
    const post=await Post.findById(id);
  const comment=req.body.comment;
  comment.date=CurrentTime;
  comment.author=req.user._id;
  comment.post=id;
  const commentobj=new Comment(comment);
  post.comments.push(commentobj);
  await commentobj.save();
  await post.save();
  res.redirect(`/post/${post._id}`); 
  })

const deleteComment=catchAsync(async (req,res,next)=>{
    const{id,Commentid}=req.params;
    await Post.findByIdAndUpdate(id,{$pull:{comments:Commentid}});
    await Comment.findByIdAndDelete(Commentid);
    req.flash('success',"comment deleted successfully");
    res.redirect(`/post/${id}`);
  })


  export{postComment,deleteComment};