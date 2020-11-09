var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Green Light Sim' });
});

router.get('/test', function(req, res, next) {
	res.render('index', {title: 'Test test'});
});

module.exports = router;
