'use strict';

import _ from 'lodash';
import Helper from 'app/helper';

let PaymentTransformer = {
    transform: (records) => {
        if (Array.isArray(records)) {
            let output = [];
            _.forEach(records, (record) => {
                output.push(PaymentTransformer._transform(record));
            });
            return output;
        } else {
            return PaymentTransformer._transform(records);
        }
    },
    _transform: (record) => {
        if (!record) {
            return {};
        }
        let record_status = (record.status === 1) ? 'active' : 'disabled';
        return {
            id: record._id,
            user: record.user,
            training: record.training,
            registration: record.registration,
            transaction_id: record.transaction_id,
            amount: record.amount,
            currency: record.currency,
            status: record_status,
        };
    }
}
export default PaymentTransformer;
