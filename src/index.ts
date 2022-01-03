import http from 'http';
import dotenv from 'dotenv'
import express from 'express';
import root from "./routes/index";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import {checkUser, requireAuth} from './middleware/AuthMidlleware'

import cors from 'cors';



class Server {
    private readonly _app: express.Application
    private _server: http.Server

    constructor() {
        // Chargement de fichier 
        dotenv.config()
        this._app = express()
        this._app.set('PORT', process.env.PORT || 3000)
        // Lecture {request} Ecriture {Response}
        // Permet la lecture / ecriture de cookie
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true
        }))

        this._app.use(cors({
            origin: 'http://localhost:1234',
            credentials: true,
        }))

        // JWT
        this.app.get('*', checkUser);
        this.app.get('/jwtid', requireAuth, (req, res) => {
            res.status(200).send(res.locals.user._id)
        })

        // root
        this.app.use('/', root);
    }

    get app(): express.Application {
        return this._app
    }
    get server(): http.Server {
        return this._server
    }

    public async start() {
        this._server = this.app.listen(this._app.get('PORT'))
        const OPTIONS = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            SocketTimeoutMS: 30000,
            keepAlive: true,
            autoIndex: true,
            retryWrites: false
        }
        const cnx = await mongoose.connect(process.env.ATLAS, OPTIONS)
        console.log(`Connected to ${cnx.connection.host}`)
    }
}

new Server().start().then(() => console.log(`Server running on http://localhost:${process.env.PORT}`))