import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import mongoose from "mongoose";
import methodOverride from 'method-override';
import ejsMate from "ejs-mate";
import cors from "cors";
import { Post } from "./models/blog.js";
import { ExpressError } from "./utils/ExpressError.js";
import { catchAsync } from "./utils/CatchAsync.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import postRoutes from "./routes/blogs.js";
import commentRoutes from "./routes/comments.js";
import userRoutes from "./routes/user.js";
import likeRoutes from "./routes/likes.js";
import oauthRoutes from "./routes/oauth.js";
import profileRoutes from "./routes/profile.js";
import bookmarkRoutes from "./routes/bookmark.js";
import { Like } from "./models/likes.model.js";
import { User } from "./models/user.js";


dotenv.config();

// database connection 

const dburl = process.env.ATLAS_URL;
mongoose.connect(dburl)
  .then(() => {
    console.log("successfully connected to the mongodb server");
  })
  .catch((err) => {
    console.log("mongodb connection  error!!!!");
    console.log(err);
    process.exit(1);
  })


const home_content = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();


// app.use(cors({
//   origin:process.env.CORS_ORIGIN,
//   credentials:true,
// }))
// app.use(express.json({limit:"16kb"}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const sessionconfig={
  secret:"thisismyblog",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge:1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
})






app.get("/", async (req, res) => {
  try {
    // const posts = await Post.find({}).populate('author'); 
   const posts=await Post.aggregate([
    {
      $lookup:{
        from:"users",
        localField:"author",
        foreignField:"_id",
        as:"owner"
      }

    },
    {
      $lookup:{
        from:"likes",
        localField:"_id",
        foreignField:"post",
        as:"liked"
      }

    },
    {
      $addFields:{
        likeCount:{
          $size:"$liked"
        }
      }
    },
    {
      $lookup:{
        from:"comments",
        localField:"_id",
        foreignField:"post",
        as:"commented"
      }

    },
    {
      $addFields:{
        commentCount:{
          $size:"$commented"
        }
      }
    },
    {
      $lookup:{
        from:"reads",
        localField:"_id",
        foreignField:"post",
        as:"read"
      }

    },
    {
      $addFields:{
        readCount:{
          $size:"$read"
        }
      }
    },
   ])

  

    res.render("home", {
      home_content,
      posts

    });
  }
  catch (err) {
    console.log(err);
  }
})


app.get("/about", (req, res) => {
  res.render("about", {
    about_content: aboutContent,
  })

})

app.get("/contact", (req, res) => {
  res.render("contact", {
    contact_content: contactContent,
  })
})


app.use("/auth",oauthRoutes);
app.use("/user",userRoutes);
app.use("/user/:id",profileRoutes);
app.use("/post",postRoutes);
app.use("/post/:id/comment",commentRoutes);
app.use("/post/:id/like",likeRoutes);
app.use("/post/:id/bookmark",bookmarkRoutes);

/////////////////////////////// read / search ////////////////////////////////
app.post("/search", catchAsync(async (req, res) => {
  const seachtitle = req.body.seachTitle;
  console.log(seachtitle);
  const searchpost = (_.lowerCase(seachtitle)).replace(/\s+/g, '');
  // remove space by replace

  const result = await Post.find({
    title: { $regex: new RegExp(searchpost, 'i') },
    // for caseinsensetive  searching
  })
  if (!result) {
    return res.status(404).send("<h1>Post not found</h1>"); // Handle document not found
  } else {
    res.render('blogs/search', {
      content: result,

    });

  }

}))



app.all('*', (req, res, next) => {
  next(new ExpressError("page not found", 404));
})
app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if(!err.message){
    err.message="something went wrong!!!" ;
  }
  res.status(statusCode).render('error',{err});
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
