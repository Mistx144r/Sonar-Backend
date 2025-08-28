import Artist from '../entities/artist.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { uploadFile, deleteFile } from "../utils/S3services.js";

export async function getAllArtists() {
    return await Artist.findAll();
}

export async function getArtistById(id) {
    return await Artist.findByPk(id);
}

export async function createArtist(artistData) {
    const { artistName, email, password } = artistData;
    const existingArtist = await Artist.findOne({ where: { email: email } });

    if (existingArtist) {
        throw new Error('Este email já está cadastrado.');
    }

    if (!artistName || !email || !password) {
        throw new Error('O cadastro está faltando informações.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newArtist = await Artist.create({
        artistName: artistName,
        email: email,
        password: hashedPassword
    });

    return newArtist;
}

export async function updateArtist(id, artistData, files) {
    const artist = await Artist.findByPk(id);
    const existingArtistWithEmail = await Artist.findOne({ where: { email: artistData.email } });
    if (!artist) throw new Error('Usuário não encontrado.');

    if (existingArtistWithEmail && existingArtistWithEmail.id !== Number(id)) {
        throw new Error('Este email já está cadastrado.');
    }

    if (artistData.id) {
        delete artistData.id;
    }

    if (artistData.data_criacao) {
        delete artistData.data_criacao;
    }

    if (artistData.senha) {
        artistData.senha = await bcrypt.hash(artistData.senha, 10);
    }

    if (files?.artistImage?.[0]) {
        if (artist.artistImageCDN) {
            await deleteFile(artist.artistImageCDN);
        }

        const imageUrl = await uploadFile(`${id}`, files.artistImage[0]);
        artistData.artistImageCDN = imageUrl;
    }

    if (files?.artistBackgroundImageCDN?.[0]) {
        if (artist.artistBackgroundImageCDN) {
            await deleteFile(artist.artistBackgroundImageCDN);
        }

        const backgroundUrl = await uploadFile(`${id}`, files.artistBackgroundImageCDN[0]);
        artistData.artistBackgroundImageCDN = backgroundUrl;
    }

    return await artist.update(artistData);
}

export async function deleteArtist(id) {
    const artist = await Artist.findByPk(id);
    if (!artist) {
        return null;
    }

    if (artist.artistImageCDN) await deleteFile(artist.artistImageCDN);
    if (artist.artistBackgroundImageCDN) await deleteFile(artist.artistBackgroundImageCDN);

    await artist.destroy();
    return artist;
}

export async function loginArtist(email, plainTextPassword) {
    const artist = await Artist.findOne({ where: { email } });
    if (!artist) {
        throw new Error('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(plainTextPassword, artist.senha);
    if (!isMatch) {
        throw new Error('Credenciais inválidas.');
    }

    const payload = {
        id: artist.id,
        nome: artist.nome,
        email: artist.email
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '4h' }
    );

    const { senha, ...artistData } = artist.get({ plain: true });

    return { artist: artistData, token: token };
}