const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');

const userModel = require('../models/user');
const {
  SECRET_KEY,
  MONGO_DUPLICATE_KEY_ERROR,
  SALT_ROUNDS,
} = require('../utils/constants');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  userModel
    .findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователя с указанным _id не существует');
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  userModel
    .findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Пользователя с указанным _id не существует'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    userModel
      .create({
        name, about, avatar, email, password: hash,
      })
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
          return next(new ConflictError('Попытка создания пользователя с уже существующим email'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Указаны некорректные данные при создании пользователя'));
        }
        return next(err);
      });
  })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      });
      res.send({ _id: token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновленную запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Указаны некорректные данные при обновлении профиля',
        );
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновленную запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Указаны некорректные данные при обновлении аватара',
        );
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
