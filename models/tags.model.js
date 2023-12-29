import mongoose from "mongoose";

const Schema=mongoose.Schema;

const tagSchema=new Schema({
    tag:String,
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

const Tag=mongoose.model("Tag",tagSchema)

export {Tag};