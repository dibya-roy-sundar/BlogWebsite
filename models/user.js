import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Post } from "./blog.js";
import { Comment } from "./comments.js";
import { Subscription } from "./subscription.js";
import { Bookmark } from "./bookmarks.model.js";


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
        // delete post and their comments
        const postsToDelete = await Post.find({ author: user._id });
        await Post.deleteMany({author:user._id});
        const commentIdsToDelete = postsToDelete.map(post => post.comments).flat();
        await Comment.deleteMany({ _id: { $in: commentIdsToDelete } });
        
        //delete comments on other posts
        const commentsToDelete = await Comment.find({ author: user._id });
        await Comment.deleteMany({
            author:user._id,
        })
        commentsToDelete.map(async (comment)=>{
            await Post.findByIdAndUpdate(comment.post,{$pull:{comments:comment._id}});
          })


        // delete like on other posts
        await Post.updateMany({likedby:{$in:user._id}},{
            $pull:{likedby:user._id}
        })


        await Subscription.deleteMany({ $or: [{ follower: user._id }, { following: user._id }] });

        await Bookmark.deleteMany({user:user._id});

    }
})
 
 const User=mongoose.model('User',userschema);
 export {User};