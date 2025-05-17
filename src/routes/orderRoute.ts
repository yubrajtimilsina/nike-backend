import express,{ Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
import orderController from "../controllers/orderController";


const router:Router= express.Router()

router.route("/").post(userMiddleware.isUserLoggedIn, errorHandler(orderController.createOrder)).get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrder))
router.route("/all").get(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), errorHandler(orderController.fetchAllOrders))

router.route("/verify-pidx").post(userMiddleware.isUserLoggedIn,errorHandler(orderController.verifyTransaction))
router.route('/:id').get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrderDetail  ))


export default router