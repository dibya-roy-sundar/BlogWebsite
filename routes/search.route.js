import express from "express";
import {
  allSearch,
  backToAllSearch,
  searchAccounts,
  searchPosts,
  searchTags,
} from "../controllers/search.controller.js";

const router = express.Router({ mergeParams: true });

router.route("/all").post(allSearch).get(backToAllSearch);

router.get("/posts", searchPosts);
router.get("/tags", searchTags);
router.get("/accounts", searchAccounts);

export default router;
