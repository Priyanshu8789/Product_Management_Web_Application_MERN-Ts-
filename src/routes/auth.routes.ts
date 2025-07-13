import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from '../config/passport';
import {
  signUp,
  signIn,
  oauthRedirect,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';

const router = express.Router();

// Session & Passport init
router.use(cookieParser());
router.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

// Local Auth
router.post('/signup', signUp);
router.post('/signin', signIn);

// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthRedirect);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), oauthRedirect);

// Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
