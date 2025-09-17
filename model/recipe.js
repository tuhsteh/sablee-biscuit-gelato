const mongoose = require('mongoose');

// schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, default: '' },
  url: { type: mongoose.Types.url, required: false },
  ingredients: { type: Array, required: true, default: [] }, // this needs further thought
  complexity: { type: Number, required: true, default: 5 }, // this needs an enum, and further thought
});

// export model.
module.exports = mongoose.model('recipe', recipeSchema);
