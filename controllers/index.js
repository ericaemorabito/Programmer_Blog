const router = require('express').Router();

// apiRoutes from api folder
const apiRoutes = require('./api');

// homeRoutes use homeRoutes file
const homeRoutes = require('./homeRoutes');

// homeRoutes use '/' path
router.use('/', homeRoutes);

// apiRoutes use '/api' path
router.use('/api', apiRoutes);

module.exports = router;