import mongoose from "mongoose";
import { Post } from "./blog.model.js";

const Schema= mongoose.Schema;

const likeSchema=new Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})



likeSchema.post('save',async (like)=>{
    const post=await Post.findById(like.post);
    post.likeCount += 1;
    await post.save();
  })
  likeSchema.post('findOneAndDelete',async (like)=>{
    const post=await Post.findById(like.post);
    post.likeCount -= 1;
    await post.save();
  })
  

const Like=mongoose.model("Like",likeSchema);

export {Like};