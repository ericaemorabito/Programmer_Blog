const router = require('express').Router();
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

// Display the welcome page
router.get('/welcome', async (req, res) => {
  try {

    res.render('welcome');

  } catch (err){
    console.error(err);
    res.status(500);
  }
});

// Display the login page
router.get('/login', async (req, res) => {
  try {
    res.render('login');
    
  }catch (err){
    console.error(err);
    res.status(500);
  }
});

// Home page --> view all blog posts, the date created, and the user's name
router.get('/home', async (req, res) => {
  // Find all blog posts and include the name from user table
  try {
    const blogData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    //Serialize blog post data so the template can read it
    const posts = blogData.map((posts) => posts.get({ plain: true }));

    // Pass serialized data and session flag into home template
    res.render('home', {
      posts,
      logged_in: req.session.logged_in
    });

  res.status(200).json(posts); //! line is for testing purposes only
  } catch (err){
    res.status(500).json(err);
  }
})

// Dashboard --> view all blog posts created by a certain user
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find which user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: BlogPost }],
    });

    //Serialize data
    const user = userData.get({ plain: true });

    // Pass data to dashboard template
    res.render('dashboard', {
      ...user,
      logged_in: true
    });

    res.status(200).json(user); //! line is for testing purposes only
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login redirects
// If the users is already logged in -> redirect to home page
// If the users is not logged -> display login page
router.get('/login', (req, res) => {
  if (req.session.logged_in){
    res.redirect('/home');
    return;
  }

  res.render('login')
})

module.exports = router;
