const router = require('express').Router();
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

//TODO: Display the new-post page
router.get('/new', async (req, res) => {
  try {

    res.render('new-post');

  } catch (err){
    console.error(err);
    res.status(500);
  }
});

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
router.get('/home', withAuth, async (req, res) => {
  // Find all blog posts and include the name from user table
  try {
    const blogData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['name']
        }
      ]
    });

    //Serialize blog post data so the template can read it
    const posts = blogData.map((posts) => posts.get({ plain: true }));

    // Pass serialized data and session flag into home template
    res.render('home', {
      posts,
      logged_in: true
    });

    res.status(200);
  } catch (err){
    res.status(500).json(err);
  }
})

// Dashboard --> view all blog posts created by a certain user
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find all blog posts created by a certain user
    const userData = await BlogPost.findAll({
      where: {
        user_id: req.session.user_id
      }
    });

    //Serialize data
    const users = userData.map((users) => users.get({ plain: true }));

    // Pass data to dashboard template
    res.render('dashboard', {
      users,
      logged_in: true
    });

    res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});

//! trying to add this to home routes
// //TODO: View a certain blog post --> read a certain blog post by the blog post id
router.get('/post/:id'), withAuth, async (req, res) => {
  try {
    const blogData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        }
      ]
    });

    if (!blogData) {
      res.status(404).json({ message: 'There is no blog with this id!' });
      return;
    }

    const blog = blogData.get({ plain: true });

    res.render('blogpost', {
      ...blog,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id
    });

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};


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
