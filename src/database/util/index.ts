import mongoose from "mongoose";

export function isDatabaseConnected() {
  return mongoose.connection.readyState != mongoose.ConnectionStates.connected;
}
