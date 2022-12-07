var express = require('express');
const User = require('../models/User');
var router = express.Router();
var auth = require('../middlewares/auth');
/* GET users listing. */
router.post('/signup', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.json(400).json({ error: error });
  }
});
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      console.log('hot');
      res.status(400).json({ error: 'Password Incorrect' });
    }
    //generate token
    var token = await user.signToken();
    console.log(token);
    res.status(200).json(user.userJSON(token));
  } catch (error) {
    next(error);
  }
});
//dashboard
router.use(auth.verifyToken);
router.get('/dashboard', (req, res) => {
  res.status(200).json({ success: 'login success' });
});
module.exports = router;
