import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Mongo DB connected");
  } catch (error) {
    console.error("Failed connecting to DB", error);
  }
};
export default connectDB;
