import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(`${process.env.MONGODB_URI}/vikramanblog`);
  console.log("Database connected");
}
