import express from "express";
import {
  addEmail,
  addEmailForm,
  changePasswordForm,
  changeUserPassword,
  deleteAccount,
  follow,
  profileUPdateForm,
  showBookmarks,
  unFollow,
  updateProfile,
  userProfile,
} from "../controllers/profile.controller.js";
import { isLoggedIn, isNotUser, isUser } from "../middleware.js";
import multer from "multer";
import { storage } from "../cloudinary/index.cloudinary.js";

const router = express.Router({ mergeParams: true });
const upload=multer({storage})


router.get("/", userProfile);
router.delete("/deleteaccount", isLoggedIn, isUser, deleteAccount);
router
  .route("/addemail")
  .get(isLoggedIn, isUser, addEmailForm)
  .post(isLoggedIn, isUser, addEmail);

router
  .route("/changepassword")
  .get(isLoggedIn, isUser, changePasswordForm)
  .post(isLoggedIn, isUser, changeUserPassword);

router
  .route("/edit")
  .get(isLoggedIn, isUser, profileUPdateForm)
  .post(isLoggedIn, isUser,upload.single('avatar'), updateProfile);

router.get("/bookmarks", isLoggedIn, isUser, showBookmarks);

router.get("/follow", isLoggedIn, isNotUser, follow);
router.get("/unfollow", isLoggedIn, isNotUser, unFollow);

export default router;
