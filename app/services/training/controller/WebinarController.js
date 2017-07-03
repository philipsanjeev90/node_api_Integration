'use strict';

import Webinar from '../model/webinar';
import WebinarTransformer from '../transformer/WebinarTransformer';

let WebinarController = {

    create: (user_id, webinar, callback) => {
        let TechWebinar = new Webinar({
            user: user_id,
            title: webinar.title,
            description: webinar.description,
            price: webinar.price,
            register_time: webinar.register_time,
            register_type: webinar.register_type,
        });
        TechWebinar.save((error, webinarData) => {
            if (error) {
                callback(error);
            }
            callback(null, WebinarTransformer.transform(webinarData));
            return WebinarTransformer.transform(webinarData);
        });
    },
    update: (user_id, webinar_id, data, callback) => {
        Webinar.findOne({
            _id: webinar_id,
            user: user_id
        }, (error, webinarData) => {
            if (webinarData) {

                if (data.title) {
                    webinarData.title = data.title;
                }
                if (data.description) {
                    webinarData.description = data.description;
                }
                if (data.price) {
                    webinarData.price = data.price;
                }
                if (data.register_time) {
                    webinarData.register_time = data.register_time;
                }
                if (data.register_type) {
                    webinarData.register_type = data.register_type;
                }

                webinarData.save(function(err, webinar) {
                    if (err) {
                        callback('error occoured while updating webinar');
                    } else {
                        callback(null, webinar);
                    }
                });

            } else {
                callback('webinar not found');
            }
        });
    }
}
export default WebinarController;