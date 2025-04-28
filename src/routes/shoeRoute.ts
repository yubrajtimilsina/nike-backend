import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import shoeController from "../controllers/shoeController";
import { multer, storage } from "../middleware/multer"
const upload = multer({ storage: storage });
import errorHandler from "../services/errorHandler";

const router: Router = express.Router();

attributes: ["id", "categoryName"];
attributes: ["id", "categoryName"];
router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("imageUrl"),
    errorHandler(shoeController.createProduct)
  )
  .get(shoeController.getAllProducts);

router
  .route("/:id")
  .get(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(shoeController.deleteProduct)
  )
  .get(errorHandler(shoeController.getSingleProduct));
export default  router