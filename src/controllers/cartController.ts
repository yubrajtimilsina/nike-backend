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
    // userId, productId, quantity
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!productId || !quantity) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    let userKoCartExist = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (userKoCartExist) {
      userKoCartExist.quantity += quantity;
      await userKoCartExist.save();
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
      });
    }

    const cartData = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Shoe,
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    });
    res.status(201).json({
      message: "Product added to cart successfully",
      data: cartData,
    });
  }

  async getCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const [cartData] = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Shoe,
          attributes: ["id", "name", "brand", "price", "imageUrl"],
        },
      ],
    });
    if (!cartData) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json({
      message: "Cart fetched successfully",
      data: cartData,
    });
  }

  async removeFromCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.body;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    res.status(201).json({
      message: "Product removed from cart successfully",
      data: productId,
    });
  }

  async updateCart(req: IAuth, res: Response) {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!productId || !quantity) {
      res.status(400).json({ message: "Product ID and quantity are required" });
      return;
    }

    const cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }
    // await Cart.update(
    //   {
    //     quantity: quantity,
    //   },
    //   {
    //     where: {
    //         productId
    //     },
    //   }

    // );
    // res.status(201).json({
    //     message:"cart is updated"
    // })

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({
      message: "Cart item updated successfully",
    //   data: cartItem,
    });
  }
}

export default new CartController();
