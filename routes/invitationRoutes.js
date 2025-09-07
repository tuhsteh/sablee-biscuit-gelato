require("@dotenvx/dotenvx").config();
const auth = require("../middleware/auth");
const invitation = require("../model/invitation");
const express = require("express");
const router = express.Router();


// Create a new invitation
router.post("/invitation", auth, async (req, res) => {
  try {
    const { invite_email } = req.body;
    const creator_id = req.user.user_id;
    if (!invite_email) {
      return res.status(400).send("Invite email is required");
    }

    const newInvitation = await invitation.create({
      creator_id,
      invite_email,
    });

    res.status(201).json(newInvitation);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error:  " + JSON.stringify(err));
  }
});

// Get invitation by code
router.get("/invitation/:code", auth, async (req, res) => {
  try {
    const { code } = req.params;
    const invite = await invitation.findOne({ code });
    if (!invite) {
      return res.status(404).send("Invitation not found");
    }
    res.status(200).json(invite);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error:  " + JSON.stringify(err));
  }
});

module.exports = router;  
