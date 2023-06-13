const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Users List' });
});

module.exports = router;
