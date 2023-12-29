import mongoose from "mongoose";

const Schema=mongoose.Schema;

const tagSchema=new Schema({
    tag:String,
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
})

const Tag=mongoose.model("Tag",tagSchema)

export {Tag};