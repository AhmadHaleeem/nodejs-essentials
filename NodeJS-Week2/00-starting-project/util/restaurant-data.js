const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, '..', 'data', 'restaurants.json');

function getStoredRestaurants() {
    const fileData = fs.readFileSync(filePath);
    const storedRestaurents = JSON.parse(fileData);

    return storedRestaurents;
}

function storeRestaurants(storableRestuarants) {
    fs.writeFileSync(filePath, JSON.stringify(storableRestuarants));
}

module.exports = {
    getStoredRestaurants: getStoredRestaurants,
    storeRestaurants: storeRestaurants
}
