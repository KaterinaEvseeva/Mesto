(function () {
  const placesList = document.querySelector('.places-list');
  const openButton = document.querySelector('.user-info__button');
  const editButton = document.querySelector('.user-info__button_edit');
  const closeButton = document.querySelector('.popup__close');
  const closeButtonEdit = document.querySelector('.popup__close_edit');
  const popup = document.querySelector('.popup');
  const form = document.forms.new;
  const editForm = document.forms.edit;
  const popupClosePhoto = document.querySelector('.popup__close_photo');
  const card = new Card();
  const cardCloseImage = new Card(document.querySelector('.popup__close_photo'));
  const popupNewPlace = new Popup(document.querySelector('.popup'));
  const popupEditProfile = new Popup(document.querySelector('.popup__edit-profile'));
  const formValidator = new FormValidator(document.querySelector('.popup__edit-profile'));

  // Можно лучше -- адрес и токен лучше в константы вынести
  const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort9',
    headers: {
      authorization: '1c40e787-d2f1-4812-aa9b-77e6ef33e269',
      'Content-Type': 'application/json'
    }
  });

  api.getInitialCards()
    .then(data => cardList.render(data))
    .catch(err => {
      console.log(`Ошибка: ${err}`);
    });

  const userInfo = new UserInfo(editForm, document.querySelector('.user-info__name'), document.querySelector('.user-info__job'), 
                                document.querySelector('.user-info__photo'), api);
  const cardList = new CardList(placesList, card, form, api, userInfo);

  // Здесь нужно вызывать не метод Api, а метод UserInfo который обратится внутри себя к Api и
  // загрузит данные, сохранит их в переменных класса, выведет их на страницу и пропишет их в инпуты
  // api.getUserInfoFromServer()
  //   .then(data => {
  //     userInfo.updateUserInfo(data);
  //     userInfo.updateUserAvatar(data);
  //     //
  //     // Вызываете несуществующий метод и скрипт не падает только благодаря catch
  //     //
  //    // userInfo.apiGetUserInfo();
  //   })
  //   .catch(err => {
  //     console.log(`Ошибка: ${err}`);
  //   });

  placesList.addEventListener('click', card.like);

  placesList.addEventListener('click', card.remove);

  document.forms.new.addEventListener('submit', (event) => {
    event.preventDefault(event);
    cardList.addCard(event);
    popup.classList.remove('popup_is-opened');
    popupNewPlace.close(popupNewPlace);
    event.target.reset();
  })

  openButton.addEventListener('click', () => {
    popupNewPlace.open();
  });

  closeButton.addEventListener('click', () => {
    popupNewPlace.close();
  });

  editButton.addEventListener('click', () => {
    userInfo.setUserInfo();
    userInfo.userInfoLoad(this.userName, this.userData);
    popupEditProfile.open();
    userInfo.updateUserAvatar.bind(userInfo);
    // Надо исправить -- каждый раз вы при открытии попапа вешает обработчик,
    // достаточно один раз это сделать сразу после инициализации formValidator
    // НЕ ПОНЯЛА, ЧТО ИМЕЕТСЯ ВВИДУ, У МЕНЯ РАЗНЫЕ КНОПКИ openButton и editButton, И Я ИМ ВЕШАЮ ОБРАБОТЧИКОВ

    // Смотрите, каждый раз когда вы нажимаете на кнопку редактирования, вы попадаете в этот коллбэк,
    // где каждый раз вызываете formValidator.setEventListeners(), тогда как для установки слушателей инпутов
    // достаточно вызвать этот метод один раз после строки 16. Вы же вызываете этот метод каждый раз как на кнопку Edit жмем.
  });

  closeButtonEdit.addEventListener('click', () => {
    popupEditProfile.close();
  });

  popupClosePhoto.addEventListener('click', () => {
    cardCloseImage.closeImage();
  })

  document.querySelector('.popup').addEventListener('submit', function (event) {
    if (event.type === 'submit' || event.key === 'Escape') {
      popupNewPlace.close();
    }
  });

  document.querySelector('#edit_form').addEventListener('submit', (event) => {
    event.preventDefault(event);
    formValidator.setEventListeners();
    const userName = event.target.querySelector('#nameValidation').value;
    const userData = event.target.querySelector('.popup__input_type_data').value;
  //  const avatar = event.target.querySelector('.user-info__photo').style.backgroundImage;
    api.updateUserInfoApi(userName, userData)
      .then(data => {
        userInfo.updateUserInfo(data);
       // userInfo.updateUserAvatar(data);
        popupEditProfile.close(popupEditProfile);
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  })
})();
