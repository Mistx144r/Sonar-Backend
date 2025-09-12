import Music from "./music.js";
import Album from "./album.js";
import Artist from "./artist.js";
import User from "./user.js";
import Playlist from "./playlist.js";
import PlaylistMusics from "./playlistMusics.js";

Music.belongsTo(Album, { foreignKey: "albumId", as: "album" });
Album.hasMany(Music, { foreignKey: "albumId", as: "musics" });

Album.belongsTo(Artist, { foreignKey: "artistId", as: "artist" });
Artist.hasMany(Album, { foreignKey: "artistId", as: "albums" });

Playlist.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasMany(Playlist, { foreignKey: "ownerId", as: "playlists" });

PlaylistMusics.belongsTo(Music, { foreignKey: "musicId", as: "music" });
PlaylistMusics.belongsTo(Playlist, { foreignKey: "playlistId", as: "playlist" });

export { Music, Album, Artist, User, Playlist, PlaylistMusics };
