import express from "express"
import { about, contact, following, home } from "../controllers/basic.controller.js"
import { isLoggedIn } from "../middleware.js"

const router=express.Router()

router.get("/",home)

router.get("/about",about)
router.get("/contact",contact)
router.get("/following",isLoggedIn,following);

export default router;