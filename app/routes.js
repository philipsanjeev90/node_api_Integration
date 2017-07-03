// Application routes

import express from 'express';
import TrainingServiceRoutes from 'app/services/training/routes/training';
import WebinarServiceRoutes from 'app/services/training/routes/webinar';
import UsersServiceRoutes from 'app/services/training/routes/common';
import AuthServiceRoutes from 'app/services/auth/routes';
import ValidAuthTokenMiddleware from 'app/global/middlewares/ValidAuthToken';
import DefaultServiceRoutes from 'app/services/default/routes';
import PaymentServiceRoutes from 'app/services/payment/routes'
import RegisterServiceRoutes from 'app/services/register/routes'
let routes = function(app) {
    app.use('/uploads', express.static('uploads'));
    // user auth login routes
    app.use('/auth', AuthServiceRoutes);
    // user service routes
    app.use('/users', UsersServiceRoutes);
    // user training routes
    app.use('/training', TrainingServiceRoutes);
    app.use('/webinar', ValidAuthTokenMiddleware, WebinarServiceRoutes);
    app.use('/payment', ValidAuthTokenMiddleware, PaymentServiceRoutes);
    app.use('/registration', ValidAuthTokenMiddleware, RegisterServiceRoutes);
    app.use('/', DefaultServiceRoutes);
}

export default routes;
