import mongoose, { Schema, Document } from 'mongoose';

interface ItemDocument extends Document {
  id: number;
  name: string;
  selected: boolean;
}

const ItemSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  selected: { type: Boolean, required: true }
});

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  verified: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

interface UserOTPVerificationDocument extends Document {
  userId: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const UserOTPVerificationSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

UserSchema.index({ email: 1 });

const Item = mongoose.models.Item || mongoose.model<ItemDocument>('Item', ItemSchema);
const User = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
const UserOTPVerification = mongoose.models.UserOTPVerification || 
  mongoose.model<UserOTPVerificationDocument>('UserOTPVerification', UserOTPVerificationSchema);

export { Item, User, UserOTPVerification };