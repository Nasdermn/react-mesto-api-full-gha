const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/NotFoundError');
const {
  signinValidation,
  signupValidation,
} = require('../middlewares/validate');

router.post('/signup', signupValidation, usersController.createUser);
router.post('/signin', signinValidation, usersController.login);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => next(new NotFoundError('По указанному вами адресу страница не найдена')));

module.exports = router;
