import mongoose, { Schema, model, models } from "mongoose";

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // The document will be automatically deleted after 10 minutes
  },
});

const Otp = models.Otp || model("Otp", OTPSchema);

export default Otp;