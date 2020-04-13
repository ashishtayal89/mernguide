const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users"); // Model class

passport.serializeUser((user, done) => {
  done(null, user.id); // This is mongo DB id and not googleId.
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, { id });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleID: profile.id }); // Fetch Model Instance
      if (!user) {
        user = await new User({ googleID: profile.id }).save(); // Creates Model Instance
      }
      done(null, user);
    }
  )
);
