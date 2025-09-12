import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Playlist from "./playlist.js";
import Music from "./music.js";

const PlaylistMusics = sequelize.define(
    "PlaylistMusics",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        playlistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Playlist,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        musicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Music,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        data_criacao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "playlist_songs",
        timestamps: false,
    }
);

Playlist.belongsToMany(Music, {
    through: PlaylistMusics,
    foreignKey: "playlistId",
    otherKey: "musicId",
});

Music.belongsToMany(Playlist, {
    through: PlaylistMusics,
    foreignKey: "musicId",
    otherKey: "playlistId",
});

export default PlaylistMusics;
