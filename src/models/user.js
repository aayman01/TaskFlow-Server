import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    isFaActive: {
      type: Boolean,
      required: false,
    },
    twoFactorSecret: {
      type: String,
      required: false,
    },
    emailVerificationCode: {
      code: String,
      expiresAt: Date
    },
    isEmailVerified: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;