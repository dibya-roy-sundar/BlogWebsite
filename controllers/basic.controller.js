import { Post } from "../models/blog.model.js";
import { Subscription } from "../models/subscription.model.js";
import { catchAsync } from "../utils/CatchAsync.js";



  const nestedSort = (a, b) => {
      
    if (a.readCount < b.readCount) return 1;
    if (a.readCount > b.readCount) return -1;
  
   
    if (a.likeCount < b.likeCount) return 1;
    if (a.likeCount > b.likeCount) return -1;
  
  
    if (a.commentCount < b.commentCount) return 1;
    if (a.commentCount > b.commentCount) return -1;
  
   
    return 0;
  };


const home=catchAsync(async (req, res) => {
      // const posts = await Post.aggregate([
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "author",
      //       foreignField: "_id",
      //       as: "owner",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "likes",
      //       localField: "_id",
      //       foreignField: "post",
      //       as: "liked",
      //     },
      //   },
      //   {
      //     $addFields: {
      //       likeCount: {
      //         $size: "$liked",
      //       },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "comments",
      //       localField: "_id",
      //       foreignField: "post",
      //       as: "commented",
      //     },
      //   },
      //   {
      //     $addFields: {
      //       commentCount: {
      //         $size: "$commented",
      //       },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "reads",
      //       localField: "_id",
      //       foreignField: "post",
      //       as: "read",
      //     },
      //   },
      //   {
      //     $addFields: {
      //       readCount: {
      //         $size: "$read",
      //       },
      //     },
      //   },
      //   {
      //     $sort: {
      //       readCount: -1,
      //       likeCount: -1,
      //       commentCount: -1,
      //     },
      //   }
      // ]);
      // virtual property not applicable in mongodb aggregation pippeline
      const posts=await Post.find({}).populate('author');
      
      const following_page=false;
      
      
     
      posts.sort(nestedSort);
      


    
      res.render("home", {
        
        posts,
        following_page,
      });
    });

const following=catchAsync(async (req,res)=>{
  const userFollowing=await Subscription.find({follower: req.user._id});
  
  const followingUserIds = userFollowing.map(subscription => subscription.following);
  const posts=await Post.find({author:{$in:followingUserIds}}).populate('author');
      const following_page=true;

      
      
     
      posts.sort(nestedSort);
      


    
      res.render("following", {
        
        posts,
        following_page
      });
})
  

  const about= (req, res) => {
    res.render("about", {
      about_content: aboutContent,
    });
  }

  const contact= (req, res) => {
    res.render("contact", {
      contact_content: contactContent,
    });
  }

  export {home,about,contact,following};
  
  