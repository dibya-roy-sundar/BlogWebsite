import { User } from "../models/user.model.js";
import { catchAsync } from "../utils/CatchAsync.js";
import { storeJoinedDate } from "../utils/CurrentDate.js";

const registerForm = (req, res) => {
  res.render("users/register");
};
const loginForm = (req, res) => {
  res.render("users/login");
};
const register = catchAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const joineddate=storeJoinedDate(new  Date())
    const user = new User({ email, username,joineddate });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (e) => {
      if (e) {
        return next(e);
      } else {
        req.flash("success", "welcome to Ink Corner Blogs");
        res.redirect("/");
      }
    });
  } catch (e) {
    req.flash("error", e.message); //for same username
    res.redirect("/user/register");
  }
});

const login = catchAsync(async (req, res) => {
  req.flash("success", `welcome back  ${req.user.username}`);
  const redirectUrl = res.locals.returnTo || "/";
  res.redirect(redirectUrl);
});

const logout = (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      return next(e);
    } else {
      //   req.flash("success", "good bye!");
      res.redirect("/");
    }
  });
};

const forgotForm = (req, res) => {
  res.render("users/forgot");
};

const forgotPassword = catchAsync(async (req, res) => {
  const { email, username } = req.body;
  const user = await User.findOne({ email, username });
  if (!user) {
    req.flash("error", "no user found with these credentials");
    return res.redirect("/user/forgot");
  }
  res.render("users/setpassword",{user});
});



const setuserpassword =catchAsync( async (req, res) => {
const {newPassword}=req.body;
const userid=req.query.userid;
const user=await User.findById(userid);


  user.setPassword(newPassword, function(err,user){
      if (err) {
               req.flash('success',"Password could not be saved.Please try again!")
               res.redirect('/user/forgot')
          
      } else {
    req.flash('success',"Your new password has been saved successfully")
               res.redirect('/user/login')
          
       
                   }
                   });
});

export {
  registerForm,
  loginForm,
  register,
  login,
  logout,
  forgotForm,
  forgotPassword,
  setuserpassword
};
