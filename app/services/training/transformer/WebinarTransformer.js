'use strict';

import _ from 'lodash';
import Helper from 'app/helper';


let WebinarTransformer = {

    transform: (data) => {
        if (Array.isArray(data)) {
            let output = [];
            _.forEach(data, (webinar) => {
                output.push(WebinarTransformer._transform(webinar));
            });
            return output;

        } else {
            return WebinarTransformer._transform(data);
        }
    },
    _transform: (data) => {
        if (!data) {
            return {};
        }
        let data_status = (data.status === 1) ? 'active' : 'disabled';

        return {
            id: data._id,
            status: data_status,
            title: data.title,
            description: data.description,

            price: data.price,
            register_time: data.register_time,
            register_type: data.register_type,

            resource_url: Helper.resource(`/webinar/${data._id}`),
        };
    }
}
export default WebinarTransformer;