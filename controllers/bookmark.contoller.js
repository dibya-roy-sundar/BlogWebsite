import { Bookmark } from "../models/bookmarks.model.js";
import { User } from "../models/user.model.js";
import { catchAsync } from "../utils/CatchAsync.js";

const addBookmark = catchAsync(async (req, res) => {
  const { id } = req.params;
    const foundbookmark=await Bookmark.findOne({
        post: id,
        user: req.user._id,
    })
    if(!foundbookmark){

        const bookmark = new Bookmark({
            post: id,
            user: req.user._id,
        });
        await bookmark.save();
    }else{
        req.flash("errror" ,"you already bookmarked this");
    }
  req.flash("success", "bookmark added sucessfully");

  res.redirect(`/post/${id}`);
});
const removeBookmark = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Bookmark.findOneAndDelete({ post: id, user: req.user._id });
  req.flash("success", "bookmark removed sucessfully");
  res.redirect(`/post/${id}`);
});

export { addBookmark,removeBookmark };
