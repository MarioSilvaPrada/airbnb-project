const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession = require("express-session")


const User = require('./models/user');
const Location = require('./models/location');
const Home = require('./models/home');

let app = express();



// ROUTES
const newuser = require('./routes/user');
const generalPagesRoutes = require('./routes/generalPages');
const locationRoutes = require('./routes/location');
const homeRoutes = require('./routes/home');
const login = require('./routes/login');
const logout = require('./routes/logout');
const editHome = require('./routes/editHome');
const deleteHome = require('./routes/deleteHome');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Airbnb DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/airbnbV12', {useNewUrlParser: true});

mongoose.connection.once('open', function () {
    console.log('Connection has been made...');


}).on('error', function (error) {
    console.log('Connection error:', error);
});


app.use(expressSession({

    secret: "My secret message that should be long and memorable",

    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( (req, res, next) => {
    res.locals.user = req.user;
    next();
});


// const romeArr = [
//     {
//         'main_image': 'https://a0.muscache.com/4ea/air/v2/pictures/c9db035f-7239-4b52-a8fa-b3e8622c8171.jpg?t=r:w1200-h720-sfit,e:fjpg-c90',
//         'name': 'Splendido Loft Appartamento Vicino a Piazza Dei Spagna',
//         'price': '169',
//         'rating': 5,
//         'beds': 3
//     },
//     {
//         'main_image': 'https://a0.muscache.com/4ea/air/v2/pictures/c44a74c2-df6a-4e0b-8300-6b18ae6901cd.jpg?t=r:w1200-h720-sfit,e:fjpg-c90',
//         'name': 'Romantico Appartamento con Vista sulla Fontana',
//         'price': '79',
//         'rating': 5,
//         'beds': 3
//     },
//     {
//         'main_image': 'https://a0.muscache.com/4ea/air/v2/pictures/b8262e99-4f56-4c42-adc6-6f0a0d2a4d2d.jpg?t=r:w1200-h720-sfit,e:fjpg-c90',
//         'name': 'Modern Apartment with View of Piazza Del Popolo',
//         'price': '89',
//         'rating': 5,
//         'beds': 3
//     },
//     {
//         'main_image': 'https://a0.muscache.com/4ea/air/v2/pictures/ae327b04-5ed4-4017-84ba-4744ce5dc43e.jpg?t=r:w1200-h720-sfit,e:fjpg-c90',
//         'name': "Campo de' Fiori Deluxe Apartment",
//         'price': '149',
//         'rating': 5,
//         'beds': 3
//     }
// ];

// let locationHouse = new Location({
//     name: 'rome',
//     houses: []
// }).save();

// romeArr.forEach((home, i) => {

//     new Home(home).save().then((result) => {
//         locationHouse.houses.push(result)

//         if(i === romeArr.length - 1){
//             locationHouse.save()
//         }
//     })

// })

app.use(newuser);

app.use(login);

app.use(logout)

app.use(generalPagesRoutes);

app.use(locationRoutes);

app.use(editHome);

app.use(deleteHome);

app.use(homeRoutes);


app.listen(process.env.PORT || 3000, process.env.IP);