const router = require('express').Router();
const usersController = require('../controllers/users');
const {
  userByIdValidation,
  userInfoValidation,
  userAvatarValidation,
} = require('../middlewares/validate');

router.get('', usersController.getUsers);

router.get('/me', usersController.getUser);

router.get('/:id', userByIdValidation, usersController.getUserById);

router.patch('/me', userInfoValidation, usersController.updateUser);

router.patch('/me/avatar', userAvatarValidation, usersController.updateAvatar);

module.exports = router;
