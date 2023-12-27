
const oauthController= (req,res)=>{
    // console.log("you reached the callback url");
    
    req.flash("success",`Hey  ${req.user.username} , welcome to Ink Corner Blogs`);
    res.redirect("/");
};

export {oauthController};