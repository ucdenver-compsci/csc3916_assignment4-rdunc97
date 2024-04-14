/*
CSC3916 HW4
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
var Reviews = require('./Reviews');
// const Reviews = require('./Reviews');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});
router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});


//reviews 
router.post('/reviews',function (req,res) {
    if (!req.body.username || !req.body.movieid || !req.body.review || !req.body.rating) {
        return res.json({ success: false, message: 'incomplete review'});
    } else {
        var newReview = new Reviews();
        newReview.username = req.body.username;
        newReview.movieid = req.body.movieid;
        newReview.review = req.body.review;
        newReview.rating = req.body.rating;

        newReview.save(function(err) {
            if (err) {
                return res.json(err);
            }
            res.json({success: true,msg: 'Review Created!'})
        });
    }
});


router.get('reviews/id', function(req,res) {
    if (!req.body.username || !req.body.movieid || !req.body.review || !req.body.rating) {
        return res.json({ success: false, message: 'incomplete review'});
    }
    Reviews.findOne({ movieid: req.body.movieid }).select('movieid username review rating').exec(function(err, reviewOut) {
        if (err) {
            res.send(err);
        }
        res.json ({movieid: movieOut.movieid, username: movieOut.username, rating: movieOut.rating, review: movieOut.review});
    })



//aggregate reviews
    if (req.query.reviews == True) {
        Order.aggregate([
            {
                $match: {_id: orderId}
            },
            {
                $lookup: {
                    from: "items",
                    localField: "items",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            }
        ]).exec(function(err, result){
            if (err) {
                res.send(err);
            } else {
                console.log(result);
            }
        });
    }
});



//movies route get post put delete 
router.route('/movies') 
    .get(authJwtController.isAuthenticated, (req,res) => {
        Movie.find(function(err,movies){
            if(err) {
                res.status(500).send(err);
            }
            res.json(movies);
        })
    })
    .post(authJwtController.isAuthenticated, (req,res) => {
        let newMovie = new Movie;
        newMovie.title = req.body.title;
        newMovie.releaseDate = req.body.releaseDate;
        newMovie.genre = req.body.genre;
        newMovie.actors = req.body.actors;
        newMovie.save(function(err) {
            if(err) {
                if(err.code == 11000) {
                    return res.status(400).json({
                        success: "false",
                        message: "title exists already"
                    });
                }
                return res.status(500).send(err);
            }
            res.json({message: "movie created"});
        });
    })
    .put(authJwtController.isAuthenticated, (req, res) => {
        Movie.findOneAndUpdate(
            { title: req.body.title },
            req.body,
            { new: true, upsert: true },
            function(err, movie) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({ message: "Movie Updated", movie: movie });
            }
        );
    })
    .delete(authJwtController.isAuthenticated, (req, res) => {
        Movie.findOneAndDelete({ title: req.body.title }, function(err, movie) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!movie) {
                return res.status(404).json({
                    success: false,
                    message: "Movie not found"
                });
            }
            res.json({ message: "Movie Deleted", movie: movie });
        });
    })
    .all((req, res) => {
        // Any other HTTP Method
        // Returns a message stating that the HTTP method is unsupported.
        res.status(405).send({ message: 'HTTP method not supported.' });
    });

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only