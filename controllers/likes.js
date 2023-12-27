import { catchAsync } from "../utils/CatchAsync.js";
import { Post } from "../models/blog.js";
import { Like } from "../models/likes.model.js";


const addLike=catchAsync(async (req,res)=>{
    const {id}=req.params;
    const foundlike=await Like.findOne({
        post:id,
        user:req.user._id
    })
    if(!foundlike){

        const like=new Like({
            post:id,
            user:req.user._id
        })
        await like.save();
    }else{
        req.flash('error',"you already liked this");
    }
    res.redirect(`/post/${id}`);
})
const removeLike=catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Like.findOneAndDelete({
        post:id,
        user:req.user._id
    })
    res.redirect(`/post/${id}`);
})


    export {addLike,removeLike};