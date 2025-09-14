/**
 * I want a way to link users so they can share the same schedule,
 * and fight over suggestions for alternative meal choices.
 * It's not just because someone used someone else's invite code either.
 * Steve can give an invite to Roger, and they only
 * play poker on Friday nights.  They're not meal planning together.
 * But Roger, his wife Cheryl, their teenage daughters McKenzie
 * and McKayla, and Cheryl's boyfriend _are_ meal planning together.
 */

const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  family_name: {
    type: String,
    required: true,
    default: null,
    minLength: 3,
    maxLength: 39,
  },
  family_members: {
    type: Array,
    required: true
  }, // by email; eventually, that email may be a user.
  creator_id: { type: String, required: true },
});

module.exports = mongoose.model('family', familySchema);

// exports.familyModel = mongoose.model('family', familySchema);
// exports.familyCreateCountLimit = 10;

// const familyModel = mongoose.model('family', familySchema);
// const familyCreateCountLimit = 10;
// module.exports = {
//   familyModel,
//   familyCreateCountLimit,
// }
