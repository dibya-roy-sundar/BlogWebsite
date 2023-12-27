import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Post } from "./blog.js";
import { Comment } from "./comments.js";
import { Profile } from "./profile.js";
import { Subscription } from "./subscription.js";


const Schema=mongoose.Schema;
 const userschema=new Schema({
    email:{
        type:String,
        unique:true,
    },
    googleid:String,
    githubid:String,
    // thumbnail:String,
    bookmarks:[{
        type: Schema.Types.ObjectId,
        ref:'Post',
    }],
    profile:{
        type: Schema.Types.ObjectId,
        ref:'Profile',
    },
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

        await Profile.findByIdAndDelete({owner:new mongoose.Types.ObjectId(user._id)});

        await Subscription.deleteMany({ $or: [{ follower: user._id }, { following: user._id }] });

    }
})
 
 const User=mongoose.model('User',userschema);
 export {User};