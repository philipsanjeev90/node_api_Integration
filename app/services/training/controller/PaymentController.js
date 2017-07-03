'use strict';

import validator from 'validator';
import Payment from '../model/payment';
import PaymentTransformer from '../transformer/PaymentTransformer';


let PaymentController = {
	create: (data, callback = null) => {
		let newPayment = new Payment({
			user: data.user,
			training: data.training,
			registration: data.registration,
			transaction_id: data.transaction_id,
			amount: data.amount,
			currency: data.currency,
			date: {
				createdAt: data.date.createdAt,
				updatedAt: data.date.updatedAt,
			},
			status: 1,
		});
		newPayment.save( (error, record) => {
			if ( callback ) {
				callback( null, PaymentTransformer.transform(record) );
			}
			return PaymentTransformer.transform(record);
		});

	}
}


export default PaymentController;
