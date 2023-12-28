import mongoose from "mongoose";
import { Post } from "./blog";

const Schema= mongoose.Schema;

const readSchema=new Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})

 
readSchema.post('save',async (read)=>{
    const post=await Post.findById(read.post);
    post.readCount += 1;
    await post.save();
  })


const Read=mongoose.model("Read",readSchema);

export {Read};