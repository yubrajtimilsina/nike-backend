import express,{ Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
import cartController from "../controllers/cartController";


const router:Router= express.Router()
router.route('/').post(userMiddleware.isUserLoggedIn,errorHandler(cartController.addToCart)).get(userMiddleware.isUserLoggedIn,errorHandler(cartController.getCart))
router.route('/:productId').patch(userMiddleware.isUserLoggedIn,errorHandler(cartController.updateCart)).delete(userMiddleware.isUserLoggedIn,errorHandler(cartController.removeFromCart))



export default router