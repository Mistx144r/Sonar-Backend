import express from 'express';
import multer from 'multer';
import * as albumController from '../controllers/albumController.js';
import { artistAuthMiddleware } from '../middlewares/artistAuthMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", albumController.getAllAlbums);
router.get("/:id", albumController.getAlbumById);
router.get("/art/:artistId", albumController.getAlbumsByArtistId);

router.post("/", upload.fields([
    { name: "coverCDN", maxCount: 1 },
]), artistAuthMiddleware, albumController.createAlbum);

router.put("/:id", upload.fields([
    { name: "coverCDN", maxCount: 1 },
]), artistAuthMiddleware, albumController.updateAlbum)

router.delete("/:id", artistAuthMiddleware, albumController.deleteAlbum);

export default router;