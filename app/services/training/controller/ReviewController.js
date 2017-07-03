'use strict';

import validator from 'validator';
import Review from '../model/reviews';
import ReviewTransformer from '../transformer/ReviewTransformer';


let ReviewController = {

    create: (data, callback = null) => {
        let newReview = new Review({
            trainer: data.trainer,
            user: data.user,
            training: data.training,
            registration: data.registration,
            text: data.text,
            rating: data.rating,
            status: 1,
        });
        newReview.save((error, record) => {
            if (callback) {
                callback(null, ReviewTransformer.transform(record));
            }
            return ReviewTransformer.transform(record);
        });
    },
    createNew: (data, callback = null) => {
        let user_rating = (data.cleanliness + data.communication + data.rules) / 3;

        let newReview = new Review({
            trainer: data.triner,
            user: data.user,
            training: data.training,
            registration: data.registration,
            text: data.experience,
            rating: user_rating,
            meta: {
                would_recommend: data.would_recommend,
                experience: data.experience,
                private: data.private,
                cleanliness: data.cleanliness,
                communication: data.communication,
                rules: data.rules,
                forus: data.forus,
            },
            status: 1,
        });
        newReview.save((error, record) => {
            if (callback) {
                callback(null, ReviewTransformer.transform(record));
            }
            return ReviewTransformer.transform(record);
        });

    }
}
export default ReviewController;
