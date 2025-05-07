import { Schema, model, models } from "mongoose";

const labSchema = new Schema({
  labName: {
    type: String,
    required: true,
    unique: true
  },
  departmentName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String // URL or path to image
  }
}, { timestamps: true });

const Lab = models.Lab || model("Lab", labSchema);
export default Lab;
