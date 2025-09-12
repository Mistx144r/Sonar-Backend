import * as playlistMusicService from "../services/playlistMusicsServices.js";

export async function getMusicsByPlaylist(req, res) {
    try {
        const { playlistId } = req.params;
        const musics = await playlistMusicService.getMusicsByPlaylist(req.user.id, playlistId);
        res.status(200).json(musics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function addMusicToPlaylist(req, res) {
    try {
        const { playlistId, musicId } = req.body;
        const added = await playlistMusicService.addMusicToPlaylist(req.user.id, playlistId, musicId);
        res.status(201).json(added);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function removeMusicFromPlaylist(req, res) {
    try {
        const { playlistId, musicId } = req.params;
        const result = await playlistMusicService.removeMusicFromPlaylist(req.user.id, playlistId, musicId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function clearPlaylist(req, res) {
    try {
        const { playlistId } = req.params;
        const result = await playlistMusicService.clearPlaylist(req.user.id, playlistId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
