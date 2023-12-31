import mongoose from "mongoose";
import { Post } from "../models/blog.model.js";
import { catchAsync } from "../utils/CatchAsync.js";
import { storeJoinedDate } from "../utils/CurrentDate.js";
import { ExpressError } from "../utils/ExpressError.js";
import { Bookmark } from "../models/bookmarks.model.js";
import { Like } from "../models/likes.model.js";
import { Comment } from "../models/comments.model.js";
import { Read } from "../models/reads.model.js";
import { Tag } from "../models/tags.model.js";
import { cloudinary } from "../cloudinary/index.cloudinary.js";

const newForm = (req, res) => {
  res.render("blogs/new");
};

const composePost = catchAsync(async (req, res) => {
  // console.log(req.body.tags);
  const image={
    url:req.file.path,
    filename:req.file.filename,
  }
  const post = new Post({
    ...req.body.blog,
    date: storeJoinedDate(new Date()),
    author: req.user._id,
    image:image
  });
  await post.save();
  const tagarray = req.body.tags.split(",");
  for (const tag of tagarray) {
    const newtag = new Tag({
      tag: tag,
      post: post._id,
      user: req.user._id,
    });
    await newtag.save();
    post.tags.push(newtag);
    await post.save();
  }

  res.redirect(`/post/${post._id}`);
});

const showPost = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (req.user) {
    const foundRead = await Read.findOne({ post: id, user: req.user._id });
    if (!foundRead) {
      const read = new Read({ post: id, user: req.user._id });
      await read.save();
    }
    res.locals.isbookmarked = await Bookmark.findOne({
      post: id,
      user: req.user._id,
    });
    res.locals.isliked = await Like.findOne({ post: id, user: req.user._id });
  }

  const comments = await Comment.find({ post: id }).populate("author");

  const post = await Post.findById(id).populate("author").populate("tags");
  // .populate({path:'comments',populate:{path:'author'}})

  res.render("blogs/post", {
    post,
    comments,
  });
});

const deletePost = catchAsync(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id.trim());

  res.redirect("/");
});

const editForm = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id.trim()).populate('tags');
  const tags=post.tags.map(tag => tag.tag);
  res.render("blogs/edit", {
    post,tags
  });
});

const updateCampground = catchAsync(async (req, res) => {
  const idofupdate = req.params.id.trim();
  const post=await Post.findById(idofupdate).populate('tags');

  // const oldTag=post.tags.map(tag => tag.tag)
  // const newTag = req.body.tags.split(",");

  // const addedTags=newTag.filter(tag =>!oldTag.includes(tag))
  // const removeTags=oldTag.filter(tag =>!newTag.includes(tag))
  // //adding in tags array
  // for (const tag of addedTags) {
  //   const newtag = new Tag({
  //     tag: tag,
  //     post: post._id,
  //     user: req.user._id,
  //   });
  //   await newtag.save();
  //   post.tags.push(newtag);
  //   await post.save();
  // }
  // // remove 
  // await Tag.deleteMany({post:post._id,tag:{$in:removeTags}});
  // post.tags=post.tags.filter(tag => !removeTags.includes(tag.tag));
  

  post.title=req.body.blog.title;
  post.content=req.body.blog.content;
  post.date=storeJoinedDate(new Date());

  if(req.file){
    await cloudinary.uploader.destroy(post.image.filename);
    post.image={
      url:req.file.path,
    filename:req.file.filename,
    }

  }
  
  await post.save(); 


  res.redirect(`/post/${post._id}`);
});

export {
  newForm,
  composePost,
  showPost,
  deletePost,
  editForm,
  updateCampground,
};
