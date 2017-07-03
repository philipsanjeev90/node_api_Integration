'use strict';

import express from 'express';
import passport from 'passport';
import FacebookRoutes from './providers/Facebook';
import GoogleRoutes from './providers/Google';
import TwitterRoutes from './providers/Twitter';
import InstagramRoutes from './providers/Instagram';
import LocalRoutes from './providers/Local';
import Helper from 'app/helper/User';
import UserController from 'app/services/training/controller/UserController';
import ValidAuthTokenMiddleware from 'app/global/middlewares/ValidAuthToken';


let router = express.Router();
passport.serializeUser( (user, done) => {
	done(null, user);
});
passport.deserializeUser( (user, done) => {
	done(null, user);
});
/**
 * @api {POST} /auth/success local auth
 * @apiName auth failure
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get( '/success', (req, res) => {
	res.json({ message: 'success', login: true });
});
/**
 * @api {POST} /auth/failed local auth
 * @apiName auth Success
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get( '/failed', (req, res) => {
	res.json({ message: 'failed', login: false });
});

/**
 * @api {POST} /auth/ local auth
 * @apiName local login
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.post('/login', LocalRoutes.authenticate(),
	( req, res ) => {
		if ( ! req.user.email ) {
			res.json({
				code: 401,
				message: 'error',
				error: req.user.error,
			});
		}
		else {
			let token = Helper.generateToken(req.user);
			res.json({
				code: 200,
				message: 'success',
				token: token
			});
		}
	}
);

/**
 * @api {POST} /auth/register 
 * @apiName register
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.post( '/register', (req, res) => {
	UserController.registerDefault( req.body, ( error, user ) => {
		if ( error ) {
			res.json({ code: 400, message: 'error', error: error });
		}
		else {
			res.json({
				code: 200,
				message: 'success',
				user: user
			});
		}
	});
});

// send token to client side
let redirectSocialUser = ( req, res ) => {
	let token = Helper.generateToken(req.user);
	res.redirect( Helper.authRedirectUrl(`?token=${token}`) );
}

/**
 * @api {POST} /auth/login/facebook Social Login
 * @apiName facebook
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/login/facebook', FacebookRoutes.authenticate() );
router.get( '/callback/facebook', FacebookRoutes.callback(), redirectSocialUser );
/**
 * @api {POST} /auth/login/google Social Login
 * @apiName google
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/login/google', GoogleRoutes.authenticate() );
router.get( '/callback/google', GoogleRoutes.callback(), redirectSocialUser );

/**
 * @api {POST} /auth/login/twitter Social Login
 * @apiName twitter
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/login/twitter', TwitterRoutes.authenticate() );
router.get( '/callback/twitter', TwitterRoutes.callback(), redirectSocialUser );
/**
 * @api {POST} /auth/login/instagram Social Login
 * @apiName instagram
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get('/login/instagram', InstagramRoutes.authenticate() );
router.get( '/callback/instagram', InstagramRoutes.callback(), redirectSocialUser );



/**
 * @api {GET} /auth/validate validate token with Middleware
 * @apiName validate
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.get( '/validate', ValidAuthTokenMiddleware, (req, res) => {
	res.json({
		code: 200,
		message: 'success',
		valid: true,
	});
});
/**
 * @api {POST} /auth/reset-password update password sent in Mail
 * @apiName resetPassword
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
router.post( '/reset-password', (req, res) => {

	if ( ! req.body || ! req.body.email ) {
		res.json({
			code: 205,
			message: 'error',
			description: 'email address not provided',
		});
	}
	else {
		UserController.resetPassword( req.body.email, ( error, success) => {
			console.log(error)
			if ( error ) {
				res.json({ code: 205, message: error, description: 'error occoured while resetting password' });
			} else {
				res.json({
					code: 200,
					message: 'success',
					description: 'if this email is registered with us, you will receive a password reset email soon.',
				});
			}
		});
	}
});
module.exports = router;
