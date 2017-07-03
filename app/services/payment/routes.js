'use strict';

import express from 'express';
import braintree from 'braintree';

import RegisterController from 'app/services/training/controller/RegisterController';
import PaymentController from 'app/services/training/controller/PaymentController';


let router = express.Router();
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: '************',
    publicKey: '************',
    privateKey: '***********************'
});

router.get('/braintree/token', (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.json({
                code: 201,
                message: 'error occoured while generating token.'
            });
        } else {
            res.json({
                code: 200,
                token: response.clientToken,
            });
        }
    });
});



router.post('/braintree/nonce', (req, res) => {
    let nonceFromTheClient = req.body.nonce;
    gateway.transaction.sale({
            amount: req.body.amount,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (err, result) => {
            if (err) {
                res.json({
                    code: 201,
                    message: 'error occoured processing the payment.'
                });
            } else {

                let booking_data = {
                    user: req.user.id,
                    event: req.body.event_id,
                    total_guests: req.body.guests,
                    amount: req.body.amount,
                    payment_method: req.body.payment_method,
                    _user: req.user,
                    // provide meta details.
                }

                RegisterController.create(booking_data, (error, booking) => {

                    let payment_data = {
                        user: req.user.id,
                        event: req.body.event_id,
                        booking: booking.id,
                        transaction_id: result.transaction.id,
                        amount: result.transaction.amount,
                        currency: result.transaction.currencyIsoCode,
                        date: {
                            createdAt: result.transaction.createdAt,
                            updatedAt: result.transaction.updatedAt,
                        }
                    }
                    PaymentController.create(payment_data, (payment_error, payment) => {
                        booking.payment = payment.id;
                        res.json({
                            code: 200,
                            message: 'success.',
                            booking: booking
                        });
                        //	RegisterController.update( req.user.id, booking.id, { payment: payment.id } );
                    });
                })
            }
        }
    );
});

module.exports = router
