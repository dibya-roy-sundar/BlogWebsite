import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Post } from "./blog.js";
import { Comment } from "./comments.js";
import { Subscription } from "./subscription.js";
import { Bookmark } from "./bookmarks.model.js";
import { Like } from "./likes.model.js";


const Schema=mongoose.Schema;
 const userschema=new Schema({
    email:{
        type:String,
        unique:true,
    },
    googleid:String,
    githubid:String,
    iamge:String,
    tagline:String,
    description:String,
    location:String,
    instagramurl:String,
    linkedinurl:String,
    githuburl:String,
    
 },{timestamps:true})
 userschema.plugin(passportLocalMongoose);

 userschema.post('findOneAndDelete',async function(user){
    if(user){
      
        const postsToDelete = await Post.find({ author: user._id });
        await Comment.deleteMany({post:{$in:postsToDelete}});
        await Like.deleteMany({post:{$in:postsToDelete}});
        await Bookmark.deleteMany({post:{$in:postsToDelete}});
        
        await Post.deleteMany({author:user._id})

        await Comment.deleteMany({author:user._id});
        await Like.deleteMany({user:user._id})
        await Bookmark.deleteMany({user:user._id});

        await Subscription.deleteMany({ $or: [{ follower: user._id }, { following: user._id }] });
        

    }
})
 
 const User=mongoose.model('User',userschema);
 export {User};