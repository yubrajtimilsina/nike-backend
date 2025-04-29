

import express, { Router } from 'express'
import productController from '../controllers/productController'
import userMiddleware, { Role } from '../middleware/userMiddleware'
import {multer,storage} from '../middleware/multer'
import errorHandler from '../services/errorHandler'
const upload = multer({storage : storage})
const router:Router = express.Router()

router.route("/")
.post( upload.single("productImageUrl"),errorHandler(productController.createProduct))
.get(productController.getAllProducts)

router.route("/:id")
.post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),errorHandler(productController.deleteProduct))
.get(errorHandler(productController.getSingleProduct))
.delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin),errorHandler( productController.deleteProduct))


export default router



