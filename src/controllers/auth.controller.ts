import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/user.model';
import { IUser } from '../types/user.interface';
import HttpStatus  from '../utils/constants/httpStatus';
import Messages from '../utils/constants/messages';
import { successResponse, errorResponse } from '../utils/apiResponse';

// Generate JWT
const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

// POST /api/auth/signup
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as IUser;
    const user = await User.create({ name, email, password, role });
    const token = signToken(user.id);
    return successResponse(res, HttpStatus.CREATED, { user, token }, Messages.Auth.SignUpSuccess);
  } catch (err) {
    return errorResponse(res, HttpStatus.BAD_REQUEST, Messages.Auth.SignUpFailed, err,req);
  }
};

// POST /api/auth/signin
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, HttpStatus.UNAUTHORIZED, Messages.Auth.SignInFailed);
    }
    const token = signToken(user.id);
    return successResponse(res, HttpStatus.OK, { user, token }, Messages.Auth.SignInSuccess);
  } catch (err) {
    return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.Server.Error, err, req);
  }
};

// GET /api/auth/google/callback & /facebook/callback
export const oauthRedirect = (req: Request, res: Response) => {
  const token = signToken((req.user as any).id);
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, HttpStatus.NOT_FOUND, Messages.Auth.PasswordResetFailed);
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      text: `Reset link: ${process.env.CLIENT_URL}/reset-password/${token}`,
    });

    return successResponse(res, HttpStatus.OK, null, Messages.Auth.PasswordResetSent);
  } catch (err) {
    return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.Server.Error, err, req);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password');
    if (!user) {
      return errorResponse(res, HttpStatus.BAD_REQUEST, Messages.Auth.PasswordResetInvalid);
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return successResponse(res, HttpStatus.OK, null, Messages.Auth.PasswordResetSuccess);
  } catch (err) {
    return errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, Messages.Server.Error, err, req);
  }
};
