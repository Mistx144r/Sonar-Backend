import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);

router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;