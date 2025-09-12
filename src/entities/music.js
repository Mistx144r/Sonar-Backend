import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Music = sequelize.define(
    "Music",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        albumId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        lyricsId: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        musicName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        duration: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        musicAudioCDN: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        musicMiniCDN: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        isMusicExplicit: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
        },
        totalPlays: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        data_criacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        data_modificacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "musics",
        timestamps: false,
    }
);

export default Music;
