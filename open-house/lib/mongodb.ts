import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://msc_ss_2021:msc2021@open.8os4bi8.mongodb.net/?retryWrites=true&w=majority&appName=open";

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