import mongoose from "mongoose";

const Schema=mongoose.Schema;


const profileSchema=new Schema({
    tagline:String,
    description:String,
    location:String,
    instagramurl:String,
    linkedinurl:String,
    githuburl:String,
    owner:{
      
            type:Schema.Types.ObjectId,
            ref:'User',
       
    }
})
const Profile=mongoose.model('Profile',profileSchema);

export {Profile};