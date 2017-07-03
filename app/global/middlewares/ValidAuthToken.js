'use strict';

import jwt from 'jsonwebtoken';
import config_server from 'app/config/server';
import Service from 'app/helper/Service';
import ResponseTemplate from 'app/global/templates/response';

let ValidAuthToken = (req, res, next) => {

    const authorization_jeader = req.headers.authorization;
    let token;

    if (authorization_jeader) {
        token = authorization_jeader.split(" ")[1];
    }

    if (token) {
        console.log(token);
        jwt.verify(token, config_server.WEB_TOKEN_SECRET, (err, decoded_user) => {
            if (err) {
                res.json(ResponseTemplate.authError());
            } else {
                Service.user.findById(decoded_user.id, (error, user) => {
                    if (error) {
                        res.json(ResponseTemplate.authError());
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        });

    } else {
        res.json(ResponseTemplate.authError());
    }


}


export default ValidAuthToken;
