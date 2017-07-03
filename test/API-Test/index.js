process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';
import User from '../../app/services/training/model/user';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
let should = chai.should();
chai.use(chaiHttp);

describe('API definations', () => {
    describe('/GET all api definations', () => {
        it('it should GET all the API definations', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('/GET all api definations', () => {
        it('/GET all api definations ', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('resources')
                    res.body.should.have.property('message').eql('I am alive and listening');
                    done();
                });
        });
    });
});
