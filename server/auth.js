
var passport = require("passport");
var passportJWT = require("passport-jwt");
var cfg = require("./config.js");

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

var db = null;

module.exports = function() {
    var strategy = new Strategy(params, (payload, done) => {
        db.collection("users").findOne({id:payload.id}).then((user) => {

        if (user) {
            return done(null, {
                id: user.id
            });
        } else {
            return done(new Error("User not found"), null);
        }
      });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        },
        setDB: function(db_) {
          db = db_;
        }
    };
};
