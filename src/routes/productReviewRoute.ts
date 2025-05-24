import express from "express";
import ProductReviewController from "../controllers/productReviewController";
import userMiddleware from "../middleware/userMiddleware";

const router = express.Router();

router.post("/", userMiddleware.isUserLoggedIn, ProductReviewController.createReview);
router.get("/:productId", ProductReviewController.getReviewsByProduct);
router.put("/:id", userMiddleware.isUserLoggedIn, ProductReviewController.updateReview); // NEW
router.delete("/:id", userMiddleware.isUserLoggedIn, ProductReviewController.deleteReview); // FIXED

export default router;
