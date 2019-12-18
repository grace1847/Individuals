const express = require('express'),  
 router = express.Router(),  
 logger = require('../../config/logger'),
 mongoose = require('mongoose'),
 Todo = mongoose.model('Todo');
 
 module.exports = function (app, config) {
     app.use('/api', router);
     
     //Create Todo
     router.route('/todos').post((req, res, next) => {      
         logger.log('info','Create Todo');      
         var todo = new Todo(req.body);      
         todo.save()      
         .then(result => {          
             res.status(201).json(result);      
            })      
            .catch((err) => {
                return next(err);      
            });    
        });

    //Get all todos
    router.route('/todos').get((req, res, next) => {        
        logger.log('info', 'Get all todos');        
        var query = Todo.find()        
        .sort(req.query.order)        
        .exec()        
        .then(result => {            
            if(result && result.length) {            
                res.status(200).json(result);        
            } else {            
                res.status(404).json({message: "No todos"});        
            }        
        })        
        .catch(err => {          
            return next(err);        
        });    
    });

    //Get a Todo Handler
    router.route('/todos/:id').get((req, res, next) => {        
        logger.log('info', 'Get todo %s', req.params.id);        
        Todo.findById(req.params.id)            
        .then(todo => {                
            if (todo) {                    
                res.status(200).json(todo);                
            } else {                    
                res.status(404).json({ message: "No todo found" });                
            }            
        })            
        .catch(error => {                
            return next(error);            
        });    
    });

    //Get an User Toso
    router.route('/todos/user/:id').get((req, res, next) => {        
        logger.log('info', 'Get all a user todos');
        var query = Todo.find({userId: req.params.id})
        .sort(req.query.order)
        .exec()              
        .then(result => {
            if (result && result.length){
                res.status(200).json(result);
            } else {
                res.status(404).json({message: "No Todos"});
            }
        })         
        .catch(error => {                
            return next(error);            
        });    
    });

    //Put
    router.route('/todos/:id').put((req, res, next) => {        
        logger.log('info', 'Get todo %s', req.params.id);        
        Todo.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, multi: false })            
        .then(todo => {                
            res.status(200).json(todo);            
        })            
        .catch(error => {                
            return next(error);            
        });    
    });

    //Delete
    router.route('/todos/:id').delete((req, res, next) => {        
        logger.log('info', 'Delete todo ' + req.params.id);        
        Todo.remove({ _id: req.params.id })            
        .then(todo => {                
            res.status(200).json({ msg: "Todo Deleted" });            
        })            
        .catch(error => {                
            return next(error);            
        });    
    })
};