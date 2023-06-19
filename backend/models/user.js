const mongoose = require('mongoose');
const { isURL, isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [isURL],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail],
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Email или пароль неверный(е)');
    })
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Email или пароль неверный(е)'),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Email или пароль неверный(е)'),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
