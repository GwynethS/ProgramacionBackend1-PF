import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "Ecommerce" });

    console.log("Connected to DB successfully");
  } catch (e) {
    console.log("Couldn't connect to DB: " + e.message);
  }
};
