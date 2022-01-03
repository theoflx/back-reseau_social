import UserModel from '../models/UserModel'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"



export const checkUser = async (req: Request, res: Response, next) => {
    const token = req.cookies['access_token']
    
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                res.locals.user = null  
                res.cookie('access_token', '', { maxAge: 1 })
                next()
            } else {
                let user = await UserModel.findById(decodedToken.id)
                res.locals.user = user 
                next();
            }
        })
    } else {
        res.locals.user = null  
        next()
    }
}

export const requireAuth = (req: Request, res: Response, next) => {

    const token = req.cookies['access_token']

    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err);
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        console.log('No token');       
    }
}

