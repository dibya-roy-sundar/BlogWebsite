import { Tag } from "../models/tags.model.js";
import { catchAsync } from "../utils/CatchAsync.js";


const showTagRelatedPosts=catchAsync(async (req,res)=>{
const {tag}=req.params;
// console.log(tag);

const tags=await Tag.find({tag}).populate({path:'post',populate:{path:'author'}})
// .populate({path:'comments',populate:{path:'author'}})

// const alltags = await Tag.distinct('tag');

res.render('blogs/tag',{tags,tag});  

})

export {showTagRelatedPosts}