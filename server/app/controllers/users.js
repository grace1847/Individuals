'use strict'
const express = require('express'),
    async = require('async'),
        router = express.Router(),
        logger = require('../../config/logger'),
        mongoose = require('mongoose'),
        User = mongoose.model('User'),
        passportService = require('../../config/passport'),
        passport = require('passport');
 
 const requireLogin = passport.authenticate('local', { session: false });
 const requireAuth = passport.authenticate('jwt', { session: false });
 
 module.exports = function (app, config) {
     app.use('/api', router);
     
     router.route('/users/login').post(requireLogin, login);
     
     //Create User
     router.route('/users').post((req, res, next) => {      
         logger.log('info','Create User');      
         var user = new User(req.body);      
         user.save()      
         .then(result => {          
             res.status(201).json(result);      
            })      
            .catch((err) => {
                return next(err);      
            });    
        });

    //Get all users
    router.route('/users').get(requireAuth,(req, res, next) => {        
        logger.log('info', 'Get all users');        
        var query = User.find()        
        .sort(req.query.order)        
        .exec()        
        .then(result => {            
            if(result && result.length) {            
                res.status(200).json(result);        
            } else {            
                res.status(404).json({message: "No users"});        
            }        
        })        
        .catch(err => {          
            return next(err);        
        });    
    });

    //Get a User Handler
    router.route('/users/:id').get(requireAuth,(req, res, next) => {        
        logger.log('info', 'Get user %s', req.params.id);        
        User.findById(req.params.id)            
        .then(user => {                
            if (user) {                    
                res.status(200).json(user);                
            } else {                    
                res.status(404).json({ message: "No user found" });                
            }            
        })            
        .catch(error => {                
            return next(error);            
        });    
    });

    //Put
    router.route('/users/:id').put(requireAuth,(req, res, next) => {        
        logger.log('info', 'Get user %s', req.params.id);        
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, multi: false })            
        .then(user => {                
            res.status(200).json(user);            
        })            
        .catch(error => {                
            return next(error);            
        });    
    });

    //Login
    router.put('/users/password/:userId', requireAuth, function (req, res, next) {
        logger.log('Update user ' + req.params.userId);
        User.findById(req.params.userId)
            .exec()
            .then(function (user) {
                if (req.body.password !== undefined) {
                    user.password = req.body.password;
                }
                user.save()
                    .then(function (user) {
                        res.status(200).json(user);
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }); 

    router.route('/users/login').post(requireLogin, login);
    

    //Delete
    router.route('/users/:id').delete(requireAuth,(req, res, next) => {        
        logger.log('info', 'Delete user ' + req.params.id);        
        User.remove({ _id: req.params.id })            
        .then(user => {                
            res.status(200).json({ msg: "User Deleted" });            
        })            
        .catch(error => {                
            return next(error);            
        });    
    })
};