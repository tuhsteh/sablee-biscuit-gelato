require('@dotenvx/dotenvx').config();
const auth = require('../middleware/auth');
const Invitation = require('../model/invitation');

module.exports = function (app, corsOptions) {
  // Create a new invitation
  app.post('/invitation', auth, async (req, res) => {
    try {
      const { invite_email } = req.body;
      const creator_id = req.user.user_id;
      if (!invite_email) {
        return res.status(400).send('Invite email is required');
      }

      const newInvitation = await Invitation.create({
        creator_id,
        invite_email,
      });

      res.status(201).json(newInvitation);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error:  ' + JSON.stringify(err));
    }
  });

  // Get invitation by code
  app.get('/invitation/:code', auth, async (req, res) => {
    try {
      const { code } = req.params;
      const invite = await Invitation.findOne({
        invite_code: code,
        uses: { $lte: 1 },
      });
      if (!invite) {
        return res.status(404).send('Invitation not found');
      }
      res.status(200).json(invite);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error:  ' + JSON.stringify(err));
    }
  });

  // Use the invitation code
  app.put('/invitation/:code', auth, async (req, res) => {
    try {
      const { code } = req.params;
      const invite = await Invitation.findOne({
        invite_code: code,
        uses: { $lte: 1 },
      });
      if (!invite) {
        return res.status(404).send('Invitation not found');
      }
      // const updatedUses = '';
      const result = await Invitation.updateOne(
        { invite_code: invite.invite_code },
        { uses: invite.uses + 1 },
      );
      console.log(JSON.stringify(result));
      return res.status(204).send();
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send('Internal Server Error:  ' + JSON.stringify(err));
    }
  });
};
