import mongoose from "mongoose";
import { Post } from "../models/blog.js";
import { catchAsync } from "../utils/CatchAsync.js";
import { CurrentDate, storeJoinedDate } from "../utils/CurrentDate.js";
import { ExpressError } from "../utils/ExpressError.js";
import { Bookmark } from "../models/bookmarks.model.js";
import { Like } from "../models/likes.model.js";
import { Comment } from "../models/comments.js";
import { Read } from "../models/reads.model.js";


const newForm=(req, res) => {
    res.render('blogs/new');
  }

const composePost=catchAsync(async (req, res) => {
  const post = new Post({
  ...req.body.blog,
  date:storeJoinedDate(new Date()),
  author:req.user._id,
  });

    await post.save();
  
    // console.log("New blog post successfully saved");
    res.redirect(`/post/${post._id}`);
  })
 
const showPost=catchAsync(async (req, res) => {
    let {id} = req.params.id.trim();
    
    if(req.user){
      const foundRead=await Read.findOne({post:id,user:req.user._id});
      if(!foundRead){
        const read=new Read({post:id,user:req.user._id});
        await read.save();
      }  
      res.locals.isbookmarked=await Bookmark.findOne({post:id,user:req.user._id});
      res.locals.isliked=await Like.findOne({post:id,user:req.user._id});
      res.locals.iscommented=await Comment.findOne({post:id,user:req.user._id});
    }
   
    const comments=await Comment.find({post:id}).populate('author');
    
    const post = await Post.findById(id).populate('author');
    // .populate({path:'comments',populate:{path:'author'}})
  

    res.render('blogs/post', {
      post,comments
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