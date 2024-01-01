import { Post } from "../models/blog.model.js";
import { Subscription } from "../models/subscription.model.js";
import { catchAsync } from "../utils/CatchAsync.js";



const home_content =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
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
      

      
      
     
      posts.sort(nestedSort);
      


    
      res.render("home", {
        home_content,
        posts,
      });
    });

const following=catchAsync(async (req,res)=>{
  const userFollowing=await Subscription.find({follower: req.user._id});
  console.log(userFollowing);
  const followingUserIds = userFollowing.map(subscription => subscription.following);
  const posts=await Post.find({author:{$in:followingUserIds}}).populate('author');
      

      
      
     
      posts.sort(nestedSort);
      


    
      res.render("home", {
        home_content,
        posts,
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
  
  