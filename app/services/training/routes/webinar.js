'use strict';
import express from 'express';
import Webinar from '../model/webinar';
import WebinarTransformer from '../transformer/WebinarTransformer';
import WebinarController from '../controller/WebinarController';
import ResponseTemplate from 'app/global/templates/response';
import Helper from 'app/helper';
import multer from 'multer';
import path from 'path';
import config_server from 'app/config/server';
let router = express.Router();
// list all Webinar
router.get('/', (req, res) => {
    Webinar.find({
        user: req.user.id
    }, (error, Webinar) => {
        if (error) {
            res.send(error);
        }
        Webinar = WebinarTransformer.transform(Webinar);
        res.json({
            code: 200,
            message: 'success',
            Webinar: Webinar
        });
    });
});

// save new Webinar
router.post('/', (req, res) => {
    WebinarController.create(req.user.id, req.body, (error, Webinar) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success(
                'new dish has been successfully added', {
                    Webinar: Webinar
                }));
        }
    });
});
// update Webinar details
router.post('/:id', (req, res) => {
    WebinarController.update(req.user.id, req.params.id, req.body, (error, event) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success('your data has been successfully updated'));
        }
    });
});

module.exports = router
