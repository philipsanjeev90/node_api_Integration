'use strict';

import express from 'express';
import Training from '../model/training';
import TrainingTransformer from '../transformer/TrainingTransformer';
import ResponseTemplate from 'app/global/templates/response';
import TrainingController from '../controller/TrainingController';
import RegisterController from '../controller/RegisterController';
import Helper from 'app/helper';
import multer from 'multer';
import path from 'path';
import config_server from 'app/config/server';

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(config_server.UPLOAD_DIR, config_server.EVENT_IMAGES_DIR));
    },
    filename: function(req, file, cb) {
        let extension = Helper.getFileExtension(file.originalname);
        cb(null, `${req.user.id}-${req.body.id}-${ Helper.randomString() }.${extension}`);
    }
})
let upload = multer({ storage: storage });

let router = express.Router();
// list all trainings
router.get('/', (req, res) => {

    Training.find({})
        .sort({ created_at: 1 })
        .populate('user')
        .populate('registration')
        .populate({
            path: 'registration',
            populate: { path: 'user' }
        })
        .exec((error, trainings) => {
            if (error) {
                res.send(error);
            }
            trainings = TrainingTransformer.transform(trainings);

            res.json({
                code: 200,
                message: 'success',
                trainings: trainings
            });
        });

});






router.get('/:id/request-approval', (req, res) => {
    let data = {
        request_approval: true
    }
    TrainingController.update(req.user.id, req.params.id, data, (error, training) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success('Your training approval request has been received.'));
        }
    });

    /*
    Training.findById( req.params.id, (error, training) => {
    	if (error) {
    		res.json( ResponseTemplate.userNotFound() );
    	} else {
    		res.json({
    			code: 200,
    			message: 'success',
    		});
    	}
    });
    */
});

router.get('/:id/completed', (req, res) => {
    let data = {
        // date: new Date(),
    }
    TrainingController.update(req.user.id, req.params.id, data, (error, training) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success('This training has been marked as completed.'));
            BookingController.TrainingCompleted(training.id);
        }
    });

});

router.get('/:id', (req, res) => {

    Training.findById(req.params.id, (error, training) => {

        if (error) {
            res.json(ResponseTemplate.userNotFound());
            // res.send(error);
        } else {
            training = TrainingTransformer.transform(training);
            res.json({
                code: 200,
                message: 'success',
                training: training
            });
        }

    });


});

// save new training
router.post('/', (req, res) => {
    TrainingController.create(req.body.id, req.body, (error, training) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success(
                'New training has been successfully added', { training: training }));

        }
    });
});

// upload training images.
router.post('/upload', upload.array('images'), (req, res) => {
    let image = {};
    req.files.map((file) => {
        image.url = file.filename;
        image.originalname = file.originalname;
        image.timestamp = new Date();
    });

    TrainingController.update(req.user.id, req.body.id, { image: image }, (error, training) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            let training_images = [];
            if (training.images) {
                training.images.map((image) => {
                    training_images.push(Helper.trainingImageURL(image.url));
                });
            }
            res.json(ResponseTemplate.success(
                'training images have been successfully uploaded', { images: training_images }));
        }
    });


});
// delete training image
router.post('/delete-image', (req, res) => {

    TrainingController.deleteImage(req.user.id, req.body.id, req.body.filename, (error, training) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            let training_images = [];
            if (training.images) {
                training.images.map((image) => {
                    training_images.push(Helper.trainingImageURL(image.url));
                });
            }
            res.json(ResponseTemplate.success(
                'training image have been successfully deleted', { images: training_images }));
            Helper.deleteFile('training', req.body.filename);
        }
    });

});

// update training details
router.post('/:id', (req, res) => {
    TrainingController.update(req.user.id, req.params.id, req.body, (error, training) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success('your data has been successfully updated'));
        }
    });
});

module.exports = router
