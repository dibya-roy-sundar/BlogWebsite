import { User } from "../models/user.js";
import { catchAsync } from "../utils/CatchAsync.js";


const addBookmark=catchAsync(async (req,res)=>{
        const {id}=req.params;
        const user=await User.findById(req.user._id);
       
        const isBookmarked=user.bookmarks.includes(id);
        if(isBookmarked){
            await user.updateOne({ $pull: { bookmarks: id } }); 
            req.flash('success',"bookmark deleted sucessfully");
        }else{
            user.bookmarks.push(id);
            req.flash('success',"bookmark added sucessfully");
        }

        
         await user.save();
       
         res.redirect(`/post/${id}`);
     

    
})

export {addBookmark};