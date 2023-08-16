import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import mongoose from "mongoose";


dotenv.config();

// database connection 
const dburl=process.env.ATLAS_URL;
mongoose.connect(dburl)
.then(() => {
  console.log("connected to the mongodb server");
})
.catch((err)=>{
  console.log("mongodb error!!!!");
  console.log(err);
})
// formation of schema
// for blog posts and comments
const postSchema = new mongoose.Schema({
  title:{
    type : String,
    required:[true,"title is a must"]
  },
  content:{
    type :String,
    require:[true,'content field is mandatory']
  }
})
// model formation
const Post=mongoose.model("Post",postSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// const posts = [];

app.get("/", async (req, res) => {
  try{
  const allPosts = await Post.find({});
  res.render("home", {
    home_content: homeStartingContent,
    added_content: allPosts,

  });}
  catch(err){
    console.log(err);
  }
})
// console.log(posts);
// app.post("/",(req,res)=>{

// })

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
app.get("/compose", (req, res) => {
  res.render("compose")
})
  // const post = {
  //   title: req.body.compose_title,
  //   text: req.body.compose_text,
  // }
  // posts.push(post);
  app.post("/compose", async (req, res) => {
  const new_post=new Post({
    title :  req.body.compose_title ,
    content : req.body.compose_text
  })
  await new_post.save()
  .then(()=>{
    console.log("New blog post successfully saved");
    res.redirect("/");
  })
  .catch((err)=>{
    console.log("document insert/save error!!!!");
    console.log(err);
  });
})
// routing parameters
// for(let i=0;i<posts.length;i++){
  //  if (posts[i].title === req.params.postid){
    //   console.log("match found");
    //  }
    // }
  app.get("/post/:postid", async (req, res) => {
  let post_id = req.params.postid.trim();
  try{
    var result =await Post.findById(post_id);
    res.render("post",{
      post_title:result.title,
      post_content:result.content,
      post_id:result._id
    })
  }
    catch(err){
      console.log(err);
    }
  })

  // posts.forEach((post) => {
  //   let title_of_post = post.title;
  //   if (_.lowerCase(title_of_post) === _.lowerCase(post_id)) {
  //     res.render("post", {
  //       post_title: title_of_post,
  //       post_content: post.text,
  //     });
  //   } else {
  //     console.log("match not found");
  //   }
  // lodash.com
  // console.log(req.params.postid);
// })
// by putting rs in terminal we force terminal to restart the server

////////////////////// DELETE /////////////////////////////
app.get("/delete/:deletepostid", async (req,res)=>{
  let delete_id=req.params.deletepostid;
  try{
  const deletedPost = await Post.findOneAndDelete({ _id: delete_id});
  console.log(deletedPost);
  console.log(`blog with id ${delete_id} successfully deleted`);
  res.redirect("/")
  }catch(err){
    console.log(err);
  }
})
////////////////////////////////  UPDATE /////////////////////
    
    app.get("/update/:updatepostid",async (req,res)=>{
      let update_id=req.params.updatepostid;

      try{
        const result=await Post.findById(update_id);
        res.render("update",{
          pre_title:result.title,
          pre_content:result.content,
          id:result._id,
        })
      }catch(err){
        console.log(err)
      }
    })

    app.post("/updateindb/:id", async (req,res)=>{
      const updatedTitle= req.body.newTitle;
      const updatedContent= req.body.newContent;
      const idofupdate=req.params.id.trim();
      // console.log(idofupdate);
      // console.log(updatedContent);
      // console.log(updatedTitle);
      try {
        if (!mongoose.Types.ObjectId.isValid(idofupdate)) {
          return res.status(400).send('Invalid ID'); // Handle invalid ObjectId
        }
    
        const result = await Post.findByIdAndUpdate(idofupdate, {
          content: updatedContent,
          title: updatedTitle,
        }, {
          new: true, // Return the updated document
        });
    
        if (!result) {
          return res.status(404).send('Document not found'); // Handle document not found
        }
    
        res.redirect("/post/"+result._id);
      } catch (err) {
        console.log(err);
        res.status(500).send('Server error'); // Handle server error
      }
    });
    
    /////////////////////////////// read / search ////////////////////////////////
app.post ("/search" , async (req, res)=>{
  const seachtitle=req.body.seachTitle;
  console.log(seachtitle);
  const searchpost= seachtitle; 
  try{ 
  const result=await Post.findOne({
    title:searchpost,
  })
  if (!result) {
    return res.status(404).send("<h1>Post not found</h1>"); // Handle document not found
  }else{
    res.redirect("/post/"+result._id);

  }
} catch (err){
    console.log(err);
  }
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
