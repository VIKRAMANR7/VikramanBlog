import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (err: Error) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(`${mongoURI}/vikramanblog`, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error(
      "❌ Failed to connect to MongoDB:",
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};
