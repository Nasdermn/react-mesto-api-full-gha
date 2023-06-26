import { useEffect, useState } from 'react';
import { Navigate, useNavigate, Route, Routes } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRouteElement from './ProtectedRoute';

import api from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import authApi from '../utils/AuthApi';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [headerEmail, setHeaderEmail] = useState('example@gmail.com');
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const isOpen =
    isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard;
  const navigate = useNavigate();

  useEffect(() => {
    function handleEscapeClose(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeClose);
      return () => {
        document.removeEventListener('keydown', handleEscapeClose);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserProfile(), api.getInitialCards()])
        .then(([user, cards]) => {
          //Отрисовка профиля
          setCurrentUser(user);
          //Отрисовка карточек
          setCards(cards);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  function handleUserRegistration(email, password) {
    authApi
      .registerUser(email, password)
      .then((res) => {
        if (res) {
          setIsInfoTooltipSuccess(true);
          setIsInfoTooltipOpen(true);
          navigate('/signin');
        }
      })
      .catch((error) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipOpen(true);
        console.log(error);
      });
  }

  function handleUserAuthorization(email, password) {
    authApi
      .loginUser(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setHeaderEmail(email);
        setLoggedIn(true);
        navigate('/');
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  function handleToggleHeaderMenu() {
    setIsHeaderMenuOpen(!isHeaderMenuOpen);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(id => id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards(cards.filter((element) => element._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(userData) {
    api
      .patchProfile(userData.name, userData.about)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(userData) {
    api
      .patchAvatar(userData.avatar)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddCard({ name, link }) {
    api
      .postCard({ name, link })
      .then((card) => {
        setCards([...cards, card]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUserExit() {
    localStorage.removeItem('jwt');
    setHeaderEmail('');
    setLoggedIn(false);
    navigate('/signin');
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      authApi
        .tokenCheck(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            navigate('/');
            setHeaderEmail(res.email);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header
            headerEmail={headerEmail}
            onExit={handleUserExit}
            isMenuOpen={isHeaderMenuOpen}
            onToggleMenu={handleToggleHeaderMenu}
          />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRouteElement
                  element={Main}
                  loggedIn={loggedIn}
                  onEditProfile={setIsEditProfilePopupOpen}
                  onAddPlace={setIsAddPlacePopupOpen}
                  onEditAvatar={setIsEditAvatarPopupOpen}
                  onCardClick={setSelectedCard}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
              }
            />

            <Route path="/signup" element={<Register onRegister={handleUserRegistration} />} />

            <Route path="/signin" element={<Login onLogin={handleUserAuthorization} />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}></EditProfilePopup>

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}></EditAvatarPopup>

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCard}></AddPlacePopup>

          <ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>

          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            status={isInfoTooltipSuccess}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
