const serverless = require("serverless-http");

const app = require("./src");
const connectDb = require("./src/database");

let cachedDb = null;

console.log("Starting Lambda function...");
module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!cachedDb) {
    cachedDb = await connectDb();
  }

  return serverless(app)(event, context);
};
console.log("Lambda function initialized.");
