import mongoose from "mongoose"
import { Post } from "./blog.js";
const Schema=mongoose.Schema;
const commentSchema=new Schema({
    body:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
      },
    date:String,
    post:{
      type:Schema.Types.ObjectId,
        ref:'Post'

    }
},{timestamps:true})

 
const Comment=mongoose.model('Comment',commentSchema);
export {Comment};