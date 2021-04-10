//Using dependencies to gather data from routes
const router = require('express').Router();
const apiRoutes = require('./api');
const mainRoutes = require('./mainRoutes.js');
const tableRoutes = require('./tableRoutes.js');

router.use('/api', apiRoutes);
router.use('/', mainRoutes);
router.use('/table', tableRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;