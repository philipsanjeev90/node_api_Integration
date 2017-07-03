'use strict';

import express from 'express';
import ResponseTemplate from 'app/global/templates/response';

import Message from 'app/services/training/model/message';
import MessageController from 'app/services/training/controller/MessageController';
import MessageTransformer from 'app/services/training/transformer/MessageTransformer';


let router = express.Router();

router.get('/', (req, res) => {
	Message.find({
				$or:[
					{ 'from': req.user._id },
					{ 'to': req.user._id }
				]
			})
			.populate('from')
			.populate('to')
			.sort({ created_at: 1 })
			.exec( (error, messages) => {
				if (error) {
					res.send(error);
				}
				messages = MessageTransformer.transform(messages,req.user._id);
				res.json({
					code: 200,
					description: 'success',
					messages: messages
				});
			});

});

router.get('/:id/flag', (req, res) => {

	Message.findOne( { _id: req.params.id }, (error, message) => {
		if ( message ) {
			if ( ! message.meta ) {
				message.meta = {};
			}

			message.meta.flagged = true;
			message.meta.flagged_by = req.user.id;

			message.save(function (err, msg) {
				if ( err ) {
					res.json({ code: 204, message: 'error' });
				} else {
					res.json({ code: 200, message: 'success' });
				}
			});

		}
	});
});
router.get('/registration/:id', (req, res) => {
	Message.find({ registration: req.params.id })
			.sort({ created_at: 1 })
			.exec( (error, messages) => {
				if (error) {
					res.send(error);
				}
				messages = MessageTransformer.transformSimple(messages);
				res.json({
					code: 200,
					description: 'success',
					messages: messages
				});
			});
});
router.post('/', (req, res) => {
	let data = req.body;
	data.from = req.user.id;

	MessageController.create( data, ( error, message ) => {
		if ( error ) {
			res.json( ResponseTemplate.updateErrorOccoured(error) );
		} else {
		Message.findById(message.id)
				.populate('from')
				.populate('to')
				.exec( (err, populatedMessage) => {
					if (err) {
						res.json( ResponseTemplate.updateErrorOccoured(err) );
					}
					message = MessageTransformer.transform(populatedMessage);
					res.json({
						code: 200,
						description: 'success',
						message: message
					});
				});
		}
	});
});

module.exports = router
