import * as artistService from '../services/artistServices.js';

// http://localhost:3000/artists
export async function getAllArtists(req, res) {
    try {
        const artists = await artistService.getAllArtists();
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// http://localhost:3000/artists/{id}
export async function getArtistById(req, res) {
    try {
        const artist = await artistService.getArtistById(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: 'Artista não encontrado.' });
        }
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// http://localhost:3000/artists
export async function createArtist(req, res) {
    try {
        const newArtist = await artistService.createArtist(req.body);
        res.status(201).json(newArtist);
    } catch (error) {
        if (error.message === 'Este email já está cadastrado.') {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === 'O cadastro está faltando informações.') {
            return res.status(400).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}

// http://localhost:3000/artists/{id}
export async function updateArtist(req, res) {
    try {
        const updatedArtist = await artistService.updateArtist(req.params.id, req.body, req.files);
        res.status(200).json(updatedArtist);
    } catch (error) {
        if (error.message === 'Artista não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

// http://localhost:3000/artists/{id}
export async function deleteArtist(req, res) {
    try {
        const artist = await artistService.deleteArtist(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: 'Artista não encontrado.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//LOGIN

// http://localhost:3000/artists/login
export async function loginArtist(req, res) {
    try {
        const token = await artistService.loginArtist(req.body.email, req.body.senha);
        res.status(200).json({ token: token });
    } catch (error) {
        if (error.message === 'Credenciais inválidas.') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro interno do servidor." });
    }
}