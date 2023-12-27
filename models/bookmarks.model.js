import mongoose from "mongoose";

const Schema= mongoose.Schema;

const bookmarkSchema=new Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})

const Bookmark=mongoose.model("Bokkmark",bookmarkSchema);

export {Bookmark};