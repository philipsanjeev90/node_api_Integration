'use strict';

let DelayResponse = ( req, res, next ) => {

	const delayed_routes = [
		'/events'
	];

    // delyay response with 1 second 
	if ( req.method == 'GET' || req.method == 'POST' ) {
		setTimeout( () => {
			next();
		}, 1000);
	}
	else {
		next();
	}

}


export default DelayResponse;

