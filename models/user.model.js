import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { Post } from "./blog.model.js";
import { Comment } from "./comments.model.js";
import { Subscription } from "./subscription.model.js";
import { Bookmark } from "./bookmarks.model.js";
import { Like } from "./likes.model.js";
import { Read } from "./reads.model.js";
import { Tag } from "./tags.model.js";
import { cloudinary } from "../cloudinary/index.cloudinary.js";


const Schema=mongoose.Schema;
const avatarSchema=new Schema({
    url:String,
    filename:String,
})
avatarSchema.virtual('profile').get(function (){
    return this.url.replace('/upload','/upload/w_150,h_150/r_max/f_auto')
  })
avatarSchema.virtual('thumbnail').get(function (){
return this.url.replace('/upload','/upload/w_40,h_40/r_max/f_auto')
})
 const userschema=new Schema({
    email:{
        type:String,
        unique:true,
    },
    googleid:String,
    githubid:String,
    avatar:avatarSchema,
    tagline:String,
    description:String,
    location:String,
    instagramurl:String,
    githuburl:String,
    linkedinurl:String,
    joineddate:String,
   
    
 },{timestamps:true})
 userschema.plugin(passportLocalMongoose);

 userschema.post('findOneAndDelete',async function(user){
    if(user){
      
        const postsToDelete = await Post.find({ author: user._id });
        const deletedpostsids=postsToDelete.flatMap(post => post._id);
        await Comment.deleteMany({post:{$in:deletedpostsids}});
        await Like.deleteMany({post:{$in:deletedpostsids}});
        await Bookmark.deleteMany({post:{$in:deletedpostsids}});
        await Read.deleteMany({post:{$in:deletedpostsids}});
        await Tag.deleteMany({post:{$in:deletedpostsids}});
        postsToDelete.forEach(async (post)=>{
            await cloudinary.uploader.destroy(post.image.filename);
        })
        
        await Post.deleteMany({author:user._id})

        
        await Comment.deleteMany({author:user._id},);
        await Like.deleteMany({user:user._id})
        await Bookmark.deleteMany({user:user._id});
        await Read.deleteMany({user:user._id});
        await Tag.deleteMany({user:user._id});
        

        await Subscription.deleteMany({ $or: [{ follower: user._id }, { following: user._id }] });
        
            if(user.avatar.filename!=='INKCORNER/edeu9anvwm3cfydiulh8'){
                console.log(user.avatar.filename);
                await cloudinary.uploader.destroy(user.avatar.filename);
            }
        

        

    }
})
 
 const User=mongoose.model('User',userschema);
 export {User};