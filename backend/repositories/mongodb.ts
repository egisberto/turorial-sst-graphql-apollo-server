import * as mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;

// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
// let client = mongodb
let cachedDb: mongodb.Db;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // const connection = await MongoClient.connect("mongodb+srv://sst-tutorial-user:3RsL6vvk22szh5J2@sst-instance.3uwvs.mongodb.net/demo?retryWrites=true&w=majority");
  const connection = await MongoClient.connect(process.env.MONGODB_URI || '');
  cachedDb = connection.db("demo");

  return cachedDb
}