import * as albumService from '../services/albumServices.js';

export async function getAllAlbums(req, res) {
    try {
        const albums = await albumService.getAllAlbums();
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAlbumById(req, res) {
    try {
        const album = await albumService.getAlbumById(req.params.id);
        if (album) {
            res.status(200).json(album);
        } else {
            res.status(404).json({ message: 'Album não encontrado!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAlbumsByArtistId(req, res) {
    try {
        const albums = await albumService.getAlbumsByArtistId(req.params.artistId);
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createAlbum(req, res) {
    try {
        const newAlbum = await albumService.createAlbum(req.artist.id, req.body, req.files);
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateAlbum(req, res) {
    try {
        const updatedAlbum = await albumService.updateAlbum(req.params.id, req.artist.id, req.body, req.files);
        res.status(200).json(updatedAlbum);
    } catch (error) {
        if (error.message === 'Album não encontrado!') {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === 'Este Album Pertence a Outro Artista.') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export async function deleteAlbum(req, res) {
    try {
        await albumService.deleteAlbum(req.params.id, req.artist.id);
        res.status(204).end();
    } catch (error) {
        if (error.message === 'Album não encontrado!') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Este Album Pertence a Outro Artista.') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}