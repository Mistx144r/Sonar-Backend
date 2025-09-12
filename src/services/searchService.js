import { Music, Album, Artist } from "../entities/index.js";
import { Op, Sequelize } from "sequelize";

// Levenshtein
function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// Distância relativa
function relativeLevenshtein(a, b) {
    const dist = levenshtein(a.toLowerCase(), b.toLowerCase());
    return dist / Math.max(a.length, b.length);
}

// Score multi-word
function multiWordScore(name, query) {
    const nameWords = name.toLowerCase().split(/\s+/);
    const queryWords = query.toLowerCase().split(/\s+/);

    let total = 0;
    for (const qWord of queryWords) {
        let minScore = Infinity;
        for (const nWord of nameWords) {
            const score = relativeLevenshtein(qWord, nWord);
            if (score < minScore) minScore = score;
        }
        total += minScore;
    }
    return total / queryWords.length; // média
}

function determineBestResult(artists, albums, musics, query) {
    const candidates = [];

    artists.forEach(a =>
        candidates.push({
            type: "artist",
            item: a,
            score: multiWordScore(a.artistName, query)
        })
    );
    albums.forEach(a =>
        candidates.push({
            type: "album",
            item: a,
            score: multiWordScore(a.albumName, query)
        })
    );
    musics.forEach(m =>
        candidates.push({
            type: "music",
            item: m,
            score: multiWordScore(m.musicName, query)
        })
    );

    candidates.sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        const typePriority = { music: 1, album: 2, artist: 0 };
        return typePriority[a.type] - typePriority[b.type];
    });

    const best = candidates[0];
    if (!best || best.score >= 0.5) return null;

    return { ...best.item.toJSON(), type: best.type };
}

export async function searchForQuery(query) {
    if (!query) return { artists: [], albums: [], musics: [], bestResult: null };
    const words = query.toLowerCase().split(/\s+/);

    const buildLikeCondition = (column) => ({
        [Op.and]: words.map(word =>
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(column)), {
                [Op.like]: `%${word}%`
            })
        )
    });

    // Busca exata / LIKE
    let artists = await Artist.findAll({ where: buildLikeCondition('artistName') });
    let albums = await Album.findAll({
        where: buildLikeCondition('albumName'),
        include: [{ model: Artist, as: "artist", attributes: ['id', 'artistName'] }],
    });
    let musics = await Music.findAll({
        where: buildLikeCondition('musicName'),
        include: [{
            model: Album,
            as: "album",
            attributes: ['id', 'albumName', 'coverCDN', 'artistId'],
            include: [{ model: Artist, as: "artist", attributes: ["artistName"] }]
        }],
    });

    // Se não achar nada, fallback fuzzy (máx 10)
    if (!artists.length) artists = (await Artist.findAll())
        .sort((a, b) => multiWordScore(a.artistName, query) - multiWordScore(b.artistName, query))
        .slice(0, 10);

    if (!albums.length) albums = (await Album.findAll({
        include: [{ model: Artist, as: "artist", attributes: ['id', 'artistName'] }],
    }))
        .sort((a, b) => multiWordScore(a.albumName, query) - multiWordScore(b.albumName, query))
        .slice(0, 10);

    if (!musics.length) musics = (await Music.findAll({
        include: [{
            model: Album,
            as: "album",
            attributes: ['id', 'albumName', 'coverCDN', 'artistId'],
            include: [{ model: Artist, as: "artist", attributes: ["artistName"] }]
        }]
    }))
        .sort((a, b) => multiWordScore(a.musicName, query) - multiWordScore(b.musicName, query))
        .slice(0, 10);

    const bestResult = determineBestResult(artists, albums, musics, query);
    return { artists, albums, musics, bestResult };
}