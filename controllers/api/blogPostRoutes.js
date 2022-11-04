const router = require('express').Router();
const { route } = require('express/lib/application');
const { BlogPost, User } = require('../../models');
const withAuth = require('../../utils/auth');

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
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new blog post --> withAuth makes sure user is logged in, then creates blog post from the content received in req.body
router.post('/create', withAuth, async (req, res) => {
  try {
    const newPost = await BlogPost.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update an existing blog post
router.put('/:id', withAuth, async (req, res)=> {
  try {
    const updatedPost = await BlogPost.update( req.body, {
        where: {
          id: req.params.id
        }
      });
    
    res.status(200).json(updatedPost);
  }catch (err){
    res.status(500).json(err);
  }
});

// Delete an existing blog post
