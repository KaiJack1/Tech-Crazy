//Using dependencies to gather data from the routes section
const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./posted-routes');
const commentRoutes = require('./review-routes');

router.use('/users', userRoutes);
router.use('/posts', postedRoutes);
router.use('/comments', reviewRoutes);

module.exports = router;