import * as musicService from '../services/musicServices.js';

export async function getAllMusics(req, res) {
    try {
        const musics = await musicService.getAllMusics();
        res.status(200).json(musics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getMusicById(req, res) {
    try {
        const music = await musicService.getMusicById(req.params.id);
        if (!music) {
            return res.status(404).json({ message: 'Musica nao encontrada!' });
        }
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getMusicsByAlbumId(req, res) {
    try {
        const musics = await musicService.getMusicsByAlbumId(req.params.albumId);
        res.status(200).json(musics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllArtistMusic(req, res) {
    try {
        const musics = await musicService.getAllArtistMusic(req.params.artistId);
        res.status(200).json(musics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getTopArtistMusic(req, res) {
    try {
        const musics = await musicService.getTopArtistMusic(req.params.artistId);
        res.status(200).json(musics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createMusic(req, res) {
    try {
        const newMusic = await musicService.createMusic(req.artist.id, req.params.albumId, req.body, req.files);
        res.status(201).json(newMusic);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

export async function updateMusic(req, res) {
    try {
        const updateMusic = await musicService.updateMusic(req.artist.id, req.params.id, req.body, req.files);
        res.status(201).json(updateMusic);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}