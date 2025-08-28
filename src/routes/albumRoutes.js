import express from 'express';
import multer from 'multer';
import * as albumController from '../controllers/albumController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", albumController.getAllAlbums);
router.post("/", upload.fields([
    { name: "coverCDN", maxCount: 1 },
]), albumController.createAlbum);

export default router;