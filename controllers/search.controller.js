import { Post } from "../models/blog.model.js";
import { Tag } from "../models/tags.model.js";
import { User } from "../models/user.model.js";
import { catchAsync } from "../utils/CatchAsync.js";


const peformAllSearch = async (whattosearch) => {
  
  const posts = await Post.find(
    { $text: { $search: whattosearch } },
    { searchscore: { $meta: "textScore" } }
  ).populate("author");
 
  const tags = await Tag.distinct(
    "tag",
    { $text: { $search: whattosearch } },
    { searchscore: { $meta: "textScore" } }
  );

  const accounts = await User.find(
    { $text: { $search: whattosearch } },
    { searchscore: { $meta: "textScore" } }
  );


  const searchresults = [...posts, ...tags, ...accounts];
  searchresults.sort((a,b) => b.searchscore-a.searchscore);
  return searchresults;
};

const allSearch = catchAsync(async (req, res) => {
  const whattosearch = req.body.search;
 

  const searchresults =await peformAllSearch(whattosearch);


 
    res.render("search/all", {
      searchresults,
      whattosearch,
    });

});
const backToAllSearch = catchAsync(async (req, res) => {
  const whattosearch = req.query.search;

  const searchresults =await  peformAllSearch(whattosearch);

  res.render("search/all", {
    searchresults,
    whattosearch,
  });
});

const searchAccounts = catchAsync(async (req, res) => {
  const whattosearch = req.query.search;
  const searchaccounts = await User.find(
    { $text: { $search: whattosearch } },
    { searchscore: { $meta: "textScore" } }
  );
  searchaccounts.sort((a,b) => b.searchscore-a.searchscore);
  res.render("search/accounts", {
    searchaccounts,
    whattosearch,
  });
});
const searchTags = catchAsync(async (req, res) => {
  const whattosearch = req.query.search;
  const searchtags = await Tag.distinct(
    "tag",
    { $text: { $search: whattosearch } },
    { searchscore: { $meta: "textScore" } }
  );
  searchtags.sort((a,b) => b.searchscore-a.searchscore);

  res.render("search/tags", {
    searchtags,
    whattosearch,
  });
});
const searchPosts = catchAsync(async (req, res) => {
  const whattosearch = req.query.search;
  const searchposts = await Post.find(
    { $text: { $search: whattosearch } },
    { searchscore: { $meta: "textScore" } }
  ).populate("author");
  searchposts.sort((a,b) => b.searchscore-a.searchscore);

  res.render("search/posts", {
    searchposts,
    whattosearch,
  });
});

export { allSearch, backToAllSearch, searchPosts, searchAccounts, searchTags };
