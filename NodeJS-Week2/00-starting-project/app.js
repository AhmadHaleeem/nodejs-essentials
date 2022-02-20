const path = require('path');
const fs = require("fs");

const express = require("express");

const app = express();

app.set("views");
app.set("view engine", "ejs");

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    const htmlFilePath = path.join(__dirname, 'views', 'index.html')
    res.sendFile(htmlFilePath)
})

app.get("/restaurants", (req, res) => {
    const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html')
    res.sendFile(htmlFilePath);
})

app.get("/recommend", (req, res) => {
    const htmlFilePath = path.join(__dirname, 'views', 'recommend.html')
    res.sendFile(htmlFilePath);
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
    const htmlFilePath = path.join(__dirname, 'views', 'confirm.html')
    res.sendFile(htmlFilePath);
})

app.get("/about", (req, res) => {
    const htmlFilePath = path.join(__dirname, 'views', 'about.html')
    res.sendFile(htmlFilePath);
})



app.listen(3000);