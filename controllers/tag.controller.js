import { Tag } from "../models/tags.model.js";
import { catchAsync } from "../utils/CatchAsync.js";


const showTagRelatedPosts=catchAsync(async (req,res)=>{
const {tag}=req.params;


const tags=await Tag.find({tag}).populate({path:'post',populate:{path:'author'}})
// .populate({path:'comments',populate:{path:'author'}})


res.render('blogs/tag',{tags,tag});  

})

export {showTagRelatedPosts}