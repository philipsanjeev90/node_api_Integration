'use strict';

import UserModel from 'app/services/training/model/user';
import UserController from 'app/services/training/controller/UserController';
import UserTransformer from 'app/services/training/transformer/UserTransformer';

class user_service {

	static findById(id, callback) {
		UserModel.findById( id, (error, user) => {
			if (error) {
				callback(error);
			} else {
				callback(null, user);
			}
		});
	}
	static findOne(options, callback) {
		UserModel.findOne( options, (error, user) => {
			if (error) {
				callback(error);
			} else {
				callback(null, user);
			}
		});
	}
	static registerSocial(user, done) {
		return UserController.registerSocial(user, done);
	}
	static transform(users) {
		return UserTransformer.transform(users);
	}
}

export default {
	user: user_service,
}
