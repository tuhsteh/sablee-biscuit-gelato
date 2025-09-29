require('./config/database').connect();
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
const corsOptions = {
  origin: 'http://example.com', // TODO
  optionsSuccessStatus: 200, // for some legacy browsers
};
app.use(express.json({ limit: '50mb' }));

require('./routes/userRoutes')(app, corsOptions);
require('./routes/invitationRoutes')(app, corsOptions);
require('./routes/familyRoutes')(app, corsOptions);
require('./routes/recipeRoutes')(app, corsOptions);
require('./routes/ingredientRoutes')(app, corsOptions);

module.exports = app;
