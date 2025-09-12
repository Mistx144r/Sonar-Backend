import express from "express";
import * as playlistMusicController from "../controllers/playlistMusicController.js";
import { userAuthMiddleware } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.get("/:playlistId", userAuthMiddleware, playlistMusicController.getMusicsByPlaylist);
router.post("/", userAuthMiddleware, playlistMusicController.addMusicToPlaylist);
router.delete("/:playlistId/:musicId", userAuthMiddleware, playlistMusicController.removeMusicFromPlaylist);
router.delete("/:playlistId", userAuthMiddleware, playlistMusicController.clearPlaylist);

export default router;
