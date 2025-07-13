import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user.interface';

export interface IUserModel extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserModel>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ['admin','user'], default: 'user' },
    resetPasswordToken:   String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password
userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUserModel>('User', userSchema);
