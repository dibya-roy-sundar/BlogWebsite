import { Post } from "./models/blog.model.js";
import { Comment } from "./models/comments.model.js";
import { Subscription } from "./models/subscription.model.js";
import { commentschema, postschema } from "./schemas.js";
import { catchAsync } from "./utils/CatchAsync.js";
import { ExpressError } from "./utils/ExpressError.js";

const validatepost=(req,res,next)=>{
    const {error}=postschema.validate(req.body.blog);
    if(error){
        const msg=error.details.map(el =>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
  }

const validatecomment=(req,res,next)=>{
const {error}=commentschema.validate(req.body);
if(error){
    const msg=error.details.map(el =>el.message).join(',');
    throw new ExpressError(msg,400);
}else{
    next();
}
}

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error',"you must be signed in first");
       return res.redirect("/user/login");
    }

        next();
    
}

const storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}

const isAuthor=async (req,res,next)=>{
const {id}=req.params;
const post=await Post.findById(id);
if(!post.author.equals(req.user._id)){
    req.flash('error',"you don't have permission to do that");
    return res.redirect(`/post/${id}`);
}

    next();


}
const isCommentAuthor=async (req,res,next)=>{
    const {Commentid}=req.params;
    const comment=await Comment.findById(Commentid);
    if(!comment.author.equals(req.user._id)){
        req.flash('error',"you don't have permission to do that");
        return res.redirect(`/post/${id}`);
    }
    next();
    
    }

const isUser=async (req,res,next)=>{
    const {id}=req.params;
    // console.log(id);
    // console.log(req.user._id);

    if(!req.user._id.equals(id)){
        req.flash('error',"you don't have permission to do that");
        return res.redirect(`/user/${req.user._id}`);
    }
        next()
    

}    
const isNotUser=async (req,res,next)=>{
    const {id}=req.params;
    // console.log(id);
    // console.log(req.user._id);

    if(req.user._id.equals(id)){
        req.flash('error',"you can't folllow yourself");
        return res.redirect(`/user/${req.user._id}`);
    }
        next()
    

}    
const isNotFollower=async (req,res,next)=>{
    const {id}=req.params;
    const isfollower=await Subscription.find({follower:req.user._id,following:id});
    if(isfollower){
        req.flash('error',"you already  folllowed this person");
        return res.redirect(`/user/${req.user._id}`);
    }
    next();
}

// const storeCurrentTime=async (req,res,next)=>{
//     const post = await Post.findById(req.params.id).populate({path:'comments',populate:{path:'author'}}).populate('author');
//     if(post.comments.length >0){
//         for(let comment of post.comments){
//             const timediff=Date.now()-Number(comment.date);
//             const seconds = Math.floor(timediff / 1000);
//             const minutes = Math.floor(seconds / 60);
//             const hours = Math.floor(minutes / 60);
//             const days = Math.floor(hours / 24);
//             if (seconds < 60) {
//                 comment.showingtime=`${seconds} seconds ago`;
//               } else if (minutes < 60) {
//                 comment.showingtime=`${minutes} minutes ago`;
//               } else if (hours < 24) {
//                 comment.showingtime=`${hours} hours ago`;
//               } else {
//                 comment.showingtime=`${days} days ago`;
//               }
//         }
//     }
// }    

const usernametolowercase=async (req,res,next)=>{
    req.body.username=req.body.username.toLowerCase();
    next();

}


export {validatepost,validatecomment,isLoggedIn,storeReturnTo,isAuthor,isCommentAuthor,isUser,isNotUser,isNotFollower,usernametolowercase};
