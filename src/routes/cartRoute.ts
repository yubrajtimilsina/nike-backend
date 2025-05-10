import express,{ Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
import cartController from "../controllers/cartController";


const router:Router= express.Router()
router.route('/cart').post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),errorHandler(cartController.addToCart)).get(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),errorHandler(cartController.getCart))
router.route('/cart/:productId').patch(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),errorHandler(cartController.updateCart)).delete(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer),errorHandler(cartController.removeFromCart))



export default router