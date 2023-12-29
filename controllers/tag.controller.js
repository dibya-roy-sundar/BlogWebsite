import { Tag } from "../models/tags.model.js";
import { catchAsync } from "../utils/CatchAsync.js";


const showTagRelatedPosts=catchAsync(async (req,res)=>{
const {tag}=req.params;

const tags=await Tag.find({tag}).populate({path:'post',populate:{path:'author'},populate:{path:'tags'}})
// .populate({path:'comments',populate:{path:'author'}})

const alltags = await Tag.distinct('tag');

res.render('blogs/tag',{tags,tag,alltags});  

})

export {showTagRelatedPosts}