import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {

  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const dbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`|| '',
      {},
    );

    connection.isConnected = dbInstance.connections[0].readyState;
    // console.log("connection establish", dbInstance);
    // console.log("db Connection ", dbInstance.connection)
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
