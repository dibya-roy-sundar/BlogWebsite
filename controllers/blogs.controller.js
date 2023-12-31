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

const newForm = (req, res) => {
  res.render("blogs/new");
};

const composePost = catchAsync(async (req, res) => {
  // console.log(req.body.tags);
  const post = new Post({
    ...req.body.blog,
    date: storeJoinedDate(new Date()),
    author: req.user._id,
  });
  await post.save();
  const tagarray = req.body.tags.split(",");
  for (const tag of tagarray) {
    const newtag = await new Tag({
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
  const post = await Post.findById(req.params.id.trim());
  res.render("blogs/edit", {
    post,
  });
});

const updateCampground = catchAsync(async (req, res) => {
  const idofupdate = req.params.id.trim();

  if (!mongoose.Types.ObjectId.isValid(idofupdate)) {
    throw new ExpressError("Invalid Id", 400);
  }
  const blog = req.body.blog;
  blog.date = storeJoinedDate(new Date());

  const result = await Post.findByIdAndUpdate(idofupdate, blog, {
    new: true, // Return the updated document
    runValidators: true,
  });

  if (!result) {
    throw new ExpressError("Document not found", 400);
  }

  res.redirect("/post/" + result._id);
});

export {
  newForm,
  composePost,
  showPost,
  deletePost,
  editForm,
  updateCampground,
};