import { Request, Response } from "express";
import Product from "../database/models/productModel";
import ProductReview from "../database/models/productReviewModal";
import User from "../database/models/userModel";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}

class ProductReviewController {
  // Create a new review
  async createReview(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { rating, comment, productId } = req.body;

    if (!rating || !comment || !productId) {
      res.status(400).json({
        message: "Missing required fields: rating, comment, or productId",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: "Rating must be between 1 and 5" });
      return;
    }

    if (comment.length < 10 || comment.length > 1000) {
      res.status(400).json({
        message: "Comment must be between 10 and 1000 characters",
      });
      return;
    }

    try {
      // Verify product exists
      const productExists = await Product.findByPk(productId);
      if (!productExists) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      const review = await ProductReview.create({
        userId,
        rating,
        comment,
        productId,
      });

      res.status(201).json({
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create review",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Get reviews for a specific product
 async getReviewsByProduct(req: IAuth, res: Response): Promise<void> {
    try {
        const { productId } = req.params;

        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }

        const reviews = await ProductReview.findAll({
            where: { productId },
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        res.status(200).json({
            message: "Product reviews fetched successfully",
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product reviews",
            error: "Internal server error"
        });
    }
}

  // Delete a review
  async deleteReview(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const review = await ProductReview.findOne({
        where: { id, userId } // Ensure user owns the review
      });

      if (!review) {
        res.status(404).json({ message: "Review not found or not authorized" });
        return;
      }

      await review.destroy();

      res.status(200).json({
        message: "Review deleted successfully",
        data: review,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete review",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
  // Add this method inside your ProductReviewController class
async updateReview(req: IAuth, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { id } = req.params; // review ID
  const { rating, comment } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!rating || !comment) {
    res.status(400).json({
      message: "Missing required fields: rating and comment",
    });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ message: "Rating must be between 1 and 5" });
    return;
  }

  if (comment.length < 10 || comment.length > 1000) {
    res.status(400).json({
      message: "Comment must be between 10 and 1000 characters",
    });
    return;
  }

  try {
    const review = await ProductReview.findOne({
      where: { id, userId }, // Ensure the user owns this review
    });

    if (!review) {
      res.status(404).json({ message: "Review not found or not authorized" });
      return;
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update review",
      error: error instanceof Error ? error.message : error,
    });
  }
}

}

export default new ProductReviewController();