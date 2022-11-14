const router = require('express').Router();
const { User } = require('../../models');

// Test -- see all users
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll()

    res.status(200).json(userData);
  }catch(err){
    console.error(err);
    res.status(500);
  }
});

// Sign up! --> Create a new user
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    req.session.save(() => {
      req.session.id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// Log in! --> Check for user in the database
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email }});

    if (!userData){
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Logout! --> if the user is logged in then destroy the current session/ log them out
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;