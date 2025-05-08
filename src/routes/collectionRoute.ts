import express,{ Router } from "express";
import errorHandler from "../services/errorHandler";
import collectionController from "../controllers/collectionController";



const router:Router=express.Router()



router.route("/").get(errorHandler(collectionController.getCollection))
export default router