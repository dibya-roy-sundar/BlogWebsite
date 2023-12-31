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

const router = express.Router({ mergeParams: true });

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
  .post(isLoggedIn, isUser, updateProfile);

router.get("/bookmarks", isLoggedIn, isUser, showBookmarks);

router.get("/follow", isLoggedIn, isNotUser, follow);
router.get("/unfollow", isLoggedIn, isNotUser, unFollow);

export default router;
