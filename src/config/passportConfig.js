import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    // console.log("we are inside serializeUser");
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    // console.log("we are inside deserializeUser");
    const user = await User.findById(_id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;