const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors, descriptions } = require("./seedHelper");

mongoose
    .connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => console.log("Db Connected!"))
    .catch((err) => {
        console.log("Db Connectoion Error");
        console.log(err);
    });

const randomArr = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "6889bc51f79ed3d7bf014833", //User id of user 'donkey'
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${randomArr(descriptors)} ${randomArr(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: `${randomArr(descriptions)}`,
            price: Math.floor(Math.random() * 60) + 5,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
