import PlaylistMusics from "../entities/playlistMusics.js";
import Playlist from "../entities/playlist.js";
import Music from "../entities/music.js";
import Album from "../entities/album.js";
import Artist from "../entities/artist.js";

export async function getMusicsByPlaylist(userId, playlistId) {
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) throw new Error("Playlist não encontrada!");
    if (playlist.ownerId !== userId) throw new Error("Esta playlist pertence a outro usuário.");

    return await PlaylistMusics.findAll({
        where: { playlistId },
        include: [
            {
                model: Music,
                as: "music",
                include: [
                    { model: Album, as: "album", attributes: ["coverCDN", "albumName", "id"], include: [{ model: Artist, as: "artist", attributes: ["id", "artistName"] }] },
                ],
            },
        ],
    });
}

export async function addMusicToPlaylist(userId, playlistId, musicId) {
    if (!playlistId || !musicId) throw new Error("PlaylistId e MusicId são obrigatórios!");

    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) throw new Error("Playlist não encontrada!");
    if (playlist.ownerId !== userId) throw new Error("Esta playlist pertence a outro usuário.");

    const exists = await PlaylistMusics.findOne({
        where: { playlistId, musicId },
    });

    if (exists) throw new Error("Música já está nessa playlist!");

    const playlistMusic = await PlaylistMusics.create({
        playlistId,
        musicId,
        data_criacao: new Date(),
    });

    return playlistMusic;
}

export async function removeMusicFromPlaylist(userId, playlistId, musicId) {
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) throw new Error("Playlist não encontrada!");
    if (playlist.ownerId !== userId) throw new Error("Esta playlist pertence a outro usuário.");

    const playlistMusic = await PlaylistMusics.findOne({
        where: { playlistId, musicId },
    });

    if (!playlistMusic) {
        throw new Error("Música não encontrada nessa playlist!");
    }

    await playlistMusic.destroy();
    return { message: "Música removida da playlist com sucesso!" };
}

export async function clearPlaylist(userId, playlistId) {
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) throw new Error("Playlist não encontrada!");
    if (playlist.ownerId !== userId) throw new Error("Esta playlist pertence a outro usuário.");

    await PlaylistMusics.destroy({ where: { playlistId } });
    return { message: "Todas as músicas foram removidas da playlist!" };
}
