const auth = require('../middleware/auth');
const cors = require('cors');

const Ingredient = require('../model/ingredient');

module.exports = function (app, corsOpt) {
  app.get('/ingredient', auth, cors(corsOpt), async (req, res) => {
    const ingredients = await Ingredient.find();
    if (!ingredients || null == ingredients) {
      console.log('Error getting ingredients');
      return res.status(404).send();
    }
    return res.status(200).json(ingredients);
  });

  app.get('/ingredient/:name', auth, cors(corsOpt), async (req, res) => {
    try {
      const { name } = req.params;
      const { user_id } = req.user;
      if (!name) {
        return res.status(400).send('Missing required parameter');
      }

      const foundIngredient = await Ingredient.find({
        name,
        creator_id: user_id,
      });
      if (!foundIngredient || 0 == foundIngredient.length) {
        return res.status(404).send();
      }
      if (1 < foundIngredient.length) {
        console.log(
          `Found multiple Ingredients by that name:  ${foundIngredient.length}`,
        );
      }
      return res.status(200).json(foundIngredient);
    } catch (err) {
      console.log(`Error finding Ingredient:  ${err}`);
      return res.status(500).send();
    }
  });

  app.post('/ingredient', auth, cors(corsOpt), async (req, res) => {
    try {
      const { name, category } = req.body;
      if (!name) {
        return res.status(400).send('Missing required parameters');
      }
      // validate category here...
      const { user_id } = req.user;
      const oldIngredient = await Ingredient.findOne({
        name,
        category,
        creator_id: user_id,
      });
      if (oldIngredient) {
        return res
          .status(409)
          .send('You already created an ingredient with that Name/Category');
      }
      const result = await Ingredient.insertOne({
        name,
        category,
        creator_id: user_id,
      });
      return res.status(201).json(result);
    } catch (err) {
      console.log(`Error POSTing ingredient:  ${err}`);
      return res.status(500).send('Error creating Ingredient');
    }
  });
};
