import express, { Router } from "express";
import productController from "../controllers/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
// import multer from "multer";
import { storage,multer } from "../middleware/multer";
const upload= multer({storage:storage})
const router: Router = express.Router();

router
  .route("/:collectionId")
  .get(errorHandler(productController.getProductByCollectionId));

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("images"),
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
