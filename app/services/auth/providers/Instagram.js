'use strict';

import passport from 'passport';
import {
    Strategy as InstagramStrategy
} from 'passport-instagram';
import auth from 'app/config/auth';
import Service from 'app/helper/Service';


passport.use(new InstagramStrategy({
        clientID: auth.instagram.client_id,
        clientSecret: auth.instagram.client_secret,
        callbackURL: auth.instagram.callback_url,
        passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {

        let data = profile._json;
        Service.user.registerSocial({
                provider: 'instagram',
                name: profile.displayName,
                email: `${data.data.username}@instagram.com`,
                profile_picture: data.data.profile_picture,
                meta: {
                    provider: 'instagram',
                    id: profile.id,
                    token: accessToken,
                    username: data.data.username,
                }
            },
            done
        );

    }
));


let InstagramRoutes = {

    authenticate: () => {
        return passport.authenticate('instagram');
    },

    callback: () => {
        return passport.authenticate('instagram', {
            failureRedirect: '/auth/failed'
        });
    }

}


export default InstagramRoutes;
