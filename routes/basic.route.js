import express from "express"
import { about, contact, home } from "../controllers/basic.controller.js"

const router=express.Router()

router.get("/",home)

router.get("/about",about)
router.get("/contact",contact)

export default router;