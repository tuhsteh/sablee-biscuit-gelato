const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = require('../model/user');
const Invitation = require('../model/invitation');

module.exports = function (app, corsOptions) {
  app.post('/register', async (req, res) => {
    try {
      const { firstName, lastName, email, password, inviteCode } = req.body;
      if (!(email && password && firstName && lastName && inviteCode)) {
        res.status(400).send('All input is required');
      }
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(409).send('User already exists. Please login.');
      }

      const invite = await Invitation.findOne(
        { invite_email: email },
        { invite_code: inviteCode },
      );
      if (!invite) {
        return res.status(400).send('You must be invited to join');
      }

      encryptedUserPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(), // TODO:  sanitize
        password: encryptedUserPassword,
        invite_code: inviteCode,
      });

      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '5h',
        },
      );
      user.token = token;

      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error:  ' + JSON.stringify(err));
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        res.status(400).send('All input is required');
      }
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: '5h',
          },
        );
        user.token = token;

        let userCopy = JSON.parse(JSON.stringify(user));      
        delete userCopy.password;
        delete userCopy._id;
        console.log(`User:  ${JSON.stringify(userCopy)}`);
        
        return res.status(200).json(userCopy);
      }
      return res.status(400).send('Invalid Credentials');
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error:  ' + JSON.stringify(err));
    }
  });

  app.post('/welcome', cors(corsOptions), auth, (req, res) => {
    res.status(200).send('Welcome to FreeCodeCamp 🙌');
  });

  app.post('/me', cors(corsOptions), auth, (req, res) => {
    res.status(200).json(req.user);
  });
};
