import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";
import { UserController } from "../Controllers/UserController"
import { UploadController } from "../Controllers/UploadController"
import multer from "multer";
import { upload } from "../middleware/UploadMiddleware"

const router = Router()

// Routes pour afficher les utilisateurs
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.userInfo);

// Mettre à jour un utilisateur
router.put('/:id', UserController.updateUser);

// Supprimer un utilisateur
router.delete('/:id', UserController.deleteUser);

// Suivre ou arrêter de suivre un utilisateur
router.patch('/follow/:id', UserController.follow);
router.patch('/unfollow/:id', UserController.unfollow)

// Upload
router.post('/upload', upload.single('file'),UploadController.uploadProfil)

export default router;