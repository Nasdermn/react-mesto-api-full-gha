const router = require('express').Router();
const cardsController = require('../controllers/cards');
const {
  cardByIdValidation,
  cardValidation,
} = require('../middlewares/validate');

router.get('', cardsController.getCards);

router.post('', cardValidation, cardsController.createCard);

router.delete('/:cardId', cardByIdValidation, cardsController.removeCard);

router.put('/:cardId/likes', cardByIdValidation, cardsController.cardLike);

router.delete(
  '/:cardId/likes',
  cardByIdValidation,
  cardsController.cardDislike,
);

module.exports = router;
