var express = require('express');
const User = require('../modules/User');
var router = express.Router();
var jwt = require('jsonwebtoken');
var auth = require('../middlewares/auth');
/* GET users listing. */
router.post('/signup', async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password required' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Incorrect password' });
    }
    //generate and send token
    var token = await user.signToken();
    res.status(200).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});
router.get('/protected', auth.verifyToken, (req, res, next) => {
  // console.log(req.user);
  res.status(200).json({ access: 'protected route' });
});
module.exports = router;
