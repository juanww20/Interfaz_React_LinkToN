import { Router } from 'express';
import { ControllerVideo } from '../controller/video.js';
import { uploadVideo } from "../../../middlewares/video/upload_video.js"
import { handleMulterErrors } from '../../../middlewares/error_multer.js';

export const routerVideo = Router();

routerVideo.post('/', handleMulterErrors(uploadVideo.single('video')), ControllerVideo.createVideo);
routerVideo.get('/', ControllerVideo.getAllVideos);
routerVideo.get('/:id', ControllerVideo.getVideoById);
routerVideo.put('/:id', handleMulterErrors(uploadVideo.single('video')), ControllerVideo.updateVideo);
routerVideo.delete('/:id', ControllerVideo.deleteVideo);