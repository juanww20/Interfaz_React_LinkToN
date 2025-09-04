import { Router } from "express"
import { ControllerSubtitulo } from "../controller/subtitulo.js"
import { handleMulterErrors } from "../../../middlewares/error_multer.js"
import { uploadSubtitulos } from "../../../middlewares/subtitulos/upload_subtitulos.js"

export const routerSubtitulo = Router()

routerSubtitulo.post("/", handleMulterErrors(uploadSubtitulos.single("subtitulo")), ControllerSubtitulo.create)
routerSubtitulo.get("/", ControllerSubtitulo.getAll)
routerSubtitulo.get("/:id", ControllerSubtitulo.getById)
routerSubtitulo.put("/:id", handleMulterErrors(uploadSubtitulos.single("subtitulo")), ControllerSubtitulo.update)
routerSubtitulo.delete("/:id", ControllerSubtitulo.delete)