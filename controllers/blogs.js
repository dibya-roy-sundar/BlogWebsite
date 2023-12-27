import mongoose from "mongoose";
import { Post } from "../models/blog.js";
import { catchAsync } from "../utils/CatchAsync.js";
import { CurrentDate } from "../utils/CurrentDate.js";
import { ExpressError } from "../utils/ExpressError.js";
import { Bookmark } from "../models/bookmarks.model.js";
import { Like } from "../models/likes.model.js";


const newForm=(req, res) => {
    res.render('blogs/new');
  }

const composePost=catchAsync(async (req, res) => {
  const post = new Post(req.body.blog);
    post.date=CurrentDate;
    post.author=req.user._id;
    await post.save();
  
    // console.log("New blog post successfully saved");
    res.redirect(`/post/${post._id}`);
  })
 
const showPost=catchAsync(async (req, res) => {
    let post_id = req.params.id.trim();
    
    if(req.user){

      res.locals.isbookmarked=await Bookmark.findOne({post:post_id,user:req.user._id});
      res.locals.isliked=await Like.findOne({post:post_id,user:req.user._id});
    }
    
    const post = await Post.findById(post_id).populate({path:'comments',populate:{path:'author'}}).populate('author');
    res.locals.commentbycuurentuser=0;
    if(post.comments.length>0 && req.user){
     
      for(let comment of post.comments){
        if(comment.author.equals(req.user._id)){
          res.locals.commentbycuurentuser=1;
          break;
        }
      }
    }
  

    res.render('blogs/post', {
      post
    })
  
  })  

const deletePost= catchAsync(async (req, res) => {
  
  
    await Post.findByIdAndDelete(req.params.id.trim());
  
  
    res.redirect("/");
  
  })  
 
const editForm= catchAsync(async (req, res) => {
  
  
  
const post = await Post.findById(req.params.id.trim());
res.render('blogs/edit', {
    post
})

})

const updateCampground=catchAsync(async (req, res) => {
    const idofupdate = req.params.id.trim();
  
  
    if (!mongoose.Types.ObjectId.isValid(idofupdate)) {
        throw new ExpressError('Invalid Id',400);
    }
    const blog=req.body.blog;
    blog['date']=CurrentDate;
  
    const result = await Post.findByIdAndUpdate(idofupdate, blog
      , {
        new: true, // Return the updated document
        runValidators: true,
      });
  
    if (!result) {
        throw new ExpressError('Document not found',400);
    }
  
    res.redirect("/post/" + result._id);
  
  })




  export {newForm,composePost,showPost,deletePost,editForm,updateCampground};