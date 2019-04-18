const express = require('express');
const scheduleRouter = express.Router();
const authenticate = require('../authenticate');

const Schedules = require('../models/schedule');

scheduleRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(authenticate.verifyUser, (req, res, next) => {
        if (req.user) {
            Schedules.find({ owner: req.user._id })
                .populate('owner')
                .then(schedules => {
                    res.send(schedules);
                }, err => next(err))
                .catch(err => next(err));
        }
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (req.user) {
            req.body.owner = req.user._id;
            Schedules.create(req.body)
                .then(schedule => {
                    res.statusCode = 201;
                    res.json({ success: true, status: 'Schedule Successfully Created' });
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

scheduleRouter.route('/:scheduleId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        Schedules.findById(req.params.scheduleId)
                .then(schedule => {
                    res.send(schedule);
                }, err => next(err))
                .catch(err => next(err));
    })
    .post((req, res, next) => {
        res.status(405).json({ err: 'POST Method Not Allowed!' });
    })
    .put((req, res, next) => {
        Schedules.findByIdAndUpdate(req.params.scheduleId, req.body, { new: true })
                .then(schedule => {
                    if (schedule) {
                        res.json({ success: true, updated: schedule, status: 'Schedule successfully updated!' });
                    }
                    else {
                        res.status(404).json({ err: 'Schedule does not exist!' });
                    }
                }, err => next(err))
                .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Schedules.findByIdAndDelete(req.params.scheduleId)
                .then(schedule => {
                    if (schedule) {
                        res.json({ success: true, deleted: schedule, status: 'Schedule successfully deleted!' });
                    }
                    else {
                        res.status(404).json({ err: 'Schedule does not exist!' });
                    }
                })
                .catch(err => next(err));
    });

module.exports = scheduleRouter;
