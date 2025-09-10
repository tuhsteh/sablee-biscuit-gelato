require('@dotenvx/dotenvx').config();
const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {})
    .then(() => {
      console.log('Successfully connected to database');
    })
    .catch((error) => {
      console.log('database connection failed. exiting now...' + error);
      console.error(JSON.stringify(error));
      process.exit(1);
    });
};
