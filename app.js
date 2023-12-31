import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import cors from "cors";
import { ExpressError } from "./utils/ExpressError.js";
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
import tagRoutes from "./routes/tags.route.js";
import searchRoutes from "./routes/search.route.js";
import basicRoutes from "./routes/basic.route.js";


dotenv.config();

// database connection

const dburl = process.env.ATLAS_URL;
mongoose
  .connect(dburl)
  .then(() => {
    console.log("successfully connected to the mongodb server");
  })
  .catch((err) => {
    console.log("mongodb connection  error!!!!");
    console.log(err);
    process.exit(1);
  });


  const app = express();

// app.use(cors({
//   origin:process.env.CORS_ORIGIN,
//   credentials:true,
// }))
// app.use(express.json({limit:"16kb"}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const sessionconfig = {
  secret: "thisismyblog",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});



app.use("/auth", oauthRoutes);
app.use("/user", userRoutes);
app.use("/user/:id", profileRoutes);
app.use("/post", postRoutes);
app.use("/post/:id/comment", commentRoutes);
app.use("/post/:id/like", likeRoutes);
app.use("/post/:id/bookmark", bookmarkRoutes);
app.use("/tag/:tag", tagRoutes);
app.use("/search",searchRoutes);
app.use("/",basicRoutes);



app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "something went wrong!!!";
  }
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
