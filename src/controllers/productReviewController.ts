import { isEmail } from './../../node_modules/@types/validator/index.d';
import { Request, Response } from "express";
import Product from "../database/models/productModel"; // assuming you want to join reviews with product info
import ProductReview from "../database/models/productReview";
import { envConfig } from "../config/config";
import User from "../database/models/userModel";


interface IAuth extends Request{
  user?: {
    id: string;
  };
}
class ProductReviewController {
  // Create a new review
  
 async  createReview(req: IAuth, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { rating, comment,productId } = req.body;
  
  if (!rating || !comment || !userId)  {
    res.status(400).json({
      message: "Missing required fields: rating, comment, or userId",
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
      error,
    });
  }
}

  // Get all reviews
  async getAllReviews(req: Request, res: Response): Promise<void> {
    try {
      const reviews = await ProductReview.findAll({

      
        include: [
          {
            model: Product,
            attributes: ["id", "name", "brand"],
          },
          {
            model: User,
            attributes: ["id", "username"],
          },
          
        ],
      });

      res.status(200).json({
        message: "Reviews fetched successfully",
        data: reviews,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch reviews",
        error,
      });
    }
  }

  // Get all reviews for a specific product
  async getReviewsByProduct(req: Request, res: Response): Promise<void> {
    const { id} = req.params;

    const {productId}=req.body
    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }
    if (productId !== id) {
      res.status(400).json({ message: "Product ID does not match" });
      return;
    }
    try {
      const reviews = await ProductReview.findAll({
        where: { productId },
        include: [
          {
            model: Product,
            attributes: ["id", "name", "brand"],
          },
          {
            model:User,
            attributes: ["id", "username"],
          }
        ],
      });

      res.status(200).json({
        message: "Product reviews fetched successfully",
        data: reviews,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch product reviews",
        error,
      });
    }
  }

  // Delete a review
  async deleteReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const review = await ProductReview.findByPk(id);

      if (!review) {
        res.status(404).json({
          message: "Review not found",
        });
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
        error,
      });
    }
  }
}

export default new ProductReviewController();
