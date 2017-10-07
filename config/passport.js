var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


// load up the user model
var User = require('../app/models/user');
var config = require('../config/db'); // get db config file
 

/* For now, this just defines how PassportJS tries to find a user with a given jwt_payload.id. */


/* The payload will carry the bulk of our JWT, also called the JWT Claims. 
This is where we will put the information that we want to transmit and other information about our token.
There are multiple claims that we can provide. This includes registered claim names, public claim names, and private claim names. */

module.exports = function(passport) {
  var opts = {};
  //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};