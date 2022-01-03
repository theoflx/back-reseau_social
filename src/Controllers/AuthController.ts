import { Request, Response } from "express";
import UserModel from "../models/UserModel"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { registerErrors, signInErrors } from "../../utils/errors.utils";

const maxAge = 3 * 24 * 60 * 60 * 1000;

export class AuthController {
    
    // S'inscrire
    static register = async (req: Request, res: Response) => {       
        try {
            const user = await UserModel.create(req.body);
            res.status(201).json({user: user._id});
        } catch (err) {
            const errors = registerErrors(err)
            res.status(400).send({ errors })
        }
    }
    
    // Création de token
    static createToken = (id) => {
        return jwt.sign({id}, process.env.TOKEN_SECRET, {
           expiresIn: maxAge
        })
    }

    // Se connecter
    static signIn = async (req: Request, res: Response) => {

        const { pseudo, password } = req.body
        const user = await UserModel.findOne({ pseudo })
        
        if (!user) { // Verifier si user est undefine ou null
            return res.status(400).send({ message: "Invalid pseudo" })
        }
        
        const token = AuthController.createToken(user._id)

        user.comparePassword(password, (error: Error, match: boolean) => {

            if (error){// Si comparePassword sors une erreur, je la renvoie au dessus
                const errors = signInErrors(error)
                res.status(401).json({ errors })
            } 

            if (!match) {
                return res.status(400).send({ message: "Invalid credentials" })
            }

            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: "lax",
                secure: true
            })

            return res.send({ user })
        })
    }


    // Se deconnecter
    static logout = async (req: Request, res: Response) => {
        res.cookie('access_token', '', { maxAge: 1 })
        res.redirect('/users');
    }
}