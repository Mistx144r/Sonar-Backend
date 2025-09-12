import * as playlistService from '../services/playlistService.js';

export async function getAllPlaylists(req, res) {
    try {
        const playlists = await playlistService.getAllPlaylists();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getPlaylistById(req, res) {
    try {
        const playlist = await playlistService.getPlaylistById(req.params.id);
        if (playlist) {
            res.status(200).json(playlist);
        } else {
            res.status(404).json({ message: 'Playlist não encontrada!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createUserPlaylist(req, res) {
    try {
        const newPlaylist = await playlistService.createUserPlaylist(req.user.id, req.body, req.files)
        res.status(201).json(newPlaylist)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export async function getPlaylistByUserId(req, res) {
    try {
        const playlists = await playlistService.getPlaylistByUserId(req.user.id);
        res.status(201).json(playlists)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function updateUserPlaylist(req, res) {
    try {
        const updatedPlaylist = await playlistService.updateUserPlaylist(req.params.playlistId, req.user.id, req.body, req.files)
        res.status(201).json(updatedPlaylist)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function deleteUserPlaylist(req, res) {
    try {
        const deletedPlaylist = await playlistService.deleteUserPlaylist(req.params.playlistId, req.user.id)
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}