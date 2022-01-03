import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";

const router = Router();

// S'inscrire ou se connecter
router.post('/register', AuthController.register);
router.post('/login', AuthController.signIn);

// Se deconnecter
router.get('/logout', AuthController.logout);

export default router;