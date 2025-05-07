import { Schema, model, models } from "mongoose";

const eventSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  institutionName: {
    type: String,
    required: true
  },
  schedule: {
    type: Schema.Types.ObjectId,
    ref: "Schedule",
    required: true
  },
  numberOfMembers: {
    type: Number,
    required: true
  },
  representativeName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  proof: {
    type: String // URL or path to document
  }
  
}, { timestamps: true });

const Event = models.Event || model("Event", eventSchema);
export default Event;
