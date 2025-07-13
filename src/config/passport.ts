// src/config/passport.ts
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/user.model';

// Serialize/Deserialize
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const u = await User.findById(id);
  done(null, u);
});

// Google OAuth
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:  '/api/auth/google/callback',
  },
  async (_, __, profile, done) => {
    const email = profile.emails?.[0].value!;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        password: Math.random().toString(36).slice(-8),
        role: 'user',
      });
    }
    done(null, user);
  }
));

// Facebook OAuth
passport.use(new FacebookStrategy({
    clientID:     process.env.FB_APP_ID!,
    clientSecret: process.env.FB_APP_SECRET!,
    callbackURL:  '/api/auth/facebook/callback',
    profileFields: ['id','displayName','emails']
  },
  async (_, __, profile, done) => {
    const email = profile.emails?.[0].value!;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        password: Math.random().toString(36).slice(-8),
        role: 'user',
      });
    }
    done(null, user);
  }
));

export default passport;
