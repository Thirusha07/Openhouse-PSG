import { Schema, model, models } from "mongoose";
import Schedule from "./schedule";

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
  idProof: {
    type: String, // base64 encoded string of the ID proof
    required: true
  },
  studentList: {
    type: String, // base64 encoded string of the student list
    required: true
  }
}, { timestamps: true });

const Event = models.Event || model("Event", eventSchema);
export default Event;
