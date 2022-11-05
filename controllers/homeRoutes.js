const router = require('express').Router();
const { route } = require('express/lib/application');
const res = require('express/lib/response');
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

// Home page --- view all blog posts, the date created, and the user's name
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

  } catch (err){
    res.status(500).json(err);
  }
})

// if the users is already logged in -> redirect to home page
// if not logged in already, display login page
router.get('/login', (req, res) => {
  if (req.session.logged_in){
    res.redirect('/home');
    return;
  }

  res.render('login')
})

module.exports = router;
