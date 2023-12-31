import { Post } from "../models/blog.js";
import { Tag } from "../models/tags.model.js";
import { User } from "../models/user.js";
import { catchAsync } from "../utils/CatchAsync.js";

const peformAllSearch = catchAsync(async (whattosearch) => {
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
  return searchresults;
});

const allSearch = catchAsync(async (req, res) => {
  const whattosearch = req.body.search;

  const searchresults = peformAllSearch(whattosearch);

  if (!searchresults) {
    throw ExpressError("no such results", 404);
  } else {
    res.render("search/all", {
      searchresults,
      whattosearch,
    });
  }
});
const backToAllSearch = catchAsync(async (req, res) => {
  const whattosearch = req.query.search;

  const searchresults = peformAllSearch(whattosearch);

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

  res.render("search/posts", {
    searchposts,
    whattosearch,
  });
});

export { allSearch, backToAllSearch, searchPosts, searchAccounts, searchTags };
