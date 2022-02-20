const path = require('path');
const fs = require("fs");

const express = require("express");

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/restaurants", (req, res) => {
    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    const storedRestaurents = JSON.parse(fileData);

    res.render("restaurants", { 
        numberOfRestaurents: storedRestaurents.length,
        restaurants: storedRestaurents
    });
})

app.get("/recommend", (req, res) => {
    res.render("recommend");
})

app.post('/recommend', (req, res) => {
    const restaurant = req.body;
    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    const storedRestaurents = JSON.parse(fileData);

    storedRestaurents.push(restaurant);

    fs.writeFileSync(filePath, JSON.stringify(storedRestaurents));
    
    res.redirect("/confirm");
})

app.get("/confirm", (req, res) => {
    res.render("confirm");
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000);