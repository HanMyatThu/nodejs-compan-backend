const express = require('express');
const listRouter = express.Router();
const authenticate = require('../authenticate');

const Lists = require('../models/list');

listRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(authenticate.verifyUser, (req, res, next) => {
        if (req.user) {
            Lists.find({ owner: req.user._id })
                .populate('labels owner')
                .then(lists => {
                    res.send(lists);
                }, err => next(err))
                .catch(err => next(err));
        }
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (req.user) {
            req.body.owner = req.user._id;
            Lists.create(req.body)
                .then(list => {
                    res.statusCode = 201;
                    res.json({ success: true, status: 'List Successfully Created!' })
                }, err => next(err))
                .catch(err => next(err));
        }
    })
    .put((req, res, next) => {
        res.status(405).json({ err: 'PUT Method Not Allowed!' });
    })
    .delete((req, res, next) => {
        res.status(405).json({ err: 'DELETE Method Not Allowed!' });
    });

listRouter.route('/:listId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .populate('labels')
            .then(list => {
                if (list) {
                    res.send(list);
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(list => {
                if (list) {
                    list.todos.push(req.body);
                    list.save(err => {
                        if (err) {
                            res.json({ err: err });
                        }
                        else {
                            res.statusCode = 201;
                            res.json({ success: true, status: 'Todo Successfully Added to the List!' });
                        }
                    });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Lists.findByIdAndUpdate(req.params.listId, req.body, { new: true })
            .then(list => {
                if (list) {
                    res.json({ success: true, updated: list, status: 'List Successfully Updated' });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Lists.findByIdAndDelete(req.params.listId)
            .then(list => {
                if (list) {
                    res.json({ success: true, deleted: list, status: 'List Successfully Deleted' });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    });

listRouter.route('/:listId/:todoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        res.status(405).json({ err: 'GET Method Not Allowed!' });
    })
    .post((req, res, next) => {
        res.status(405).json({ err: 'POST Method Not Allowed!' });
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(list => {
                if (list) {
                    list.todos.id(req.params.todoId).set(req.body);
                    list.save(err => {
                        if (err) {
                            res.json({ err: err });
                        }
                        else {
                            res.json({ success: true, status: 'Todo Successfully Updated' });
                        }
                    });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    })    
    .delete(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(list => {
                if (list) {
                    list.todos.id(req.params.todoId).remove();
                    list.save(err => {
                        if (err) {
                            res.json({ err: err });
                        }
                        else {
                            res.json({ success: true, status: 'Todo Successfully Deleted' });
                        }
                    });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = listRouter;
