'use strict';

import Register from '../model/registration';
import RegisterTransformerAPI from '../transformer/RegisterTransformer';


let RegisterController= {
    create: (user_id, training, callback) => {
        let new_register = new Register({
            user: user_id,
            title: training.title,
            description: training.description,
            date: training.date,
            duration: training.duration,
            location: training.location,
            type: training.type,
            venue_type: training.venue_type,
            geo: {
                lat: training.geo.lat || 0,
                lng: training.geo.lng || 0,
            },
            steps: {
                general: true,
                menu: false,
                images: false,
                booking: false,
                additional: false,
            },
            meta: {
                approved: false
            }
        });
        new_register.save((error, createdTraining) => {
            if (error) {
                callback(error);
                return null;
            }
            callback(null, RegisterTransformerAPI.transform(createdTraining));
            return RegisterTransformerAPI.transform(createdTraining);
        });
    }
}


export default RegisterController;
