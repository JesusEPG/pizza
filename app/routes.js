// grab the nerd model we just created
var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var Pizza = require('./models/pizzas');
var User = require('./models/user');
var Order = require('./models/order');
var passport  = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/db'); // get db config file
    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // api routes
        app.get('/api/pizzas', function(req, res) {

            // use mongoose to get all nerds in the database
            Pizza.find(function(err, pizzas) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                //console.log(pizzas);
                res.json(pizzas); // return all nerds in JSON format
            });
        });

        // create a new user account (POST http://localhost:3000/api/signup)

        app.post('/api/signup', function(req, res) {
          if (!req.body.name || !req.body.password) {
            res.json({success: false, msg: 'Please pass name and password.'});
          } else {
            var newUser = new User({
              name: req.body.name,
              password: req.body.password
            });
            // save the user
            newUser.save(function(err) {
              if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
              }
              res.json({success: true, msg: 'Successful created new user.'});
            });
          }
        });

        // route to authenticate a user (POST http://localhost:3000/api/authenticate)
        app.post('/api/authenticate', function(req, res) {
                  User.findOne({
                    name: req.body.name
                  }, function(err, user) {
                    if (err) throw err;
                 
                    if (!user) {
                      res.send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                      // check if password matches
                      user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                          // if user is found and password is right create a token
                          var token = jwt.encode(user, config.secret);
                          // return the information including token as JSON
                          res.json({success: true, token: 'JWT ' + token});
                        } else {
                          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                        }
                      });
                    }
                  });
                });

        /*app.post('/checkout', function (req, res, next){

                  //var cart = req.body.cart;

                  var order = new Order({
                    //user: req.user,
                    cart: req.body.cart,
                    address: req.body.address,
                    name: req.body.name
                  });

                  order.save(function(err, result){
                    if (err) {
                        return res.send();
                    }
                    res.json({success: true, msj: 'Se guardó la orden en bdd'});
                  });

        });*/


        app.post('/checkout', passport.authenticate('jwt', { session: false}), function(req, res) {
                  var token = getToken(req.headers);
                  if (token) {
                    var decoded = jwt.decode(token, config.secret);
                    User.findOne({
                      name: decoded.name
                    }, function(err, user) {
                        if (err) throw err;
                 
                        if (!user) {
                          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                        } else {
                          //var cart = req.body.cart;

                          var order = new Order({
                            user: user,
                            cart: req.body.cart,
                            address: req.body.address,
                            name: req.body.name
                          });

                          order.save(function(err, result){
                            if (err) {
                                return res.send();
                            }
                            res.json({success: true, msj: 'Se guardó la orden en bdd'});
                          });
                          //res.json({success: true, msg: 'Welcome in the member area ' + user._id + '!'});
                        }
                    });
                  } else {
                    return res.status(403).send({success: false, msg: 'No token provided.'});
                  }
        });
        

        // route to a restricted info (GET http://localhost:3000/api/memberinfo)
        app.get('/checkout', passport.authenticate('jwt', { session: false}), function(req, res) {
                  var token = getToken(req.headers);
                  if (token) {
                    var decoded = jwt.decode(token, config.secret);
                    User.findOne({
                      name: decoded.name
                    }, function(err, user) {
                        if (err) throw err;
                 
                        if (!user) {
                          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                        } else {
                          res.json({success: true, msg: 'Welcome in the member area ' + user._id + '!'});
                        }
                    });
                  } else {
                    return res.status(403).send({success: false, msg: 'No token provided.'});
                  }
        });

        // route to a restricted info (GET http://localhost:3000/api/memberinfo)
        app.get('/api/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
                  var token = getToken(req.headers);
                  if (token) {
                    var decoded = jwt.decode(token, config.secret);
                    User.findOne({
                      name: decoded.name
                    }, function(err, user) {
                        if (err) throw err;
                 
                        if (!user) {
                          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                        } else {
                          res.json({success: true, msg: 'Welcome in the member area ' + user._id + '!'});
                        }
                    });
                  } else {
                    return res.status(403).send({success: false, msg: 'No token provided.'});
                  }
        });
                 
                getToken = function (headers) {
                  if (headers && headers.authorization) {
                    var parted = headers.authorization.split(' ');
                    if (parted.length === 2) {
                      return parted[1];
                    } else {
                      return null;
                    }
                  } else {
                    return null;
                  }
                };

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendFile('../views/index.ejs'); // load our public/index.html file
        });

    };