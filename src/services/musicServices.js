import { Music, Album, Artist } from "../entities/index.js";
import { parseBuffer } from 'music-metadata'
import { uploadFile, deleteFile } from "../utils/S3services.js";

async function getAudioDuration(audioFile) {
    try {
        if (audioFile.buffer) {
            const metadata = await parseBuffer(audioFile.buffer);
            return metadata.format.duration || 0;
        } else if (audioFile.path) {
            const metadata = await parseFile(audioFile.path);
            return metadata.format.duration || 0;
        } else {
            throw new Error("Arquivo de áudio inválido");
        }
    } catch (err) {
        console.error("Erro ao ler metadata:", err);
        return 0;
    }
}

export async function getAllMusics() {
    return await Music.findAll();
}

export async function getMusicById(id) {
    return await Music.findByPk(id);
}

export async function getMusicsByAlbumId(albumId) {
    return await Music.findAll({
        where: { albumId },
        include: [
            {
                model: Album,
                as: "album",
                attributes: ["id", "albumName", "coverCDN", "artistId"],
                include: [
                    {
                        model: Artist,
                        as: "artist",
                        attributes: ["id", "artistName", "artistImageCDN", "artistBackgroundImageCDN"]
                    }
                ]
            }
        ]
    });
}

export async function getAllArtistMusic(artistId) {
    const albums = await Album.findAll({ where: { artistId } });
    const albumIds = albums.map(album => album.id);
    return await Music.findAll({ where: { albumId: albumIds } });
}

export async function getTopArtistMusic(artistId) {
    return await Music.findAll({
        include: [
            {
                model: Album,
                as: "album",
                where: { artistId },
                attributes: ["id", "coverCDN", "albumName"],

                include: [
                    {
                        model: Artist,
                        as: "artist",
                        attributes: ["id", "artistName"],
                    }
                ],
            }
        ],
        order: [["totalPlays", "DESC"]],
        limit: 5
    });
}

export async function createMusic(artistId, albumId, musicData, files) {
    const album = await Album.findByPk(albumId);

    if (!album) {
        throw new Error('Album nao encontrado!');
    }

    if (album.artistId !== artistId) {
        throw new Error('Voce nao tem permissao para adicionar musicas a este album!');
    }

    let musicName = musicData.musicName.toLowerCase();
    musicName = musicName.replace(/ /g, '');
    musicName = musicName.replace(/[^a-z0-9]/g, '');

    let albumName = album.albumName.toLowerCase();
    albumName = albumName.replace(/ /g, '');
    albumName = albumName.replace(/[^a-z0-9]/g, '');

    let musicMiniCDNUrl = null;
    let musicAudioCDNUrl = null;
    let audioDuration = 0;

    if (files.musicMiniCDN && files.musicMiniCDN[0]) {
        const miniCDNFile = files.musicMiniCDN[0];
        musicMiniCDNUrl = await uploadFile(miniCDNFile);
    }

    if (files.musicAudioCDN && files.musicAudioCDN[0]) {
        const audioCDNFile = files.musicAudioCDN[0];
        musicAudioCDNUrl = await uploadFile(`${artistId}/albums/${albumName}/${musicName}`, audioCDNFile);

        audioDuration = await getAudioDuration(audioCDNFile);
    }

    const newMusic = await Music.create({
        musicName: musicData.musicName,
        duration: audioDuration,
        albumId: albumId,
        isMusicExplicit: musicData.isMusicExplicit || false,
        musicMiniCDN: musicMiniCDNUrl || null,
        musicAudioCDN: musicAudioCDNUrl || null,
    });

    return newMusic;
}

export async function updateMusic(artistId, musicId, musicData, files) {
    const music = await Music.findByPk(musicId, {
        include: [
            {
                model: Album,
                as: "album",
                attributes: ["id", "albumName", "artistId"],
                include: [
                    {
                        model: Artist,
                        as: "artist",
                        attributes: ["id", "artistName"]
                    }
                ]
            }
        ]
    });

    if (!music) {
        throw new Error("Música não encontrada!");
    }

    if (music.album.artistId !== artistId) {
        throw new Error("Você não tem permissão para atualizar esta música!");
    }

    if (musicData.musicName) {
        music.musicName = musicData.musicName;
    }
    if (typeof musicData.isMusicExplicit !== "undefined") {
        music.isMusicExplicit = musicData.isMusicExplicit;
    }

    if (files.musicMiniCDN && files.musicMiniCDN[0]) {
        if (music.musicMiniCDN) await deleteFile(music.musicMiniCDN);
        const albumName = music.album.albumName.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
        const musicName = music.musicName.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
        const miniCDNFile = files.musicMiniCDN[0];
        music.musicMiniCDN = await uploadFile(`${music.album.artistId}/albums/${albumName}/${musicName}`, miniCDNFile);
    }

    if (files.musicAudioCDN && files.musicAudioCDN[0]) {
        if (music.musicAudioCDN) await deleteFile(music.musicAudioCDN);
        const audioCDNFile = files.musicAudioCDN[0];
        const albumName = music.album.albumName.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
        const musicName = music.musicName.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
        music.musicAudioCDN = await uploadFile(`${music.album.artistId}/albums/${albumName}/${musicName}`, audioCDNFile);

        const audioDuration = await getAudioDuration(audioCDNFile);
        music.duration = audioDuration;
    }

    await music.save();
    return music;
}
