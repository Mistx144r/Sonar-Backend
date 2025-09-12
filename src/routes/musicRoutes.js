import express from 'express';
import multer from 'multer';
import * as musicController from '../controllers/musicController.js';
import { artistAuthMiddleware } from '../middlewares/artistAuthMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", musicController.getAllMusics);
router.get("/:id", musicController.getMusicById);
router.get("/album/:albumId", musicController.getMusicsByAlbumId);
router.get("/artist/:artistId", musicController.getAllArtistMusic);
router.get("/artist/:artistId/top", musicController.getTopArtistMusic);

router.post("/:albumId", upload.fields([
    { name: "musicMiniCDN", maxCount: 1 },
    { name: "musicAudioCDN", maxCount: 1 },
]), artistAuthMiddleware, musicController.createMusic);

router.put("/:id", upload.fields([
    { name: "musicMiniCDN", maxCount: 1 },
    { name: "musicAudioCDN", maxCount: 1 },
]), artistAuthMiddleware, musicController.updateMusic);

export default router;