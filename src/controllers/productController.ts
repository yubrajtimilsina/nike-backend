import { Request, Response, NextFunction } from "express";
import Category from "../database/models/categoryModel";
import Shoe from "../database/models/productModel";
import Collection from "../database/models/collectionModel";
import { envConfig } from "../config/config";
import jwt from "jsonwebtoken";
class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const {
      name,
      brand,
      price,
      originalPrice,
      categoryId,
      discount,
      sizes,
      colors,
      features,
      inStock,
      isNew,
      description,
      totalStock,
     
      collectionId,
    } = req.body;

    if (!name || !brand || !price || !originalPrice || !categoryId || !collectionId ||!totalStock || !description )  {
      res.status(400).json({
        message:
          "Missing required fields: name, brand, price, originalPrice, category",
      });
      return;
    }

    const filename =
      req.file?.filename ||
      "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png";

    const product = await Shoe.create({
      name,
      brand,
      price: parseFloat(price) || 0,
      originalPrice: parseFloat(originalPrice) || 0,
      discount: parseFloat(discount) || 0,
      categoryId,
      sizes:
        typeof sizes === "string"
          ? sizes.split(",")
          : Array.isArray(sizes)
          ? sizes
          : [],
      colors:
        typeof colors === "string"
          ? colors.split(",")
          : Array.isArray(colors)
          ? colors
          : [],
      features:
        typeof features === "string"
          ? features.split(",")
          : Array.isArray(features)
          ? features
          : [],
      inStock: inStock === "true" || inStock === true,
      isNew: isNew === "true" || isNew === true,
      description: description || "No description",
      images: filename,
      
      collectionId,
      totalStock
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await Shoe.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
        {
          model: Collection,
          attributes: ["id", "collectionName"],
        },
      ],
    });

    res.status(201).json({
      message: "Products fetched successfully",
      data: products,
    });
  }

  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const product = await Shoe.findOne({
      where: { id },
      include: [
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(201).json({
      message: "Product fetched successfully",
      data: product,
    });
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      name,
      brand,
      price,
      originalPrice,
      categoryId,
      discount,
      sizes,
      colors,
      features,
      inStock,
      isNew,
      description,
      collectionId,
      totalStock
    } = req.body;

    const filename = req.file?.filename;

    const product = await Shoe.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await product.update({
      name: name ?? product.name,
      brand: brand ?? product.brand,
      price: isNaN(parseFloat(price)) ? product.price : parseFloat(price),
      originalPrice: isNaN(parseFloat(originalPrice))
        ? product.originalPrice
        : parseFloat(originalPrice),
      discount: isNaN(parseFloat(discount))
        ? product.discount
        : parseFloat(discount),
      categoryId,
      sizes: sizes ? sizes.split(",") : product.sizes,
      colors: colors ? colors.split(",") : product.colors,
      features: features ? features.split(",") : product.features,
      inStock:
        inStock !== undefined
          ? inStock === "true" || inStock === true
          : product.inStock,
      isNew:
        isNew !== undefined
          ? isNew === "true" || isNew === true
          : product.isNew,
      description: description ?? product.description,
      images: filename ? filename : product.images,
      collectionId,
      totalStock: totalStock || product.totalStock,

    });

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const product = await Shoe.findByPk(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await product.destroy();

    res.status(201).json({
      message: "Product deleted successfully",
      data: product,
    });
  }

  async getProductByCollectionId(req: Request, res: Response): Promise<void> {
    const { collectionId } = req.params;

    const products = await Shoe.findAll({
      where: { collectionId },
      include: [
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
        {
          model: Shoe,
          attributes: [
            "id",
            "name",
            "brand",
            "price",
            "originalPrice",
            "discount",
            "sizes",
            "colors",
            "features",
            "inStock",
            "isNew",
            "description",
            "images"

          ],
          where: { collectionId },
        },
      ],
    });

    res.status(201).json({
      message: "Products fetched successfully",
      data: products,
    });
  }

  //   async createProductReview(req: Request, res: Response): Promise<void> {
  //     const { id } = req.params;
  //     const decoded=jwt.verify(req.headers.authorization as string,envConfig.jwtSecret as string) 
  //     // @ts-ignore
  //     const username=decoded.username 
  //     console.log(username)

  //     const { comment, rating } = req.body;

  //     if (!comment || !rating) {
  //       res
  //         .status(400)
  //         .json({ message: "Missing required fields: review, rating" });
  //       return;
  //     }

  //     const productReview = await Prod.({
  //       comment,
  //       rating,
  //       username: username,
  //       productId: id,
  //     });

  //     res.status(201).json({
  //       message: "Product review created successfully",
  //       data: productReview,
  //     });
  //   }

  // async getProductReviews(req: Request, res: Response): Promise<void> {
  //   const { id } = req.params;

  //   const productReviews = await Shoe.findAll({
  //     where: {
  //       id
  //     },
  //   });

  //   res.status(200).json({
  //     message: "Product reviews fetched successfully",
  //     data: productReviews,
  //   });
  // }
}

export default new ProductController();
