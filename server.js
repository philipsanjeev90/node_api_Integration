'use strict';

import 'app-module-path/register';
import { addPath } from 'app-module-path';
addPath(__dirname);

import config_server from 'app/config/server';
import MongoConnect from 'app/mongoose';
import AppRoutes from 'app/routes';
import AppMiddleware from 'app/middleware';
import express from 'express';
import winston from 'winston'

let app = express();
//---------------------------------------------//
// invoke routes, MIddleware, Mongo connect here
new MongoConnect();
new AppMiddleware(app);
new AppRoutes(app, express);

//---------------------------------------------//
let server = app.listen(
    app.get('port'),
    () => {
        const port = process.env.port || server.address().port;
        winston.log('info', `GenNext API running at http://localhost:${port}`)
        console.log('runing...')
    }
);
export default app;
