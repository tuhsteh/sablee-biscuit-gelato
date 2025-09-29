const auth = require('../middleware/auth');
const cors = require('cors');

const Recipe = require('../model/recipe');

module.exports = function (app, corsOpt) {
  app.get('/recipe', auth, cors(corsOpt), async (req, res) => {
    try {
      const recipes = await Recipe.find();
      return res.status(200).json(recipes);
    } catch (err) {
      console.log(`Error reading recipes:  ${err}`);
      return res.status(500).send('Error reading recipes');
    }
  });

  app.get('/recipe/id/:id', auth, cors(corsOpt), async (req, res) => {
    try {
      const recipes = await Recipe.findById(req.params.id);
      return res.status(200).json(recipes);
    } catch (err) {
      console.log(`Error reading recipes:  ${err}`);
      return res.status(500).send('Error reading recipes');
    }
  });

  app.get('/recipe/title/:title', auth, cors(corsOpt), async (req, res) => {
    try {
      const { title } = req.params;
      const { user_id } = req.user;
      const foundRecipes = await Recipe.find({ title, creator_id: user_id });

      if (!(foundRecipes && foundRecipes[0])) {
        return res.status(404).send("You haven't cooked a recipe with that title");
      } else if (foundRecipes.length > 1) {
        return res
          .status(409)
          .send('You have several recipes with that title; Support TBD');
      }
      return res.status(200).json(foundRecipes[0]);
    } catch (err) {
      console.log(`Error reading recipes:  ${err}`);
      return res.status(500).send('Error reading recipes');
    }
  });

  app.delete('/recipe/:title', auth, cors(corsOpt), async (req, res) => {
    try {
      const { title } = req.params;
      const { user_id } = req.user;
      const foundRecipes = await Recipe.find({ title, creator_id: user_id });

      if (!(foundRecipes && foundRecipes[0])) {
        return res.status(404).send("You haven't cooked a recipe with that title");
      } else if (foundRecipes.length > 1) {
        return res
          .status(409)
          .send('You have several recipes with that title; Support TBD');
      }
      await Recipe.findById(foundRecipes[0]._id).deleteOne();
      return res.status(204).send();
    } catch (err) {
      console.log(`Error reading recipes:  ${err}`);
      return res.status(500).send('Error reading recipes');
    }
  });

  app.post('/recipe', auth, cors(corsOpt), async (req, res) => {
    try {
      const { title, url, ingredients, complexity } = req.body;
      const { user_id } = req.user;
      if (!(title && complexity)) {
        return res.status(401).send('All input required');
      }
      const result = await Recipe.insertOne({
        title,
        url,
        ingredients,
        complexity,
        creator_id: user_id,
      });
      return res.status(201).json(result);
    } catch (err) {
      console.log(`Error creating recipe:  ${err}`);
      return res.status(500).send('Error creating recipe');
    }
  });

  app.put('/recipe', auth, cors(corsOpt), async (req, res) => {
    try {
      const { title, new_title, url, ingredients, complexity } = req.body;
      const { user_id } = req.user;
      const foundRecipe = await Recipe.find({ title, creator_id: user_id });
      if (!(foundRecipe && foundRecipe[0])) {
        return res.status(404).send("You haven't cooked a recipe with that title");
      } else if (foundRecipe.length > 1) {
        return res
          .status(409)
          .send('You have several recipes with that title; Support TBD');
      }
      if (new_title) {
        foundRecipe[0].title = new_title;
      }
      if (url) {
        foundRecipe[0].url = url;
      }
      if (ingredients) {
        foundRecipe[0].ingredients = ingredients;
      }
      if (complexity) {
        foundRecipe[0].complexity = complexity;
      }
      const result = await foundRecipe[0].save();
      return res.status(201).json(result);
    } catch (err) {
      console.log(`Error updating recipe:  ${err}`);
      res.status(500).send('Error updating recipe');
    }
  });
};
