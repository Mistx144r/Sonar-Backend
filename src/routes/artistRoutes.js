import express from 'express';
import multer from 'multer';
import * as artistController from '../controllers/artistController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", artistController.getAllArtists);
router.get("/:id", artistController.getArtistById);

router.post("/", artistController.createArtist);
router.post("/login", artistController.loginArtist);

router.put("/:id", upload.fields([
    { name: "artistImage", maxCount: 1 },
    { name: "artistBackgroundImageCDN", maxCount: 1 },
]), artistController.updateArtist);
router.delete("/:id", artistController.deleteArtist);

export default router;