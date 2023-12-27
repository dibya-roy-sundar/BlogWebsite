import { Bookmark } from "../models/bookmarks.model.js";
import { User } from "../models/user.js";
import { catchAsync } from "../utils/CatchAsync.js";


const addBookmark=catchAsync(async (req,res)=>{
        const {id}=req.params;
       
        const isBookmarked=await Bookmark.findOne({
            post:id,
            user:req.user._id,
        })
        if(isBookmarked){
            await Bookmark.findOneAndDelete({ post:id,
                user:req.user._id,}) 
            req.flash('success',"bookmark deleted sucessfully");
        }else{
            const bookmark=new Bookmark({
                post:id,
                user:req.user._id,
            })
            await bookmark.save();
            req.flash('success',"bookmark added sucessfully");
        }

        
       
         res.redirect(`/post/${id}`);
     

    
})

export {addBookmark};