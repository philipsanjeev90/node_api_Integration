'use strict';

import express from 'express';
import ResponseTemplate from 'app/global/templates/response';

import Register from 'app/services/training/model/registration';
import RegisterController from 'app/services/training/controller/RegisterController';
import RegisterTransformer from 'app/services/training/transformer/RegisterTransformer';

import Review from 'app/services/training/model/reviews';
import ReviewController from 'app/services/training/controller/ReviewController';
import ReviewTransformer from 'app/services/training/transformer/ReviewTransformer';



import MessageController from 'app/services/training/controller/MessageController';


let router = express.Router();



router.get('/', (req, res) => {
	Register.find({ user: req.user.id })
			// .populate('event')
			.populate({
				path: 'event',
				populate: { path: 'user' }
			})
			.sort({ created_at: 1 })
			.exec( (error, bookings) => {
		if (error) {
			res.send(error);
		}
		bookings = RegisterTransformer.transform(bookings);
		res.json({
			code: 200,
			message: 'success',
			bookings: bookings
		});
	});
});





router.get('/:id', (req, res) => {
	Register.findOne({
				user: req.user.id,
				_id: req.params.id
			})
			.populate({
				path: 'event',
				populate: { path: 'user' }
			})
			.exec( (error, booking) => {
		if (error) {
			// res.send(error);
			res.json({
				code: 204,
				message: 'error',
				message: 'Invalid booking',
			});
		} else {
			booking = RegisterTransformer.transform(booking);
			if ( ! booking.id ) {
				res.json({
					code: 420,
					message: 'error',
					description: 'you are not authorized to write this review.',
				});
			} else {
				res.json({
					code: 200,
					message: 'success',
					booking: booking
				});
			}
		}
	});

});











router.post('/message-host/:id', (req, res) => {
	let data = req.body;
	data.from = req.user.id;
	data.text = data.message_for_host;

	MessageController.create( data, ( error, message ) => {
		if ( error ) {
			res.json( ResponseTemplate.updateErrorOccoured(error) );
		} else {
			res.json({
				code: 200,
				description: 'success',
				message: message
			});
		}
	});
	RegisterController.update( req.user.id, data.booking, { message_for_host: data.message_for_host } )
});










router.post('/review/:id', (req, res) => {
	let data = req.body;
	data.user = req.user.id;

	ReviewController.create( data, ( error, review ) => {
		if ( error ) {
			res.json( ResponseTemplate.updateErrorOccoured(error) );
		} else {
			res.json({
				code: 200,
				description: 'success',
				review: review
			});
		}
	});

	RegisterController.update( req.user.id, data.booking, { reviewed: true } )


});

router.post('/user-review/:id', (req, res) => {
	let data = req.body;
	data.user = req.user.id;
	data.booking = req.params.id;

	ReviewController.createNew( data, ( error, review ) => {
		if ( error ) {
			res.json( ResponseTemplate.updateErrorOccoured(error) );
		} else {
			res.json({
				code: 200,
				description: 'success',
				review: review
			});
		}
	});

	RegisterController.update( req.user.id, data.booking, { reviewed: true } )

});










router.post('/:id', (req, res) => {
	RegisterController.update( req.user.id, req.params.id, req.body, ( error, event ) => {
		if ( error ) {
			res.json( ResponseTemplate.updateErrorOccoured(error) );
		} else {
			res.json( ResponseTemplate.success('your data has been successfully updated') );
		}
	});
});







module.exports = router
