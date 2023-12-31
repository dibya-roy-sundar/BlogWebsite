import mongoose from "mongoose";
import { Comment } from "./comments.model.js";
import { Like } from "./likes.model.js";
import { Bookmark } from "./bookmarks.model.js";
import { Read } from "./reads.model.js";
import { Tag } from "./tags.model.js";

const Schema=mongoose.Schema;
const postSchema = new Schema({
  title:String,
  content:String,
  date:String,
  likeCount:{
    type: Number,
    default:0
  },
  commentCount:{
    type:Number,
    default:0
  },
  readCount:{
    type:Number,
    default:0
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  tags:[
    {
      type:Schema.Types.ObjectId,
      ref:"Tag"
    }
  ],
 
  image:{
    url:String,
    filename:String
  }
  },{timestamps:true})
  postSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Comment.deleteMany({
          post:doc._id,
        })
        await Like.deleteMany({
          post:doc._id,
        })
        await Bookmark.deleteMany({
          post:doc._id,
        })
        await Read.deleteMany({
          post:doc._id,
        })
        await Tag.deleteMany({
          post:doc._id,
        })
    }
})


    
 
  const Post=mongoose.model("Post",postSchema);
  export {Post};