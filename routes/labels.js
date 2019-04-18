const express = require('express');
const labelRouter = express.Router();
const authenticate = require('../authenticate');

const Labels = require('../models/label');
const Lists = require('../models/list');

labelRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(authenticate.verifyUser, (req, res, next) => {
        Labels.find({})
            .then(labels => {
                res.send(labels);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Labels.create(req.body)
            .then(label => {
                res.statusCode = 201;
                res.json({ success: true, status: 'Label Successfully Created!' })
            }, err => next(err))
            .catch(err => next(err));
    })
    .put((req, res, next) => {
        res.status(405).json({ err: 'PUT Method Not Allowed!' });
    })
    .delete((req, res, next) => {
        res.status(405).json({ err: 'DELETE Method Not Allowed!' });
    });

labelRouter.route('/:labelId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(authenticate.verifyUser, (req, res, next) => {
        Labels.findById(req.params.labelId)
            .then(label => {
                res.send(label);
            }, err => next(err))
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        res.status(405).json({ err: 'POST Method Not Allowed!' });
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Labels.findByIdAndUpdate(req.params.labelId, req.body, { new: true })
            .then(label => {
                if (label) {
                    res.json({ success: true, updated: label, status: 'Label Successfully Updated' });
                }
                else {
                    res.status(404).json({ err: 'Label does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Labels.findByIdAndDelete(req.params.labelId)
            .then(label => {
                if (label) {
                    res.json({ success: true, deleted: label, status: 'Label Successfully Deleted' });
                }
                else {
                    res.status(404).json({ err: 'Label does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    });

labelRouter.route('/list/:listId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        res.status(405).json({ err: 'GET Method Not Allowed!' });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(list => {
                if (list) {
                    list.labels.push(req.query.labelId);
                    list.save((err, ls) => {
                        if (err) {
                            res.json({ err: err });
                        }
                        else {
                            res.statusCode = 201;
                            res.json({ success: true, list: ls, status: 'Label Successfully Added to the List!' });
                        }
                    });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    })
    .put((req, res, next) => {
        res.status(405).json({ err: 'PUT Method Not Allowed!' });
    })    
    .delete(authenticate.verifyUser, (req, res, next) => {
        Lists.findById(req.params.listId)
            .then(list => {
                if (list) {
                    list.labels.splice(list.labels.indexOf(req.query.labelId), 1);
                    list.save((err, ls) => {
                        if (err) {
                            res.json({ err: err });
                        }
                        else {
                            res.json({ success: true, list: ls, status: 'Label Successfully Removed from the List!' });
                        }
                    });
                }
                else {
                    res.status(404).json({ err: 'List does not exist!' });
                }
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = labelRouter;
