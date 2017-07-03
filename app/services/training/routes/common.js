'use strict';

import express from 'express';
import User from '../model/user';
import UserTransformer from '../transformer/UserTransformer';
import ResponseTemplate from 'app/global/templates/response';
import UserController from '../controller/UserController';

import Helper from 'app/helper';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config_server from 'app/config/server';
// let upload = multer({ dest: path.join( config_server.UPLOAD_DIR, config_server.PROFILE_PICTURE_DIR ) });
// twillo API for messaging
import Twilio from 'app/helper/Twilio';

// helper for doc upload
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(config_server.UPLOAD_DIR, config_server.PROFILE_PICTURE_DIR));
    },
    filename: function(req, file, cb) {
        let extension = Helper.getFileExtension(file.originalname);
        // cb( null, `${file.fieldname}-${req.user.id}.${extension}` );
        cb(null, `${req.user.id}-${ Helper.randomString() }.${extension}`);
    }
})
let upload = multer({ storage: storage });

let documents_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(config_server.UPLOAD_DIR, config_server.DOCUMENT_UPLOAD_DIR));
    },
    filename: function(req, file, cb) {
        let extension = Helper.getFileExtension(file.originalname);
        cb(null, `${req.user.id}-${ Helper.randomString() }.${extension}`);
    }
})
let uploadDocuments = multer({ storage: documents_storage });

let router = express.Router();

/**
 * @api {get} /users Request User information
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/', (req, res) => {
    User.find({}, (error, users) => {
        if (error) {
            res.send(error);
        }
        users = UserTransformer.transform(users);
        res.json({
            code: 200,
            message: 'success',
            users: users
        });

    });

});
/**
 * @api {get} /users/make-trainer make user Trainer
 * @apiName Make-trainer
 * @apiGroup User
 *
 *
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/make-trainer', (req, res) => {
    UserController.update(req.user._id, { type: 2 }, (error, user) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success('your data has been successfully updated'));
        }
    });
});

/**
 * @api {POST} /users/verify-phone make user Trainer
 * @apiName verify-phone
 * @apiGroup User
 *
 *
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */

router.post('/verify-phone', (req, res) => {

    let v_code = req.user.meta.verification_code || '';

    if (req.body.code != v_code) {
        res.json({
            code: 210,
            message: 'error',
            description: 'invalid code',
        });
    } else {

        UserController.update(req.user._id, { phone_verified: true }, (error, user) => {
            if (error) {
                res.json(ResponseTemplate.updateErrorOccoured(error));
            } else {
                user = UserTransformer.transform(user);
                res.json({
                    code: 200,
                    message: 'success',
                    user: user,
                });
            }
        });

    }
});
/**
 * @api {GET} /users/verify-phone Varify User Phone
 * @apiName verify-phone
 * @apiGroup User
 *
 *
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/verify-phone', (req, res) => {
    let verification_code = Helper.verificationCode();
    Twilio.phone_verification(req.user.phone, verification_code, (data) => {
        if (!data) {
            res.json({
                code: 210,
                message: 'error',
                description: 'invalid phone number provided',
            });
        } else {
            UserController.update(req.user._id, { verification_code: verification_code }, (error, user) => {
                if (error) {
                    res.json(ResponseTemplate.updateErrorOccoured(error));
                } else {
                    res.json({
                        code: 200,
                        message: 'success',
                    });

                }
            });
        }

    });

});
/**
 * @api {GET} /users/:id find User By ID
 * @apiName findById
 * @apiGroup User
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (error, user) => {
        if (error) {
            res.json(ResponseTemplate.userNotFound());
            // res.send(error);
        } else {
            user = UserTransformer.transform(user);
            res.json({
                code: 200,
                message: 'success',
                user: user
            });
        }
    });
});
/**
 * @api {POST} /users/:id update user
 * @apiName findById
 * @apiGroup User
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.post('/update', (req, res) => {
    UserController.update(req.user._id, req.body, (error, user) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success('your data has been successfully updated'));
        }
    });
});
// upload users profile picture.
router.post('/upload-profile-picture', upload.single('avatar'), (req, res) => {
    UserController.update(req.user._id, { profile_picture: req.file.filename }, (error, user) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            res.json(ResponseTemplate.success(
                'your profile picture has been successfully uploaded', { profile_picture: Helper.avatarURL(user.profile_picture) }));
            Helper.deleteFile('profile', req.user.profile_picture);
        }
    });
});
/**
 * @api {POST} /users/upload-documents upload
 * @apiName upload-documents
 * @apiGroup User
 *
 *
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.post('/upload-documents', uploadDocuments.array('documents'), (req, res) => {
    let documents = {};
    req.files.map((file) => {
        documents.url = file.filename;
        documents.originalname = file.originalname;
        documents.timestamp = new Date();
    });
    UserController.update(req.user.id, { document: documents }, (error, user) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            let user_documents = [];
            if (user.documents) {
                user.documents.map((doc) => {
                    user_documents.push(Helper.userDocumentURL(doc.url));
                });
            }
            res.json(ResponseTemplate.success(
                'host documents have been successfully uploaded', { documents: user_documents }));
        }
    });
});

/**
 * @api {POST} /users/delete-document upload
 * @apiName delete-document
 * @apiGroup User
 *
 *
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.post('/delete-document', (req, res) => {
    UserController.deleteDocument(req.user.id, req.body.filename, (error, user) => {
        if (error) {
            res.json(ResponseTemplate.updateErrorOccoured(error));
        } else {
            let user_documents = [];
            if (user.documents) {
                user.documents.map((doc) => {
                    user_documents.push(Helper.userDocumentURL(doc.url));
                });
            }
            res.json(ResponseTemplate.success(
                'host document has been successfully deleted', { documents: user_documents }));
            Helper.deleteFile('document', req.body.filename);
        }
    });
});

router.put('/api/login', function(req, res) {
  var credentials = req.body;
  if(credentials.user==='admin' && credentials.password==='123456'){
    res.cookie('uid', '1', {domain:'127.0.0.1'});
    res.json({'user': credentials.user, 'role': 'ADMIN', 'uid': 1});
  }else{
    res.status('500').send({'message' : 'Invalid user/password'});
  }
});

router.get('/api/menu', function(req, res) {
  res.json({
    menus: [
      {
        key: 1,
        name: 'Dashboard',
        icon: 'user',
        child: [
          {
            name: 'home',
            key: 101,
            url: '/home'
          },
          {
            name: 'page2',
            key: 102,
            url: '/page2'
          }
        ]
      },
      {
        key: 2,
        name: 'account',
        icon: 'laptop',
        child: [
          {
            name: 'account',
            key: 201
          },
          {
            name: 'profile',
            key: 202
          }
        ]
      },
      {
        key: 3,
        name: 'messages',
        icon: 'notification',
        child: [
          {
            name: 'messages',
            key: 301
          },
          {
            name: 'settings',
            key: 302
          }
        ]
      }
    ]
  });
});

router.post('/api/my', function(req, res) {
  res.json({'user': 'admin', 'role': 'ADMIN', 'uid': 1});
});

router.post('/api/logout', function(req, res) {
  res.clearCookie('uid');
  res.json({'user': 'admin', 'role': 'ADMIN'});
});
module.exports = router
