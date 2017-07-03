'use strict';

import _ from 'lodash';
import Helper from 'app/helper';


let MessageTransformer = {

    transform: (records, extras = null) => {

        if (Array.isArray(records)) {
            let output = [];
            _.forEach(records, (record) => {
                output.push(MessageTransformer._transform(record, extras));
            });
            return output;
        } else {
            return MessageTransformer._transform(records, extras);
        }

    },
    _transform: (record, extras = null) => {
        if (!record) {
            return {};
        }
        let record_status = (record.status === 1) ? 'active' : 'disabled';

        let fromUser = {
            id: record.from._id,
            name: record.from.name,
            profile_picture: record.from.profile_picture ? Helper.avatarURL(record.from.profile_picture) : null,
        }
        let toUser = {
            id: record.to._id,
            name: record.to.name,
            profile_picture: record.to.profile_picture ? Helper.avatarURL(record.to.profile_picture) : null,
        }

        let messageType;
        // if ( record.from._id === extras ) {
        if (extras && record.from._id.equals(extras)) {
            messageType = 'sent';
        } else {
            messageType = 'inbox';
        }

        let message_flagged = false;
        if (record.meta && record.meta.flagged) {
            message_flagged = true;
        }

        return {
            id: record._id,
            from: fromUser,
            to: toUser,
            registration: record.registration,
            text: record.text,
            read: record.read,
            status: record_status,
            timestamp: record.created_at,
            type: messageType,
            flagged: message_flagged
        };
    },

    transformSimple: (records) => {
        if (Array.isArray(records)) {
            let output = [];
            _.forEach(records, (record) => {
                output.push(MessageTransformer._transform_simple(record));
            });
            return output;
        } else {
            return MessageTransformer._transform_simple(records);
        }
    },

    _transform_simple: (record) => {
        if (!record) {
            return {};
        }
        let record_status = (record.status === 1) ? 'active' : 'disabled';

        let message_flagged = false;
        if (record.meta && record.meta.flagged) {
            message_flagged = true;
        }

        return {
            id: record._id,
            from: record.from,
            to: record.to,
            registration: record.registration,
            text: record.text,
            read: record.read,
            status: record_status,
            flagged: message_flagged,
            timestamp: record.created_at,
        };
    }
}
export default MessageTransformer;
