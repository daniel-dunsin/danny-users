const User = require('../models/userModel');
const { uploadToCloud } = require('../utils/uploadConfig');
const fs = require('fs');

module.exports.getUsers = async (req, res, next) => {
  const users = await User.find({});

  res.render('home', { title: 'Users List', users });
};

module.exports.getAddUser = async (req, res, next) => {
  res.render('add-user', { title: 'Add User' });
};

module.exports.postAddUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Verify parameters
    if (!name || !email || !phoneNumber || !req.file.path) {
      req.session.message = {
        message: 'Provide email, name, number and picture',
        type: 'error',
      };

      await fs.unlink(req.file.path, () => {});
      return res.status(400).redirect('add-user');
    }

    // const imageUrl = await uploadToCloud(req.file);

    // Check if a user with that name exists already

    let user = await User.findOne({ email });

    if (!user) {
      await User.create({
        name,
        phoneNumber: Number(phoneNumber),
        email,
        imageUrl: req.file.filename,
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

      await fs.unlink(req.file.path, () => {});

      return res.status(400).redirect('/add-user');
    }
  } catch (error) {
    console.log(error);
    req.session.message = {
      message: 'Unable to add user',
      type: 'error',
    };
    await fs.unlink(req.file.path, () => {});

    return res.status(500).redirect('/add-user');
  }
};

module.exports.getEditUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ _id: userId });

    if (user) {
      return res.status(200).render('edit-user', {
        title: `Edit ${user?.name}'s details`,
        user: user._doc,
      });
    } else {
      req.session.message = {
        message: "User doesn't exist",
        type: 'error',
      };
      res.status(404).redirect('index');
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.postEditUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const { name, email, phoneNumber } = req.body;

    const newImage = req?.file?.filename;

    const user = await User.findById(userId);

    if (newImage) {
      // remove prev image from pc
      await fs.unlink(user?.imageUrl, () => {});
      user.imageUrl = newImage;
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    req.session.message = {
      message: `User details edited successfully`,
      type: 'success',
    };

    res.status(200).redirect('/');
  } catch (error) {
    console.log(error);
    req.session.message = {
      message: 'Unable to edit user',
      type: 'error',
    };

    return res.status(500).redirect('/edit-user');
  }
};

module.exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);

    req.session.message = {
      message: 'User deleted successfully',
      type: 'success',
    };

    res.status(200).redirect('/');
  } catch (error) {
    req.session.message = {
      message: 'Unable to delete user',
      type: 'error',
    };
    return res.status(500).redirect('/');
  }
};
