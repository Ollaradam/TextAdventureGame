// server/passport.mjs
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import Educator from './models/educator_model.mjs';

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
};

// Authorization with JWT
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "testing"
    }, async (payload, done) => {
    try {
        const educator = await Educator.findById(payload.sub); // Ensure correct ID reference
        if (educator) {
            done(null, educator);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err, false);
    }
}));

// Authentication with Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const educator = await Educator.findOne({ email: email });
        if (!educator) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        educator.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, educator);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    } catch (err) {
        return done(err);
    }
}));

// Serialize user to the session
passport.serializeUser((user, done) => {
    console.log("SERIALIZING USER")
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
      const user = await Educator.findById(id);
      console.log(user)
      done(null, user);
    } catch (err) {
      done(err);
    }
});
  

export default passport;
