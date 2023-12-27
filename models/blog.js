import mongoose from "mongoose";
import { Comment } from "./comments.js";

const Schema=mongoose.Schema;
const postSchema = new Schema({
  title:String,
  content:String,
  date:String,
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  // image:String,
  comments:[
    {
        type: Schema.Types.ObjectId,
        ref:'Comment',
    },
 
]  ,
likedby:[{
  type:Schema.Types.ObjectId,
  ref:'User',
}]
  },{timestamps:true})
  postSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Comment.deleteMany({
            _id:{$in:doc.comments}
        })
    }
})


    
 
  const Post=mongoose.model("Post",postSchema);
  export {Post};