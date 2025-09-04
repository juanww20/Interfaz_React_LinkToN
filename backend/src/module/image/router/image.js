import { Router } from "express";
import { ControllerImage } from "../controller/image.js";
import { uploadImage } from "../../../middlewares/image/upload_image.js";
import { handleMulterErrors } from '../../../middlewares/error_multer.js';

export const routerImage = Router();

routerImage.post("/", handleMulterErrors(uploadImage.single("image")), ControllerImage.createImage);
routerImage.get("/", ControllerImage.getAllImages);
routerImage.get("/:id", ControllerImage.getImageById);
routerImage.put("/:id", handleMulterErrors(uploadImage.single("image")), ControllerImage.updateImage);
routerImage.delete("/:id", ControllerImage.deleteImage);
