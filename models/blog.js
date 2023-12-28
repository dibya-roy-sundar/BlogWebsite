import mongoose from "mongoose";
import { Comment } from "./comments.js";
import { Like } from "./likes.model.js";
import { Bookmark } from "./bookmarks.model.js";
import { Read } from "./reads.model.js";

const Schema=mongoose.Schema;
const postSchema = new Schema({
  title:String,
  content:String,
  date:String,
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  likeCount:{
    type:String,
    default:0
  },
  commentCount:{
    type:String,
    default:0
  },
  readCount:{
    type:String,
    default:0
  },
 
  // image:String,
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
        
    }
})


    
 
  const Post=mongoose.model("Post",postSchema);
  export {Post};