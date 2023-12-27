import { catchAsync } from "../utils/CatchAsync.js";
import { Post } from "../models/blog.js";

const countLikes= catchAsync(async (req,res)=>{
    const post=await Post.findById(req.params.id);
    if(req.user){
        const isLiked=post.likedby.includes(req.user._id);
    
        if(isLiked){
            await post.updateOne({ $pull: { likedby: req.user._id } }); 
            
        }else{
            post.likedby.push(req.user._id);
                    
        }
        
    
    }
    await post.save();
    res.redirect(`/post/${post._id}`);
    
    })

    export {countLikes};