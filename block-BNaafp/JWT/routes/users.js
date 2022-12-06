var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */
//signup
router.post('/signup', async (req, res) => {
  try {
    var user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});
//login
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Password Incorrect' });
    }
    return res.status(200).json({ success: 'Generate token' });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
