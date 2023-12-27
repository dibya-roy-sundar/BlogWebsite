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

 


const Read=mongoose.model("Read",readSchema);

export {Read};