import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { oauthController } from "../controllers/oauth.controller.js";
import GitHubStrategy from "passport-github2";
import { storeJoinedDate } from "../utils/CurrentDate.js";
import { cloudinary } from "../cloudinary/index.cloudinary.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // passport callback functiom
      // console.log(profile);
      try {
        // console.log("passport callback function fired");
        const user = await User.findOne({ googleid: profile.id });

        if (!user) {
          const response=await cloudinary.uploader.upload(profile.photos[0].value,{folder:'INKCORNER'})
          // console.log(response);
          const avatar={
            url:response.url,
            filename:response.public_id,
          }
          
          const newuser = new User({
            googleid: profile.id,
            username: profile.name.givenName,
            email: profile.emails[0].value,
            joineddate:storeJoinedDate(new Date()),
            avatar:avatar,
            edited:true,
          });
          // user avatar :: 
          await newuser.save();
          done(null, newuser);
        } else {
          done(null, user);
        }
        // console.log(profile);
      } catch (err) {
        // console.error(err);
        done(err, null);
      }
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("passport callback function fired");
      console.log(profile);
      try {
        const user = await User.findOne({ githubid: profile.id });


        if (!user) {
          const response=await cloudinary.uploader.upload(profile.photos[0].value,{folder:'INKCORNER'})
          // console.log(response);
          const avatar={
            url:response.url,
            filename:response.public_id,
          }
          
          const newuser = new User({
            githubid: profile.id,
            username: profile.username,
            joineddate:storeJoinedDate(new Date()),
            avatar:avatar,
            edited:true,
          });
          await newuser.save();
          done(null, newuser);
        } else {
          done(null, user);
        }
      } catch (err) {
        // console.log(err);
        done(err, null);
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureFlash: true,
    failureRedirect: "/user/login",
  }),
  oauthController
);

router.get("/github", passport.authenticate("github", { scope: ["profile"] })),
  router.get(
    "/github/callback",
    passport.authenticate("github", {
      failureFlash: true,
      failureRedirect: "/user/login",
    }),
    oauthController
  );

export default router;
// import  { Strategy as LinkedInStrategy }from "passport-linkedin-oauth2";
// router.get("/linkedin",passport.authenticate('linkedin',{ state: 'SOME STATE'  }), function(req, res){
//     // The request will be redirected to LinkedIn for authentication, so this
//     // function will not be called.
//   } );
// router.get("/linkedin/callback",passport.authenticate('linkedin',{ failureFlash:true,failureRedirect:"/user/login"}),oauthController)
// passport.use(new LinkedInStrategy({
//     clientID:process.env.LINKEDIN_CLIENT_ID,
//     clientSecret:process.env.LINKEDIN_CLIENT_SECRET,
//     callbackURL:'/auth/linkedin/callback',
//     profileFields: ['id', 'first-name', 'last-name', 'picture-url', 'public-profile-url', 'email-address'],
//     scope: ['email', 'profile','openid'],

// }, async (accessToken,refreshToken,profile,done)=>{
//     // passport callback functiom
//     // console.log("passport callback function fired");
//     res.send("passport callback function fired");
//     // process.nextTick(async function(profile,done){
//     //     try{
//     //         console.log(profile);
//     //         const user=await User.findOne({linkedinid:profile.id});

//     //         if(!user){

//     //                 const newuser=new User({linkedinid:profile.id,username:profile.name.givenName,email:profile.emails[0].value});
//     //                 // user avatar :: profile.photos.value
//     //                 await newuser.save();
//     //                 return done(null,newuser);

//     //         }else{
//     //            return  done(null,user);

//     //         }
//     //         // console.log(profile);
//     //     }catch (err) {

//     //         // console.error(err);
//     //        return  done(err, null);
//     //     }
//     // })

// }))
