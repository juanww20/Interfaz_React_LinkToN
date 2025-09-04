
export function defineAudio(sequelize, DataTypes) {
  const Audio = sequelize.define('Audio', {
      audio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idioma: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      formato: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'videos',
          key: 'video_id',
        },
        onDelete: 'CASCADE',
      },
  },
    {
      tableName: 'audios',
      timestamps: true,
    }
  );

  return Audio;
}