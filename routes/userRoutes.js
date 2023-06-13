const router = require('express').Router();
const { uploader } = require('../utils/uploadConfig');

const {
  getUsers,
  getAddUser,
  postAddUser,
} = require('../controllers/userControllers');

router.get('/', getUsers);

router
  .route('/add-user')
  .get(getAddUser)
  .post(uploader.single('image'), postAddUser);

module.exports = router;
