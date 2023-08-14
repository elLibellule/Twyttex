const passport = require("passport");
const app = require("../app");
const {
  findUserById,
  findUserByEmail,
  findUserByGoogleId,
  createUser,
} = require("../queries/user.queries");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);
        if (user) {
          const match = await user.comparePassword(password);
          if (match) {
            done(null, user);
          } else {
            done(null, false, { message: "Password doesn't match " });
          }
        } else {
          done(null, false, { message: "User not found" });
        }
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);

// passport.use(
//   "google",
//   new GoogleStrategy(
//     {
//       clientID:
//         "620734925140-a9echv9r33v3v6l1j1km18k8a9qjk29m.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "/auth/google/cb",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       try {
//         const user = await findUserByGoogleId(profile.id);
//         if (user) {
//           done(null, user);
//         } else {
//           const newUser = await createUser(profile, "google");
//           done(null, newUser);
//         }
//       } catch (err) {
//         done(err);
//       }
//     }
//   )
// );
