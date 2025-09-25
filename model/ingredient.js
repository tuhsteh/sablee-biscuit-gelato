// how do we make one Mongoose Model/Schema use another custom type???
const { Category } = require('./category');
const { Unit } = require('./unit');
const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, default: '' },
  quantity: { type: Number, required: false, default: null },
  units: { type: Unit, required: false, default: null },
  category: { type: Category, required: true, default: null },
});

module.exports = mongoose.model('ingredient', ingredientSchema);
