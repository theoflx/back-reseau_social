import { Router } from "express";
import { PostController } from "../Controllers/PostController";

const router = Router();

// CRUD pour les posts
router.get('/', PostController.readPost);
router.post('/', PostController.createPost);
router.put('/:id', PostController.updatePost);  
router.delete('/:id', PostController.deletePost);

// J'aimes
router.get('/like-post/:id', PostController.likePost);
router.get('/unlike-post/:id', PostController.unlikePost);

// Commentaires
router.patch('/comment-post/:id', PostController.commentPost);
router.patch('/edit-comment-post/:id', PostController.editCommentPost);
router.patch('/delete-comment-post/:id', PostController.deleteCommentPost)



export default router;