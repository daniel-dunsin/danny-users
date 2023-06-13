const router = require('express').Router();
const { uploader, uploadToCloud } = require('../utils/uploadConfig');
const User = require('../models/userModel');

router.get('/', (req, res, next) => {
  res.render('home', { title: 'Users List' });
});

router
  .route('/add-user')
  .get((req, res, next) => {
    res.render('add-user', { title: 'Add User' });
  })
  .post(uploader.single('image'), async (req, res, next) => {
    try {
      const { name, email, phoneNumber } = req.body;

      // Verify parameters
      if (!name || !email || !phoneNumber || !req.file.path) {
        req.session.message = {
          message: 'Provide email, name, number and picture',
          type: 'error',
        };
        return res.status(400).redirect('add-user');
      }

      const imageUrl = await uploadToCloud(req.file.path);

      // Check if a user with that name exists already

      let user = await User.findOne({ email });

      if (!user) {
        await User.create({
          name,
          phoneNumber: Number(phoneNumber),
          email,
          imageUrl,
        });

        req.session.message = {
          message: 'User created successfully',
          type: 'success',
        };

        return res.status(201).redirect('/');
      } else {
        // Return error if user with the email exists
        req.session.message = {
          message: 'A user with this email already exists',
          type: 'error',
        };

        return res.status(400).redirect('/add-user');
      }
    } catch (error) {
      console.log(error);
      req.session.message = {
        message: 'Unable to add user',
        type: 'error',
      };
      return res.status(500).redirect('/add-user');
    }
  });

module.exports = router;
