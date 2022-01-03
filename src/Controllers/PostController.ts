import PostModel from "../models/PostModel";
import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import { ObjectId, Types } from "mongoose";


export class PostController {

    // Lire un post
    static readPost = (req: Request, res: Response) => {
    PostModel.find((err, docs) => {
        if(!err) res.send(docs);
        else console.log('Error to get data' + err);
    }).sort({ createdAt: -1 }).populate('posterId')
}

    //Crée un post
    static createPost = async (req: Request, res: Response) => {

    const { user } = res.locals

    const newPost = new PostModel({
        posterId: user,
        message: req.body.message,
        video: req.body.video,
        liker: [],
        comments: [] 
    })

    try{
        const post = await newPost.save();
        return res.status(201).json(post)
    }catch(err){
        return res.status(400).send(err)
    }
}

    // Mettre a jour son post
    static updatePost = (req: Request, res: Response) => {
    if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log('Update error ' + err)
        }
    )
}

    // Supprimer son post
    static deletePost = (req: Request, res: Response) => {
    if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log('Delete error : ' + err)
        }
    )
}

    // Aimer un post
    static likePost = async (req: Request, res: Response) => {
        const { user } = res.locals
        if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

        try{
            const likers = await PostModel.findByIdAndUpdate(
                req.params.id,
                {
                    $addToSet: { likers: user._id }
                },
                { new: true },
            )
            const likes = await UserModel.findByIdAndUpdate(
                user._id,
                { 
                    $addToSet: { likes: req.params.id }
                },
                { new: true },
            )
            res.send ({likers, likes})
        } catch (err){
            return res.status(401).send(err)
        }
    }

    // Retirer son j'aime d'un post
    static unlikePost = async (req: Request, res: Response) => {
        if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

        try{
                const unlike = await PostModel.findByIdAndUpdate(
                    req.params.id,
                    {
                        $pull: { likers: req.body.id }
                    },
                    { new: true }
                )
                const unlikers = await UserModel.findByIdAndUpdate(
                    req.body.id,
                    { 
                        $pull: { likes: req.params.id }
                    },
                    { new: true },
                )
                res.send({unlike, unlikers})
        } catch (err){
            return res.status(401).send(err)
        }
    }

    // Commenter un post
    static commentPost = async (req: Request, res: Response) => {
        if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

        try { 
            const comment = await PostModel.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        comments: {
                            commenterId: req.body.commenterId,
                            commenterPseudo: req.body.commenterPseudo,
                            text: req.body.text,
                            timestamp: new Date().getTime()
                        }
                    }
                },
                {new: true},
            )
                return res.send(comment)
        } catch(err){
            return res.status(400).send(err)
        }
    } 

    // Editer le commentaire du post
    static editCommentPost = async (req: Request, res: Response) => {
        if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

        try{

            const editPost = await PostModel.findById(
                req.params.id,
            )

            if(!editPost) throw new Error('error')

            const theComment = editPost.comments.find(comment => comment._id.equals(req.body.commentId))

            if(!theComment) return res.status(401).send('Comment not found')
                theComment.text = req.body.text

            const result = await editPost.save()
            res.send(result)

        } catch(err){
        return res.status(400).send(err)
        }
    } 

    // Supprimer son commentaire du post
    static deleteCommentPost = async (req: Request, res: Response) => {
        if(!Types.ObjectId.isValid(req.params.id))
        return res.status(401).send('ID unknown : ' + req.params.id)

        try {
            const deleteComment = await PostModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: {
                        comments: {
                            _id: req.body.commentId,
                        }
                    }
                },
                {new: true},
            )
            res.send(deleteComment)
        } catch (err) {
        return res.status(400).send(err)
        }
    }


}
