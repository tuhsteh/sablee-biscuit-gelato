const auth = require('../middleware/auth');
const cors = require('cors');

const Family = require('../model/family');
const User = require('../model/user');

const createFamilyCountLimit = 10;

module.exports = function (app, corsOpt) {
  // Create a new Family.
  app.post('/family', auth, cors(corsOpt), async (req, res) => {
    try {
      const { familyName } = req.body;
      const { user_id } = req.user;
      if (!familyName) {
        res.status(400).send('Name is required');
      }

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
      return res.status(500).send();
    }
  });

  // Add a new email to a Family Members list.
  app.put('/family', auth, cors(corsOpt), async (req, res) => {
    try {
      const { email, familyName } = req.body;
      const { user_id } = req.user;
      if (!(email && familyName)) {
        res.status(400).send('All input is required');
      }

      const existingFamilies = await Family.find({
        family_name: familyName,
      });
      if (0 == existingFamilies.length) {
        return res.status(404).send("That family hasn't been started");
      }
      if (existingFamilies) {
        if (1 < existingFamilies.length) {
          return res
            .status(409)
            .send('You have several families with that last name; Support TBD');
        }
        const fam = existingFamilies[0];
        fam.family_members.push(email);
        await fam.save();
        return res.status(201).json(fam);
      }
    } catch (err) {
      console.log(`Error adding new family member:  ${err}`);
      return res.status(500).send('Error adding new family member');
    }
  });

  // Get my family list.
  app.get('/family', auth, cors(corsOpt), async (req, res) => {
    try {
      const family_name = null;
      const { user_id } = req.user;
      const foundFamily = await findFamilies(family_name, user_id);
      if (foundFamily && foundFamily.length > 0) {
        return res.status(200).json(foundFamily);
      }

      return res.status(404).send('You do not appear to have started any families');
    } catch (err) {
      return res.status(500).send('Error getting your family list');
    }
  });

  // Get my family by name.
  app.get('/family/:family_name', auth, cors(corsOpt), async (req, res) => {
    try {
      const { family_name } = req.params;
      const { user_id } = req.user;

      const foundFamily = await findFamilies(family_name, user_id);
      if (!foundFamily) {
        return res.status(404).send("You haven't started any families");
      } else if (foundFamily.length > 0) {
        return res.status(200).json(foundFamily);
      }
      return res.status(404).send("You haven't started a family with that name");
    } catch (err) {
      return res.status(500).send('Error getting your family list');
    }
  });

  // Delete one family by name.
  app.delete('/family/:family_name', auth, cors(corsOpt), async (req, res) => {
    try {
      const { family_name } = req.params;
      const { user_id } = req.user;

      const foundFamily = await findFamilies(family_name, user_id);
      if (!(foundFamily && foundFamily[0])) {
        return res.status(404).send("You haven't started a family with that name");
      } else if (foundFamily.length > 1) {
        return res
          .status(409)
          .send('You have several families with that last name; Support TBD');
      }
      await Family.findById(foundFamily[0]._id).deleteOne();
      return res.status(204).send();
    } catch (err) {
      console.log(`Error deleting a family:  ${err}`);
      return res.status(500).send('Error deleting a family');
    }
  });
};

const findFamilies = async function (family_name_filter, user_id) {
  let oldFamily = null;
  if (family_name_filter) {
    oldFamily = await Family.find({
      family_name: family_name_filter,
      creator_id: user_id,
    });
  } else {
    oldFamily = await Family.find({
      creator_id: user_id,
    });
  }
  return oldFamily;
};
