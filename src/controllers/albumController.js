import * as albumService from '../services/albumServices.js';

export async function getAllAlbums(req, res) {
    try {
        const albums = await albumService.getAllAlbums();
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createAlbum(req, res) {
    try {
        const newAlbum = await albumService.createAlbum(req.user.artistId, req.body, req.files);
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}