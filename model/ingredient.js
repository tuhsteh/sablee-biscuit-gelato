// how do we make one Mongoose Model/Schema use another custom type???
const mongoose = require('mongoose');

// const category = [
//   'baking',
//   'beverage',
//   'bread',
//   'bulk',
//   'canned',
//   'dairy',
//   'deli',
//   'frozen',
//   'meat',
//   'produce',
//   'staples',
// ];

const category = require('./category');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, default: '' },
  category: { type: String, enum: category, required: true, default: null },
  creator_id: { type: String, required: true },
});

module.exports = mongoose.model('ingredient', ingredientSchema);
