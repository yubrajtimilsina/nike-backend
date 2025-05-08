import express from "express";
import ProductReviewController from "../controllers/productReviewController";
import userMiddleware from "../middleware/userMiddleware";

const router = express.Router();

router.post("/reviews/:id", userMiddleware.isUserLoggedIn , ProductReviewController.createReview);
router.get("/reviews",  ProductReviewController.getAllReviews);
router.get("/reviews/:id", ProductReviewController.getReviewsByProduct);
router.delete("/reviews/:id", ProductReviewController.deleteReview);

export default router;
