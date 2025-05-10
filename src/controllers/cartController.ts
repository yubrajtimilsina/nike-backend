import { Request, Response } from "express";
import Cart from "../database/models/cartModel";
import Category from "../database/models/categoryModel";
import Shoe from "../database/models/productModel";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}

class CartController {
  async addToCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity, sizes } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || !quantity || !sizes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let userKoCartExist = await Cart.findOne({
      where: { userId, productId },
    });

    if (userKoCartExist) {
      userKoCartExist.quantity += quantity;
      await userKoCartExist.save();
    } else {
      await Cart.create({ userId, productId, quantity, sizes });
    }

    const cartData = await Cart.findAll({
      where: { userId },
      include: [{ model: Shoe, include: [Category] }],
    });

    return res.status(201).json({
      message: "Product added to cart successfully",
      data: cartData,
    });
  }

  async getCart(req: IAuth, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartData = await Cart.findAll({
      where: { userId },
      include: [{
        model: Shoe,
        attributes: ["id", "name", "price", "images", "sizes"],
      }],
    });

    return res.status(201).json({
      message: "Cart fetched successfully",
      data: cartData,
    });
  }

  async removeFromCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    await Cart.destroy({
      where: { userId, productId },
    });

    return res.status(201).json({
      message: "Product removed from cart successfully",
      data: productId,
    });
  }

  async updateCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "Product ID and valid quantity are required" });
    }

    const cartItem = await Cart.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(201).json({
      message: "Cart item updated successfully",
    });
  }
}

export default new CartController();
