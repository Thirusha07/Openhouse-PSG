import mongoose from "mongoose";

const MONGODB_URI = "";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        console.log("Entered to db");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

export default connectDB;