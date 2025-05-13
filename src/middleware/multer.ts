
import { Request } from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination : function(req:Request,file:Express.Multer.File,cb:any){
        cb(null,'./src/uploads')
    }, 
    filename : function(req:Request,file:Express.Multer.File,cb:any){
        cb(null,Date.now() + "-" + file.originalname)
    }
})

export {multer,storage}
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// import { envConfig } from "../config/config";

// Correctly initialize Cloudinary config
// cloudinary.config({
  // cloudinary_url: envConfig.cloudinary_url,
// });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req, file) => {
//       return {
//         folder: "e-shoe",
//         allowed_formats: ["jpg", "png", "jpeg", "webp"],
//       };
//     },
//   });

// const upload = multer({ storage });

// export { upload };
