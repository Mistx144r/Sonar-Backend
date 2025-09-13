import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import userRoutes from './routes/userRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import musicRoutes from './routes/musicRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js'
import PlaylistMusicsRoutes from './routes/playlistMusicsRoutes.js'

const api = express();
const PORT = process.env.PORT || 3000;

api.use(cors({
    origin: "*",
}));

api.use(express.json());
api.use('/users', userRoutes);
api.use('/artists', artistRoutes);
api.use('/albums', albumRoutes);
api.use('/musics', musicRoutes);
api.use('/search', searchRoutes);
api.use('/playlists', playlistRoutes);
api.use('/playlistMusics', PlaylistMusicsRoutes)

const options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(options, api).listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
