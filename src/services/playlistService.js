import Playlist from '../entities/playlist.js';
import { uploadFile, deleteFile } from "../utils/S3services.js";

export async function getAllPlaylists() {
    return await Playlist.findAll();
}

export async function getPlaylistById(id) {
    return await Playlist.findByPk(id);
}


export async function getPlaylistByUserId(userId) {
    const playlists = await Playlist.findAll({
        where: { ownerId: userId }
    });

    return playlists;
}

export async function createUserPlaylist(userId, { name, description, isPublic }, files) {
    if (!userId) throw new Error("UserId é obrigatório");
    if (!name) throw new Error("Nome da playlist é obrigatório");

    let coverCDN = "";

    if (files && files.coverCDN) {
        const file = files.coverCDN[0];
        const playlistName = name.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
        coverCDN = await uploadFile(`user${userId}/${playlistName}`, file);
    }

    const newPlaylist = await Playlist.create({
        ownerId: userId,
        name,
        description: description || "",
        coverCDN,
        isPublic: isPublic ? 1 : 0,
        data_criacao: new Date(),
        data_modificacao: new Date(),
    });

    return newPlaylist;
}

export async function updateUserPlaylist(playlistId, userId, { name, description, isPublic }, files) {
    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
        throw new Error("Playlist não encontrada!");
    }

    if (playlist.ownerId !== userId) {
        throw new Error("Esta Playlist Pertence a Outro Usuário.");
    }

    let coverCDN = playlist.coverCDN;

    console.log(files);

    if (files && files.coverCDN) {
        if (coverCDN) {
            await deleteFile(coverCDN);
        }
        const file = files.coverCDN[0];
        const playlistName = name.toLowerCase().replace(/ /g, "").replace(/[^a-z0-9]/g, "");
        coverCDN = await uploadFile(`user${userId}/${playlistName}`, file);
    }

    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    playlist.isPublic = typeof isPublic !== "undefined" ? (isPublic ? 1 : 0) : playlist.isPublic;
    playlist.coverCDN = coverCDN;
    playlist.data_modificacao = new Date();

    await playlist.save();

    return playlist;
}

export async function deleteUserPlaylist(playlistId, userId) {
    try {
        const playlist = await Playlist.findByPk(playlistId);

        if (!playlist) {
            throw new Error("Playlist não encontrada!");
        }

        if (playlist.ownerId !== userId) {
            throw new Error("Esta Playlist Pertence a Outro Usuário.");
        }

        if (playlist.coverCDN) {
            await deleteFile(playlist.coverCDN);
        }

        await playlist.destroy();
        return { message: "Playlist deletada com sucesso!" };
    } catch (error) {
        console.error("Erro ao deletar playlist:", error);
        throw error;
    }
}