const auth = require('../middleware/auth');
const cors = require('cors');

const Family = require('../model/family');
const User = require('../model/user');

const createFamilyCountLimit = 10;

module.exports = function (app, corsOptions) {
  // Create a new Family.
  app.post('/family', auth, cors(corsOptions), async (req, res) => {
    try {
      const { familyName } = req.body;
      const { user_id } = req.user;
      if (!familyName) {
        res.status(400).send('Name is required');
      }
      // console.log(`Name:    ${JSON.stringify(familyName)}`);
      // console.log(`UserID:  ${JSON.stringify(user_id)}`);
      // console.log(`Name:    ${JSON.stringify(typeof familyName)}`);
      // console.log(`UserID:  ${JSON.stringify(typeof user_id)}`);

      // TODO:  check that a user is within Family Create Quota

      const oldFamily = await Family.findOne({
        family_name: familyName,
        creator_id: user_id,
      });
      if (oldFamily) {
        return res.status(409).send('You already started that family.');
      }
      const creator = await User.findById(user_id);
      const result = await Family.insertOne({
        family_name: familyName,
        family_members: [creator.email],
        creator_id: user_id,
      });
      return res.status(201).json(result);
    } catch (err) {
      console.log(`Error in general:  ${JSON.stringify(err)}`);
      return res.status(500).send();
    }
  });

  // Add a new email to a Family Members list.
  app.put('/family', auth, cors(corsOptions), async (req, res) => {
    // TODO
  });
};
