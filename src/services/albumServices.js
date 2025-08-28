import Album from '../entities/album.js';

export async function getAllAlbums() {
    return await Album.findAll();
}