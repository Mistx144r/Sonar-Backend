import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Playlist = sequelize.define("Playlist", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    ownerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(45),
    },
    coverCDN: {
        type: DataTypes.STRING(45),
    },
    isPublic: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    data_modificacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "playlists",
    timestamps: false,
});

export default Playlist;
