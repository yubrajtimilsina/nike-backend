import express, { Router } from "express";
import productController from "../controllers/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
import { upload } from "../middleware/multer";

const router: Router = express.Router();

router
  .route("/:collectionId")
  .get(errorHandler(productController.getProductByCollectionId));

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.array("images",10),
    errorHandler(productController.createProduct)
  )
  .get(productController.getAllProducts);

router
  .route("/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct)
  )
  .get(errorHandler(productController.getSingleProduct))
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct)
  );

export default router;
