const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const user = require('../models/user');
const Campsite = require('../models/campsite');
const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find(req.user._id)
            .populate('user')
            .populate('campsite')
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
    })
    // you will only add to the document those that are not already there
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (favorite.campsites.indexOf(req.body.campsite) === -1) {
                        favorite.campsites.push(req.body.campsite);
                        favorite.save()
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                } else {
                    Favorite.create({
                        campsites: [req.body.campsite],
                        user: req.user._id
                    })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
                res.statusCode = 403;
                res.end(`PUT operation not supported on /favorites/${req.params.favoriteId}`);
            })
            .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
                Favorite.findOneAndDelete(req.user._id)
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'You do not have any favorites to delete.' });
                }
            });
    });







/*
favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
*/