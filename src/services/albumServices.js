import Album from '../entities/album.js';
import { uploadFile, deleteFile } from "../utils/S3services.js";

export async function getAllAlbums() {
    return await Album.findAll();
}

export async function getAlbumById(id) {
    return await Album.findByPk(id);
}

export async function getAlbumsByArtistId(artistId) {
    return await Album.findAll({ where: { artistId } });
}

export async function createAlbum(artistId, albumData, files) {
    let coverCDNUrl = null;
    let albumName = albumData.albumName.toLowerCase();
    albumName = albumName.replace(/ /g, '');
    albumName = albumName.replace(/[^a-z0-9]/g, '');


    if (files && files.coverCDN && files.coverCDN.length > 0) {
        coverCDNUrl = await uploadFile(`${artistId}/albums/${albumName}`, files.coverCDN[0]);
    }

    console.log(artistId);

    const newAlbum = await Album.create({
        albumName: albumData.albumName,
        data_lancamento: albumData.releaseDate || Date.now(),
        artistId: artistId,
        coverCDN: coverCDNUrl || null,
    });

    return newAlbum;
}

export async function updateAlbum(albumdId, artistId, newAlbumData, files) {
    const album = await Album.findByPk(albumdId);

    if (!album) {
        throw new Error('Album não encontrado!');
    }

    if (album.artistId !== artistId) {
        throw new Error('Este Album Pertence a Outro Artista.');
    }

    let coverCDNUrl = album.coverCDN;
    let albumName = newAlbumData.albumName ? newAlbumData.albumName.toLowerCase() : album.albumName.toLowerCase();
    albumName = albumName.replace(/ /g, '');
    albumName = albumName.replace(/[^a-z0-9]/g, '');

    if (files && files.coverCDN && files.coverCDN.length > 0) {
        if (coverCDNUrl) {
            await deleteFile(coverCDNUrl);
        }
        coverCDNUrl = await uploadFile(`${artistId}/albums/${albumName}`, files.coverCDN[0]);
    }

    album.albumName = newAlbumData.albumName || album.albumName;
    album.data_lancamento = newAlbumData.releaseDate || album.data_lancamento;
    album.coverCDN = coverCDNUrl;
    await album.save();

    return album;
}

export async function deleteAlbum(albumId, artistId) {
    const album = await Album.findByPk(albumId);

    if (!album) {
        throw new Error('Album não encontrado!');
    }

    if (album.artistId !== artistId) {
        throw new Error('Este Album Pertence a Outro Artista.');
    }

    if (album.coverCDN) {
        await deleteFile(album.coverCDN);
    }

    await album.destroy();
}