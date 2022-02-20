const fs = require("fs")
const path = require("path");
const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }))

app.get("/currenttime", function(req, res) {
    res.send("<h1>"+ new Date().toISOString() +"</h1>");
});

app.get("/", function(req, res) {
    res.send("<form action='/store-user' method='POST'><label>Your Name</label><input type='text' name='username'><button>Submit</button></form>");
})

app.post("/store-user", function(req, res) {
    const username = req.body.username; // username

    const filePath = path.join(path.join(__dirname, "data", "users.json"))
    
    const fileData = fs.readFileSync(filePath);
    const existingUsers = JSON.parse(fileData); // location in memory
    existingUsers.push(username);

    fs.writeFileSync(filePath, JSON.stringify(existingUsers));

    res.send("<h1>Username stored!</h1>");
})


app.get("/users", function(req, res) {
    const filePath = path.join(path.join(__dirname, "data", "users.json"))
    
    const fileData = fs.readFileSync(filePath);
    const existingUsers = JSON.parse(fileData); // JSON format

    let responseData = '<ul>';

    for (const user of existingUsers) {
        responseData += '<li>' + user + '</li>';
    }
    responseData += '</ul>';

    res.send(responseData);
});

app.listen(3000);





















// function handleRequest(request, response) {
//     if(request.url === '/currenttime') {
//         response.statusCode = 200;
//         response.end("<h1>"+ new Date().toISOString() +"</h1>");
//     } else if (request.url === "/") {
//         response.statusCode = 200;
//         response.end("<h1>Hello world!</h1>");
//     }
// }

// const server = http.createServer(handleRequest);










// Placeholder $INPUT.getPortNumber(); INT = 80
// myapplication.com








// Error message => this port is in use
// 80
// amazon.nl:80 and 443
// amazon.nl:8090
// Microservices
// Api Gateway

// 200 => Success
// 404 => Client-side error (URL was not found)
// 401 => not autohrized
// 500 => server-side error