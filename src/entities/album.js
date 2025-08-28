import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Album = sequelize.define(
    "Album",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        artistId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        albumName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        coverCDN: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        data_lancamento: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        data_criacao: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        data_modificacao: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "albums",
        timestamps: false,
    }
);

export default Album;
