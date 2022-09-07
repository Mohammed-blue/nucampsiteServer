const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion.js');
const authenticate = require('../authenticate');

//  this all method catches all HTTP verbs(POST, GET, etc).
promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch((err) => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch((err) => next(err))
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.deleteMany()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch(err => next(err))
});


promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res,) => {
    res.statusCode = 403;
    res.end('POST operation not supported')
})
.put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})


module.exports = promotionRouter;