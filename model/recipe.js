const mongoose = require('mongoose');

// schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, default: '' },
  url: { type: String, required: false, default: '' },
  ingredients: { type: Array, required: true, default: [] }, // this needs further thought
  complexity: { type: Number, required: true, default: 5 }, // this needs an enum, and further thought
  creator_id: { type: String, required: true },
  suggestions: { type: Number, required: true, default: 0 }, // how often the schedule placed it
  swaps: { type: Number, required: true, default: 0 }, // how often someone hit replay
});

// export model.
module.exports = mongoose.model('recipe', recipeSchema);
