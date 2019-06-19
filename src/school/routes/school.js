var express = require('express');
var controllers = require('../controllers/school');
var router = express.Router();
var logger = require('../../utils/logger');

router.route('/schools').post(controllers.getAllSchoolInfo);

router.route('/schools/:id').get(controllers.getSingleSchoolInfo);

router.route('/schoolFilters').get(controllers.getSchoolFilters);

router.use((req, res, next) => {
    res.statusCode = 404;
    res.send({
        request_path: '/org/v1/',
        message: 'API not found with these values',
        request_host: [
            'community.shikshalokam.org'
        ]
    });
});

router.use((err, req, res, next) => {
    if (err.status === 404) {
        return res.status(400).render('404');
    }

    if (err.status === 500) {
        return res.status(500).render('500');
    }

    next();
});
module.exports = router;