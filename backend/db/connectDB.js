import mongoose from "mongoose";

export const conenctDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
    if (connection) {
      console.log(`MongoDBd database connected successfully`);
    }
  } catch (error) {
    console.log(`Error connection to MongoDB.\nError code: ${error}`);
    process.exit(1);
  }
};
