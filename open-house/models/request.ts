import { Schema, model, models } from "mongoose";

const requestSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
    required: true
  }
}, { timestamps: true });

const Request = models.Request || model("Request", requestSchema);
export default Request;
