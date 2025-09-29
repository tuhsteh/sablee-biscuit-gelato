const mongoose = require('mongoose');

// const unit = ['tsp', 'Tbsp', 'c', 'qt', 'gal', 'ea.', 'oz', 'lb', 'g', 'kg', 'mL', 'L'];
const unit = require('./ingredient');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, default: '' },
  url: { type: String, required: false, default: '' },
  ingredients: { type: Array, required: true, default: [] }, // this needs further thought
  complexity: { type: Number, required: true, default: 5 }, // this needs an enum, and further thought
  creator_id: { type: String, required: true },
  suggestions: { type: Number, required: true, default: 0 }, // how often the schedule placed it
  swaps: { type: Number, required: true, default: 0 }, // how often someone hit replay
});

module.exports = mongoose.model('recipe', recipeSchema);

// ingredients[] will need to be
// [
//   {
//     ingredient: Ingredient, (has to be by Id, right?)
//     quantity: Number,
//     units: unit
//   }, ...
// ]
