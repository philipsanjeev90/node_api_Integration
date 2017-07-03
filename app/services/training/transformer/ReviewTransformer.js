'use strict';

import _ from 'lodash';
import Helper from 'app/helper';
import UserTransformer from './UserTransformer';
let ReviewTransformer = {
    transform: (records) => {
        if (Array.isArray(records)) {
            let output = [];
            _.forEach(records, (record) => {
                output.push(ReviewTransformer._transform(record));
            });
            return output;
        } else {
            return ReviewTransformer._transform(records);
        }

    },
    _transform: (record) => {
        if (!record) {
            return {};
        }
        let record_status = (record.status === 1) ? 'active' : 'disabled';
        let trainer = record.trainer;
        if (trainer && trainer.id) {
            trainer = UserTransformer.transformHosts(trainer);
        }
        return {
            id: record._id,
            user: record.user,
            trainer: trainer,
            registration: record.registration,
            text: record.text,
            rating: record.rating,
            status: record_status,
        };
    }
}
export default ReviewTransformer;
