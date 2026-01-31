import mongoose from 'mongoose';

let mongoDbConn: typeof mongoose | null = null;

export async function mongoDbConnect() {
  if (mongoDbConn) {
    return mongoDbConn;
  }

  const opts = {
    bufferCommands: false,
  };

  mongoDbConn = await mongoose.connect(process.env.MONGODB_URI || '', opts);
  return mongoDbConn;
}
