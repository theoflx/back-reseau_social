import { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import PostRoutes from "./PostRoutes";



const root = Router()
// Routes d'authentification
root.use('/auth', AuthRoutes)

// Routes pour les utilisateurs
root.use('/users', UserRoutes)

// Routes pour les posts
root.use('/post', PostRoutes)


export default root

