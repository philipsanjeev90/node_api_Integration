'use strict';

import express from 'express';
import Helper from 'app/helper';
import faker from 'faker';
import _ from 'lodash';

import UserController from 'app/services/training/controller/UserController';
import TrainingController from 'app/services/training/controller/TrainingController';
import WebinarController from 'app/services/training/controller/WebinarController';

let router = express.Router();

router.get('/', (req, res) => {
	res.json({
		code: 200,
		message: 'success',
		actions: [
			{ url: Helper.resource('/dummy/create-user'), description: 'create dummy user' },
			{ url: Helper.resource('/dummy/create-trainer'), description: 'create dummy trainers' },
			{ url: Helper.resource('/dummy/create-training'), description: 'create dummy trainings' },
		]
	});
});

module.exports = router
