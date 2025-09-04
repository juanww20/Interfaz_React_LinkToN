import { sequelize } from "../config/dataBase.js";
import { DataTypes } from "sequelize";
import { definePalette } from "../module/color/schemas/palette.js";
import { defineColors } from "../module/color/schemas/colors.js";
import { defineFont } from "../module/font/schemas/font.js";
import { defineFontFamily } from "../module/font/schemas/font_family.js";
import { defineUser } from "../module/auth/schemas/register.js"
import { defineRole } from "../module/auth/schemas/role.js";
import { defineImage } from "../module/image/schema/imagen.js";
import { defineVideo } from "../module/video/schema/video.js";
import { defineAudio } from "../module/audio/schema/audio.js";
import { defineSubtitulos } from "../module/subtitulos_video/schema/subtitulo.js";

const Palette = definePalette(sequelize, DataTypes);
const Colors = defineColors(sequelize, DataTypes);
const Font = defineFont(sequelize, DataTypes);
const FontFamily = defineFontFamily(sequelize, DataTypes);
const Image = defineImage(sequelize, DataTypes);
const Video = defineVideo(sequelize, DataTypes);
const Audio = defineAudio(sequelize, DataTypes);
const Subtitulo = defineSubtitulos(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);
const Role = defineRole(sequelize, DataTypes);

// Relaciones entre tablas

Palette.belongsTo(Colors, { foreignKey : 'colors_id', as : 'colors', onDelete: 'CASCADE' })

Colors.hasOne(Palette, { foreignKey : 'colors_id', as : 'palette' })

Font.belongsTo(FontFamily, { foreignKey : 'fontFamily_id',as : 'fontFamily',onDelete: 'CASCADE' })

FontFamily.hasOne(Font, { foreignKey : 'fontFamily_id', as : 'font',onDelete: 'CASCADE' })

User.belongsTo(Role, { foreignKey : 'role_id', as : 'role' })

Role.hasMany(User, { foreignKey : 'role_id', as : 'user' })

Video.hasMany(Audio, { foreignKey: 'video_id', as: 'audios' });
Audio.belongsTo(Video, { foreignKey: 'video_id', as: 'video', onDelete: 'CASCADE' });

Video.hasMany(Subtitulo, { foreignKey: 'video_id', as: 'subtitulos' });
Subtitulo.belongsTo(Video, { foreignKey: 'video_id', as: 'video', onDelete: 'CASCADE' });

export { Palette, Colors, Font, FontFamily, User, Role, Image, Video, Audio, Subtitulo };