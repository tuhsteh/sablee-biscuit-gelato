const auth = require('../middleware/auth');
const cors = require('cors');

const Recipe = require('../model/recipe');

module.exports = function (app, corsOptions) {
  app.get('/recipe', auth, cors(corsOptions), async (req, res) => {
    try {
      const recipes = await Recipe.find();
    } catch (err) {
      console.log(`Error reading recipes:  ${JSON.stringify(err)}`);
      return res.status(500).send('Error reading recipes');
    }
  });
};
