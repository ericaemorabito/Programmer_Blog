const router = require('express').Router();
const res = require('express/lib/response');
const { BlogPost, User } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a new blog post --> withAuth makes sure user is logged in, then creates blog post from the content received in req.body
router.post('/create', withAuth, async (req, res) => {
  try {
    const newPost = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

//TODO:View a certain blog post --> read a certain blog post by the blog post id
router.get('/:id'), withAuth, async (req, res) => {
  try {
    const blogData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });

    res.render('blogpost', {
      ...blog,
      logged_in: req.session.logged_in
    });

    res.status(200).json(blog) //! testing line only
  } catch (err) {
    res.status(500).json(err);
  }
};

//TODO:Update an existing blog post
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

//TODO:Delete an existing blog post
router.delete('/:id', async (req, res) => {
  try {
    const deletePost = await BlogPost.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!deletePost) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.status(200).json(deletePost);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;