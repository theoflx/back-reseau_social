import { Request, Response } from "express";
import { promisify } from "util";
import multer from "multer";
import UserModel from "../models/UserModel";
import fs from "fs"
const pipeline = promisify(require('stream').pipeline)


export class UploadController {

    static uploadProfil = async (req: Request, res: Response) => {
        
    }

}