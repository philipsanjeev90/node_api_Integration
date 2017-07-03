'use strict';

import nodemailer from 'nodemailer';
import config from '../config/api';
import email_config from '../config/email';
import frontend_config from '../config/frontend';
import pug from 'pug';
import path from 'path';

import { EmailTemplate } from 'email-templates';
import mandrillTransport from 'nodemailer-mandrill-transport';
// let templateDir = path.join('app/global/templates', 'emails');

import Twilio from './Twilio';

import marked from 'marked';

let transport = nodemailer.createTransport(mandrillTransport({
	auth: {
		apiKey: config.mandrillapp.apiKey
	}
}));
let Email = {

	welcome( user ) {
		if ( user.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'welcome-email');
			let welcomeEmail = new EmailTemplate(templateDir);

			welcomeEmail.render( { user: user, login_url: `${frontend_config.URL}/auth/login` }, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: user.email,
						subject: email_config.welcome.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
					}
				);
			});
		}
	},
	password_reset( user, password ) {
		if ( user.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'password-reset-email');
			let passwordResetEmail = new EmailTemplate(templateDir);

			passwordResetEmail.render( { user: user, login_url: `${frontend_config.URL}/auth/login`, password: password }, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: user.email,
						subject: email_config.password_reset.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
					}
				);
			});
		}

		if ( user.phone_verified ) {
			Twilio.password_reset_notification( user.phone );
		}

	},
	event_booked_guest( event, guest, booking ) {
		if ( guest.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'event-booked-guest-email');
			let eventBookedEmail = new EmailTemplate(templateDir);
			let data = {
				event: event,
				event_url: `${frontend_config.URL}/events/${event.id}`,
				guest: guest,
				booking: booking,
			}

			eventBookedEmail.render( data, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: guest.email,
						subject: email_config.event_booked_guest.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
					}
				);
			});
		}

		if ( guest.phone_verified ) {
			Twilio.event_booked_guest( guest.phone );
		}

	},
	event_booked_guests_notification( guest, event, booking ) {
		if ( event.user.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'event-booked-guests-notification-email');
			let eventBookedEmail = new EmailTemplate(templateDir);
			let data = {
				event: event,
				event_url: `${frontend_config.URL}/events/${event.id}`,
				guest: guest,
				booking: booking,
			}

			eventBookedEmail.render( data, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: guest.email,
						subject: email_config.event_booked_guests_notification.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
					}
				);
			});
		}
	},



	event_booked_host( event, guest, booking ) {
		if ( event.user.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'event-booked-host-email');
			let eventBookedEmail = new EmailTemplate(templateDir);
			let data = {
				event: event,
				event_url: `${frontend_config.URL}/events/${event.id}`,
				guest: guest,
				booking: booking,
			}
			eventBookedEmail.render( data, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: event.user.email,
						subject: email_config.event_booked_host.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
					}
				);
			});
		}

		if ( event.user.phone_verified ) {
			Twilio.event_booked_host( event.user.phone );
		}

	},






	message_received( message ) {
		if ( message.to.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'message-received-email');
			let messageReceivedEmail = new EmailTemplate(templateDir);
			let html_text = marked(message.text);
			let data = {
				message: message,
				html_text: html_text,
			}
			messageReceivedEmail.render( data, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: message.to.email,
						subject: email_config.message_received.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
					}
				);
			});
		}

		if ( message.to.phone_verified ) {
			Twilio.message_received( message.to.phone );
		}

	},
	guest_review_email( data ) {
		if ( data.user.email ) {
			let templateDir = path.join('app/global/templates', 'emails', 'guest-review-email');
			let guestReviewEmail = new EmailTemplate(templateDir);

			// data.review_url = `${frontend_config.URL}/review/${data.id}`;
			let email_data = {
				event: data.event,
				review_url: `${frontend_config.URL}/review/${data.id}`,
				user: data.user,
			}
			guestReviewEmail.render( email_data, (err, result) => {
				transport.sendMail(
					{
						from: email_config.global.from,
						to: data.user.email,
						subject: email_config.guest_review_email.subject,
						html: result.html,
					}, ( err, info ) => {
						// some error occoured...
						console.log('data.user.email',data.user.email);
					}
				);
			});
		}

		if ( data.user.phone_verified ) {
			Twilio.leave_review( data.user.phone );
		}
	}
}
export default Email;
