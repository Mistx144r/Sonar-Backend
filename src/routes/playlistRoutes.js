import express from 'express';
import multer from 'multer';
import * as playlistController from '../controllers/playlistController.js';
import { userAuthMiddleware } from '../middlewares/userAuthMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", playlistController.getAllPlaylists);
router.get("/user", userAuthMiddleware, playlistController.getPlaylistByUserId)
router.get("/:id", playlistController.getPlaylistById);

router.post("/", upload.fields([
    { name: "coverCDN", maxCount: 1 },
]), userAuthMiddleware, playlistController.createUserPlaylist);

router.put("/:playlistId", upload.fields([
    { name: "coverCDN", maxCount: 1 },
]), userAuthMiddleware, playlistController.updateUserPlaylist);

router.delete("/:playlistId", userAuthMiddleware, playlistController.deleteUserPlaylist)

export default router;