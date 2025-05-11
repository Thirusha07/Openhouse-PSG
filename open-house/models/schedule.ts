import { Schema, model, models } from "mongoose";

const scheduleSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Schedule = models.Schedule || model("Schedule", scheduleSchema);
export default Schedule;
