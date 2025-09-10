require('./config/database').connect();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');

const auth = require('./middleware/auth');
const User = require('./model/user');

const app = express();

app.use(cors());
const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200, // for some legacy browsers
};
app.use(express.json({ limit: '50mb' }));

require('./routes/userRoutes')(app, corsOptions);

module.exports = app;
