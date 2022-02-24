const path = require('path');
const fs = require("fs");

const express = require("express");
const uuid = require("uuid");

const resData = require("./util/restaurant-data")

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/restaurants", (req, res) => {
   
    const storedRestaurents = resData.getStoredRestaurants();

    res.render("restaurants", { 
        numberOfRestaurents: storedRestaurents.length,
        restaurants: storedRestaurents
    });
})

app.get("/restaurants/:id", (req, res) => {
    const restaurantId = req.params.id;
   
    const storedRestaurents = resData.getStoredRestaurants();

    for (const restaurant of storedRestaurents) {
        if (restaurant.id === restaurantId) {
            return res.render("restaurant-detail", { restaurant: restaurant })
        }
    }

    res.status(404).render("404");
});

app.get("/recommend", (req, res) => {
    res.render("recommend");
})

app.post('/recommend', (req, res) => {
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    const restaurants = resData.getStoredRestaurants();

    restaurants.push(restaurant);

    resData.storeRestaurants(restaurants);
    
    res.redirect("/confirm");
})

app.get("/confirm", (req, res) => {
    res.render("confirm");
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.use(function(req, res) {
    res.status(404).render("404");
})

app.use(function(error, req, res, next) {
    res.status(500).render('500');
})

app.listen(3000);