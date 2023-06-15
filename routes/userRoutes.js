const router = require('express').Router();
const { uploader } = require('../utils/uploadConfig');

const {
  getUsers,
  getAddUser,
  postAddUser,
  getEditUser,
  postEditUser,
  deleteUser,
} = require('../controllers/userControllers');

router.get('/', getUsers);

router
  .route('/add-user')
  .get(getAddUser)
  .post(uploader.single('image'), postAddUser);

router
  .route('/edit-user/:userId')
  .get(getEditUser)
  .post(uploader.single('newImage'), postEditUser);

router.route('/delete-user/:userId').get(deleteUser);

module.exports = router;
