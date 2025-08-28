import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Lyrics = sequelize.define(
    "Lyrics",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING(20),
            allowNull: false,
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
        tableName: "lyrics",
        timestamps: false,
    }
);

export default Lyrics;
