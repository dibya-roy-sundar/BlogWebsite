import mongoose from "mongoose";
import { Post } from "../models/blog.js";
import { Profile } from "../models/profile.js";
import { Subscription } from "../models/subscription.js";
import { User } from "../models/user.js";
import { catchAsync } from "../utils/CatchAsync.js";
import { storeJoinedDate } from "../utils/CurrentDate.js";

const userProfile = catchAsync(async (req, res) => {
    
const {id}=req.params;
const user = await User.findById(id).populate("profile");
const posts = await Post.find({ author: user._id }).populate("author");
const joineddate = storeJoinedDate(user.createdAt);
const followings=await Subscription.find({follower:user._id})
const followers=await Subscription.find({following:user._id});
const isfollower= followers.some(follower => follower.follower === req.user._id)?true:false;
  

  res.render("users/profile", { user, joineddate, posts,followings,followers,isfollower });
});

const deleteAccount = catchAsync(async (req, res) => {
  const { id } = req.params;
  req.session.destroy((e) => {
    if (e) {
      return next(e);
    }
  });
  await User.findByIdAndDelete(id);
  res.redirect("/");
});

const addEmailForm = (req, res) => {
  const { id } = req.params;
  res.locals.emailform = 1;
  res.redirect(`/user/${id}`);
};

const addEmail = catchAsync(async (req, res) => {
  const { id } = req.params.id;
  const user = await User.findById(id);
  user.email = req.body.email;
  await user.save();
  req.flash("success", "email added successfully");
  res.redirect(`/user/${id}`);
});

const changePasswordForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  res.render("users/password", { user });
});

const changeUserPassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash("error", "user not foud");
    return res.redirect(`/user/${id}/changepassword`);
  }
  user.changePassword(
    req.body.oldPassword,
    req.body.newPassword,
    function (err) {
      if (err) {
        if (err.name === "IncorrectPasswordError") {
          req.flash("error", "incorrect password!");
          return res.redirect(`/user/${id}/changepassword`);
        } else {
          req.flash(
            "error",
            "Something went wrong!! Please try again after sometimes."
          );
          return res.redirect(`/user/${id}/changepassword`);
        }
      } else {
        req.flash("success", "Your password has been changed successfully");
        return res.redirect(`/user/${id}`);
      }
    }
  );
});

const profileUPdateForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  res.render("users/editprofile", { user });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    tagline,
    description,
    location,
    instagramurl,
    linkedinurl,
    githuburl,
  } = req.body;
  const user = await User.findById(id);
  const profile = await Profile.findById(user.profile);
  if (profile) {
    await Profile.findByIdAndUpdate(user.profile, {
      tagline,
      description,
      location,
      instagramurl,
      linkedinurl,
      githuburl,
    });
  } else {
    const newprofile = new Profile({
      tagline,
      description,
      location,
      instagramurl,
      linkedinurl,
      githuburl,
    });
    newprofile.owner=user._id;
    user.profile = newprofile;
    await newprofile.save();
    await user.save();
  }
  res.redirect(`/user/${id}`);
});

const showBookmarks = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("bookmarks");

  res.render("users/bookmarks", { user });
});

const follow = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id); //channel

  if (!user) {
    req.flash("error", "no user found!!!!");
    res.redirect(`/user/${req.user._id}`);
  }
  const subscription = new Subscription({
    follower: req.user._id,
    following: user._id,
  });
  await subscription.save();

  res.redirect(`/user/${user._id}`);
});

const unFollow = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id); //channel

  if (!user) {
    req.flash("error", "no user found!!!!");
    res.redirect(`/user/${req.user._id}`);
  }
  await Subscription.findOneAndDelete({
    follower: req.user._id,
    following: user._id,
  });

  res.redirect(`/user/${user._id}`);
});

export {
  userProfile,
  deleteAccount,
  addEmailForm,
  addEmail,
  changePasswordForm,
  changeUserPassword,
  profileUPdateForm,
  updateProfile,
  showBookmarks,
  follow,
  unFollow,
};
