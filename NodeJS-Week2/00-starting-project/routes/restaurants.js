const fs = require("fs");

const uuid = require("uuid");
const express = require("express");

const resData = require("../util/restaurant-data")

const router = express.Router();

router.get("/restaurants", (req, res) => { // /restaurants/
    let order = req.query.order; // asc || desc
    let nextOrder = 'desc';

    if (order !== 'asc' && order !== 'desc') {
        order = 'asc';
    }

    if (order === 'desc') {
        nextOrder = 'asc';
    }

    const storedRestaurents = resData.getStoredRestaurants();//[{}, {}, {}]
    // start sorting
    storedRestaurents.sort(function (resA, resB) {
        if ((order === 'asc' && resA.name > resB.name) ||
            (order === 'desc' && resB.name > resA.name)) {
            return 1;
        }
        return -1;
    });
    res.render("restaurants", {
        numberOfRestaurents: storedRestaurents.length,
        restaurants: storedRestaurents,
        nextOrder: nextOrder,
        sortType: nextOrder === 'asc' ? 'ascending' : 'descending'
    });
})

router.get("/restaurants/:id", (req, res) => {
    const restaurantId = req.params.id;

    const storedRestaurents = resData.getStoredRestaurants();

    for (const restaurant of storedRestaurents) {
        if (restaurant.id === restaurantId) {
            return res.render("restaurant-detail", { restaurant: restaurant })
        }
    }

    res.status(404).render("404");
});

router.get("/recommend", (req, res) => { // 
    res.render("recommend");
})

router.post('/recommend', (req, res) => {
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    const restaurants = resData.getStoredRestaurants();

    restaurants.push(restaurant);

    resData.storeRestaurants(restaurants);

    res.redirect("/confirm");
})

router.get("/confirm", (req, res) => {
    res.render("confirm");
})

module.exports = router;
