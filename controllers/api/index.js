const router = require('express').Router();

// userRoutes uses the userRoutes file
const userRoutes = require('./userRoutes');

// blogPostRoutes uses the blogPostRoutes file
const blogPostRoutes = require('./blogPostRoutes');

// userRoutes need --> '/api/users/' path
router.use('/users', userRoutes);

// projectRoutes --> '/api/posts' path
router.use('/posts', blogPostRoutes);

module.exports = router;