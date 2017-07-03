'use strict';

import _ from 'lodash';
import Helper from 'app/helper';
import RegisterTransformer from './RegisterTransformer';

let TrainingTransformer = {
    transform: (events) => {
        if (Array.isArray(events)) {
            let output = [];
            _.forEach(events, (event) => {
                output.push(TrainingTransformer._transform(event));
            });
            return output;

        } else {
            return TrainingTransformer._transform(events);
        }
    },
    _transform: (training) => {
        if (!training) {
            return {};
        }
        if (!training._id && training.obj) {
            training = training.obj;
        }
        let training_status = (training.status === 1) ? 'active' : 'disabled';
        let training_images = [];
        if (training.images) {
            training.images.map((image) => {
                // trainingevent_images.push(Helper.eventImageURL(image.url));
            });
        }
        let registrations = [];
        if (training.register && training.register.length > 0) {
            registrations = RegisterTransformer.transformForHost(training.register);
        }
        return {
            id: training._id,
            owner: {
                id: training.user._id,
                name: training.user.name,
                avatar: training.user.profile_picture ? Helper.avatarURL(training.user.profile_picture) : null,
                meta: training.user.meta,
            },
            status: training_status,
            title: training.title,
            description: training.description,
            date: training.date,
            duration: training.duration,
            location: training.location,
            type: training.type,
            venue_type: training.venue_type || '',
            image: training_images[0] || '',
            menu: training.menu || {},
            images: training_images,
            booking: training.register || {},
            additional: training.additional || {},
            steps: training.steps,
            meta: training.meta || {
                approved: false
            },
            register: registrations,
            geo: training.geo || {},
            resource_url: Helper.resource(`/training/${training._id}`),
        };
    },
    transformTrainingForTrainer: (events) => {
        if (Array.isArray(events)) {
            let output = [];
            _.forEach(events, (event) => {
                output.push(EventTransformer._transformTrainingForTrainer(event));
            });
            return output;
        } else {
            return EventTransformer._transformTrainingForTrainer(events);
        }
    },
    _transformTrainingForTrainer: (event) => {
        if (!event) {
            return {};
        }
        let event_status = (event.status === 1) ? 'active' : 'disabled';
        let event_images = [];
        if (event.images) {
            event.images.map((image) => {
                event_images.push(Helper.eventImageURL(image.url));
            });
        }
        return {
            id: event._id,
            status: event_status,
            title: event.title,
            description: event.description,
            date: event.date,
            geo: event.geo || {},
            location: event.location,
            type: event.type,
            venue_type: event.venue_type || '',
            image: event_images[0] || '',
        };
    }
}
export default TrainingTransformer;
