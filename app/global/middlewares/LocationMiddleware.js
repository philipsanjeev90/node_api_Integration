'use strict';

import GeoHelper from 'app/helper/Geo';

let LocationMiddleware = ( req, res, next ) => {

	if ( req.headers['location'] ) {
		let geo = req.headers['location'];
		geo = geo.split(',');

		GeoHelper.set( req, { lng: geo[0]*1, lat: geo[1]*1 } );

	}

	next();

}


export default LocationMiddleware;
