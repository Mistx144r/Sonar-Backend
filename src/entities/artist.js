import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Artist = sequelize.define(
    "Artist",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        artistName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        artistBio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        artistImageCDN: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        artistBackgroundImageCDN: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        totalFollowers: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isBanned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
        tableName: "artists",
        timestamps: false,
    }
);

export default Artist;
