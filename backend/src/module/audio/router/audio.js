import { Router } from "express";
import { ControllerAudio } from "../controller/audio.js";
import { uploadAudio } from "../../../middlewares/audio/upload_audio.js";
import { handleMulterErrors } from "../../../middlewares/error_multer.js";

export const routerAudio = Router();

routerAudio.post("/", handleMulterErrors(uploadAudio.single("audio")), ControllerAudio.createAudio);
routerAudio.get("/", ControllerAudio.getAllAudios);
routerAudio.get("/:id", ControllerAudio.getAudioById);
routerAudio.put("/:id", handleMulterErrors(uploadAudio.single("audio")), ControllerAudio.updateAudio);
routerAudio.delete("/:id", ControllerAudio.deleteAudio);
