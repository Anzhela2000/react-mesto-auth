import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { useState, useEffect } from 'react';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import EditProfilePopup from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { Routes, Route, Navigate, BrowserRouter, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import Login from "./Login";
import * as auth from '../auth.js';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  function handleLogin(data) {
    setLoggedIn(true);
    setUserEmail(data);
  }

  //Проверка токена

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then((data) => {
          handleLogin(data.data.email);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [])

  //стэйт юзера

  const [currentUser, setCurrentUser] = useState({
    "name": '',
    "about": '',
    "avatar": '',
    "_id": '',
    "cohort": ''
  });

  //стэйты попапов 

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  //лайк и удаление

  function handleCardLike(card) {

    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    });
  }

  function handleCardDelete(card) {

    const isOwn = card.owner._id === currentUser._id;

    api.deleteCard(card._id, !isOwn).then((deletedCard) => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    });
  }

  //обработчики кликов

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (cards) => {
    setSelectedCard(cards);
  }

  //Закрыть попапы

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  //Получение карточек и информации о пользователе

  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUser(), api.getCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards.reverse());
      })
      .catch(err => console.log(err));
  }, []);

  const handleUpdateUser = (data) => {
    api.patchUser(data)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
  }

  const handleUpdateAvatar = (data) => {
    api.changeAvatar(data)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
  }

  //Создать карточку

  const handleAddPlaceSubmit = (name, link) => {
    api.createCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
  }

  return (

    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>

        <Routes>
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />
          <Route path="/" element={
            <ProtectedRoute component={Main} loggedIn={loggedIn} cards={cards}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              userData={userEmail}
            />
          } />

        </Routes>
        <Footer />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onUpdatePlace={handleAddPlaceSubmit} />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>


    </div>

  );
}

export default App;