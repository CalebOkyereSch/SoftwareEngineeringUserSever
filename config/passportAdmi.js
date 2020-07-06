const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Admi = mongoose.model("admi");
const keys = require("../config/keys");

const opt = {};

opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opt, (jwt_payload, done) => {
      Admi.findById(jwt_payload.id)
        .then((admi) => {
          if (admi) {
            return done(null, admi);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
