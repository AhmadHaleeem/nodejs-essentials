const express = require('express');

const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.post('/', ordersController.addOrder); // /orders

router.get('/', ordersController.getOrders); // /orders

router.get('/success', ordersController.getSuccess); // /success

router.get('/failure', ordersController.getFailure); // /failure

module.exports = router;