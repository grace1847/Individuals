var mongoose = require("mongoose"),
User = require('../app/models/users');
ToDo = require('../app/models/todos');


//During the test the env variable is set to test
const mongoose = require('mongoose'),
    User = require('../app/models/users'),
    Widget = require('../app/models/widget');

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

chai.use(chaiHttp);

it('it should GET the index.html file', done => {
    chai.request(server)
        .get('/login.html')
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
});

it('it should return 404', done => {
    chai.request(server)
        .get('/index2.html')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });
});

// });
describe('User', () => {
    beforeEach(done => {
        User.remove({}, err => {
            done();
        });
    });
    //Insert user tests here
    it('it should POST a user', done => {
        var user = {
            fname: 'Jane',
            lname: 'Doe',
            email: 'woo@hoo.com',
            password: 'pass'
        };
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('fname');
                res.body.fname.should.be.a('string');
                res.body.fname.should.equal('Jane');
                done();
            });
    });

    it('it should not POST a user without email field', done => {
        var user = {
            fname: 'Jane',
            lname: 'Doe',
            password: 'pass'
        };
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it('it should GET all the users', done => {
        var user = new User({
            fname: 'Jane',
            lname: 'Doe',
            email: 'JaneDoe@hoo.com',
            password: 'pass'
        });
        user.save((err, user) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
    it('it should GET a user by the given id', done => {
        var user = new User({
            fname: 'Jane',
            lname: 'Doe',
            email: 'JaneDoe@hoo.com',
            password: 'pass'
        });

        user.save((err, user) => {
            chai.request(server)
                .get('/api/users/' + user._id)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('fname');
                    res.body.should.have.property('lname');
                    res.body.should.have.property('email');
                    res.body.should.have.property('password');
                    res.body.should.have
                        .property('_id')
                        .eql(user._id.toString());
                    done();
                });
        });
    });
    it('it should UPDATE a user', done => {
        var user = new User({
            fname: 'Jane',
            lname: 'Doe',
            email: 'yoo@hoo.com',
            password: 'pass'
        });
        user.save((err, user) => {
            chai.request(server)
                .put('/api/users/' + user._id)
                .send({
                    _id: user._id,
                    fname: 'Joey',
                    lname: 'Doe',
                    email: 'yoo@hoo.edu',
                    password: 'pass'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});

describe('Widget', () => {
    beforeEach(done => {
        Widget.remove({}, err => {
            done();
        });
    });
    //Insert user tests here
    it('it should POST a Widget', done => {
        var widget = new Widget({
            foo: 'Widget 1',
            woo: 35
        });
        chai.request(server)
            .post('/api/widgets')
            .send(widget)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('foo');
                res.body.foo.should.be.a('string');
                res.body.foo.should.equal('Widget 1');
                done();
            });
    });

    it('it should not POST a Widget without foo field', done => {
        var widget = new Widget({
            woo: 200
        });
        chai.request(server)
            .post('/api/widgets')
            .send(widget)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it('it should GET all the widgets', done => {
        var widget = new Widget({
            foo: 'Widget'
        });
        widget.save((err, widget) => {
            chai.request(server)
                .get('/api/widgets')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
    it('it should GET a widget by the given id', done => {
        var widget = new Widget({
            foo: 'Widget 1'
        });

        widget.save((err, widget) => {
            chai.request(server)
                .get('/api/widgets/' + widget._id)
                .send(widget)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('foo');
                    res.body.should.have.property('woo');
                    res.body.should.have
                        .property('_id')
                        .eql(widget._id.toString());
                    done();
                });
        });
    });
    it('it should UPDATE a widget', done => {
        var widget = new Widget({
            foo: 'Widget'
        });
        widget.save((err, widget) => {
            chai.request(server)
                .put('/api/widgets/' + widget._id)
                .send({
                    _id: widget._id,
                    woo: 300
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('woo').eql(300);
                    done();
                });
        });
    });
});