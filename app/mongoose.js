import mongoose from 'mongoose';
import config_server from 'app/config/server';
import config_database from 'app/config/database';

mongoose.Promise = global.Promise;

let MongoConnect = function() {
    var db = mongoose.connect(config_database.default.HOST, function(error) {
        if (error) {
            console.log('Mongoose default connection error: ' + error);
        } else {
            console.log("mongo Connected :)");
        }
    });
    // Create the database connection
    // When successfully connected
    mongoose.connection.on('connected', function() {
        console.log('Mongoose default connection open to ' + config_database.default.HOST);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });


    return db;
}

export default MongoConnect;