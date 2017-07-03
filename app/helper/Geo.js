'use strict';

import api_config from 'app/config/api';
import server_config from 'app/config/server';
import axios from 'axios';


let _geo = {};

let Default = {
	set(req, location) {
		if ( location ) {
			req.session.location = location;
		}
	},
	done( req, callback ) {
		if ( req.session.location && req.session.location.lng && req.session.location.lat ) {
			callback(req.session.location);
		}
		else {
			Default.autodetect( req, (data) => {
				callback(data);
			});
		}
	},
	autodetect( req, callback ) {
		return axios.get(`${api_config.ip.url}`)
			.then( (response) => {
				let location = response.data.loc;
				let latlng = location.split(',');

				let lat = latlng[0] || 0;
					lat = lat*1;

				let lng = latlng[1] || 0;
					lng = lng*1;

				let locData = { lng: lng, lat: lat };

				Default.set( req, locData );
				callback(locData);
				return locData;

			})
			.catch( (error) => {
				return {};
			});

	},
	getMaxDistance() {
		let maxDistance = server_config.GEO_RADIUS;
		// return maxDistance * 1000;
			maxDistance /= 6378; // 3963.2 miles, 6371 kilometers
		return maxDistance;
	}
}


export default Default;
