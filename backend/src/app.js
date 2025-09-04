import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {sequelize} from "./config/dataBase.js";
import { enviroment } from "./config/enviroment.js";
import { routerApi } from "./api/v1/route.js";
import path from 'path';
import fs from 'fs';
import { UPLOADS_DIR } from './utils/global-path.js'; // Import global path variables

const __dirname = UPLOADS_DIR;

const app = express();

const PORT = enviroment.PORT;

// origenes permitidos para hacer peticiones
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:4200'
];

// middlewares
// Aumentar el límite de tamaño para las solicitudes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Permite solicitudes sin origin (como Postman o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.use('/videos', express.static(path.join(__dirname, 'uploads', 'videos')));
app.use('/audios', express.static(path.join(__dirname, 'uploads', 'audios')));
app.use('/subtitulos', express.static(path.join(__dirname, 'uploads', 'subtitulos')));

// ejemplo en google chrome
// http://localhost:3000/preview?video=1754507327087-twenty-one-pilots---ride-official-video.mp4&subtitulo=1754523354249-subtitletoolscom-english-twenty-one-pilots---ride-official-video-downsubcom.vtt
// video = al nombre que indica en la carpeta de uploads/videos
// subtitulo = al nombre que indica en la carpeta de uploads/subtitulos
// en el caso de que quieras probar con imagen o audio, puedes agregar los parametros imagen y audio y seria lo mismo que lo anterior
// no es necesario agregar todos los parametros, puede probar uno por uno o todo junto
// para video y subtitulo si tiene que ser ambos parametros por url para que se vea el funcionamiento
app.get('/preview', (req, res) => {
  let { video, imagen, audio, subtitulo } = req.query;

  console.log('Query parameters:', req.query);
  if (!video && !imagen && !audio && !subtitulo) return res.status(400).send("Missing required query parameters");

  if(video === undefined) video = '';
  if(audio === undefined) audio = '';
  if(subtitulo === undefined) subtitulo = '';
  if(imagen === undefined) imagen = '';

  const fullPath = path.join(__dirname, 'uploads', 'images', imagen);
  const fullPathVideos = path.join(__dirname, 'uploads', 'videos', video);
  const fullPathAudios = path.join(__dirname, 'uploads', 'audios', audio);
  const fullPathSubtitulos = path.join(__dirname, 'uploads', 'subtitulos', subtitulo);

  // Mostrar ruta absoluta y si existe el archivo
  console.log('📦 Existe imagen:', fs.existsSync(fullPath));
  console.log('📦 Existe video:', fs.existsSync(fullPathVideos));
  console.log('📦 Existe audio:', fs.existsSync(fullPathAudios));
  console.log('📦 Existe subtitulo:', fs.existsSync(fullPathSubtitulos));

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Vista previa de imagen</title>
    </head>
    <body>
      <h1>Imagen cargada:</h1>
      <img src="/images/${imagen}" alt="Imagen subida" style="max-width: 400px; border: 1px solid #ccc;" />
      <p>Ruta: <code>/images/${imagen}</code></p>
      <h2>Video con subtítulos cargados:</h2>
      <video controls style="max-width: 400px; border: 1px solid #ccc;">
        <source src="/videos/${video}" type="video/mp4">
        <track src="/subtitulos/${subtitulo}" kind="subtitles" srclang="en" label="English" default>
      </video>
      <h2>Audio cargado:</h2>
      <audio controls style="max-width: 400px; border: 1px solid #ccc;">
        <source src="/audios/${audio}" type="audio/mpeg">
      </audio>
    </body>
    </html>
  `;

  res.send(html);
});

// api
app.use('/api/v1/', routerApi);



async function main() {
    
    try {

        // establecemos conexion con la base de datos
        await sequelize.authenticate();
        /*
        await sequelize.query(`
          ALTER TABLE FontFamily 
          MODIFY COLUMN url_principal MEDIUMTEXT NOT NULL,
          MODIFY COLUMN url_secundary MEDIUMTEXT NOT NULL
        `);
        */
        await sequelize.sync({ alter: true });
        console.log("===================================================")
        console.log("✅ Conexion de la base de datos establecida")
        
        // establecemos conexion con el servidor
        app.listen(PORT, () => {
            console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
            console.log("===================================================")
        })

    } catch (error) {

        console.error("❌ Error al establecer conexion", error)
    }
}

main();