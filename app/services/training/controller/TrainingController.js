'use strict';

import Training from '../model/training';
import TrainingTransformer from '../transformer/TrainingTransformer';


let TrainingController = {
    create: (user_id, training, callback) => {
        let newTraining = new Training({
            user: user_id,
            title: training.title,
            description: training.description,
            date: training.date,
            duration: training.duration,
            location: training.location,
            type: training.type,
            venue_type: training.venue_type,
            geo: {
                lat: training.geo ? '' : training.geo.lat || 0,
                lng: training.geo ? '' : training.geo.lng || 0,
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
        newTraining.save((error, createdEvent) => {
            if (error) {
                callback(error);
                return null;
            }
            callback(null, TrainingTransformer.transform(createdEvent));
            return TrainingTransformer.transform(createdEvent);
        });
    },
    update: (user_id, training_id, data, callback) => {
        Event.findOne({ _id: training_id, user: user_id }, (error, event) => {
            if (error) { console.log('error', error); }
            if (event) {

                if (data.title) { event.title = data.title; }
                if (data.description) { event.description = data.description; }
                if (data.date) { event.date = data.date; }
                if (data.duration) { event.duration = data.duration; }
                if (data.location) { event.location = data.location; }
                if (data.type) { event.type = data.type; }
                if (data.venue_type) { event.venue_type = data.venue_type; }

                // if ( data.geo ) { event.geo = data.geo; }
                if (data.geo) {
                    event.geo = {
                        lng: data.geo.lng,
                        lat: data.geo.lat,
                    }
                }
                if (data.menu && Object.keys(data.menu).length > 0) {
                    event.menu = {
                        starter: data.menu.starter || '',
                        main_dish: data.menu.main_dish || '',
                        desert: data.menu.desert || '',
                        menu_drinks: data.menu.menu_drinks || '',
                        allergens: data.menu.allergens || '',
                        alcohol_policy: data.menu.alcohol_policy || '',
                        drinks: data.menu.drinks || [],
                        can_accommodate: data.menu.can_accommodate || [],
                    }
                    event.steps = Object.assign({}, event.steps, { menu: true });
                }


                if (data.booking && Object.keys(data.booking).length > 0) {
                    event.booking = {
                        guests: {
                            min: data.booking.guests.min || '',
                            max: data.booking.guests.max || '',
                            outside: (data.booking.guests.outside) ? true : false,
                        },
                        price: {
                            currency: data.booking.price.currency || '',
                            amount: data.booking.price.amount || '',
                        },
                    }
                    event.steps = Object.assign({}, event.steps, { booking: true });
                }
                if (data.additional && Object.keys(data.additional).length > 0) {
                    event.additional = {
                        recurring: {
                            duration: data.additional.recurring.duration,
                        },
                        privacy: {
                            status: (data.additional.privacy.status) ? true : false,
                            coupon: data.additional.privacy.coupon,
                        },
                        hosting: {
                            style: data.additional.hosting.style,
                            co_host: data.additional.hosting.co_host || '',
                        },
                        location: {
                            additional: data.additional.location.additional || '',
                            others: data.additional.location.others || [],
                            smoking: data.additional.location.smoking,
                            parking: data.additional.location.parking,
                            pets: data.additional.location.pets,
                        },
                    }
                    event.steps = Object.assign({}, event.steps, { additional: true });
                }


                if (data.image) {
                    event.images.push(data.image);
                    event.steps = Object.assign({}, event.steps, { images: true });
                }


                if (data.request_approval) {
                    event.meta = {
                        approved: true,
                        approved_timestamp: new Date(),
                    }
                }
                event.save(function(err, event) {
                    if (err) {
                        callback('error occoured while updating event');
                    } else {
                        callback(null, event);
                    }
                });

            } else {
                callback('event not found');
            }
        });
    },
    deleteImage: (user_id, training_id, filename, callback) => {
        Event.findOne({ _id: training_id, user: user_id }, (error, event) => {
            if (event) {

                let images = event.images;
                images = images.filter((obj) => { return obj.url != filename; });
                event.images = images;

                if (event.images.length < 1) {
                    event.steps = Object.assign({}, event.steps, { images: false });
                }

                event.save(function(err, event) {
                    if (err) {
                        callback('error occoured while updating event');
                    } else {
                        callback(null, event);
                    }
                });

            } else {
                callback('event not found');
            }

        });
    }
}
export default TrainingController;
