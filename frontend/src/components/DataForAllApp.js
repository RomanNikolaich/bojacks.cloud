// Данные для компонентов

export const labelsData = {
    login: {
        lineText: 'login',
        lineTitle: 'Логин',
        inputClass: 'login',
        name: 'login',
        type: 'text',
        pattern: '^[a-zA-Z][a-zA-Z0-9]{3,19}$',
        placeholder: 'Только латинские буквы и цифры'
    },
    password: {
        lineText: 'password',
        lineTitle: 'Пароль',
        inputClass: 'password',
        name: 'password',
        type: 'password',
        pattern: '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'\\|,.<>/?]).{6,}$',
        placeholder: 'Не менее 6 символов'
    },
    email: {
        lineText: 'email',
        lineTitle: 'Почта',
        inputClass: 'email',
        name: 'email',
        type: 'email',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        placeholder: 'Например: example@email.ru'
    },
    firstName: {
        lineText: 'first_name',
        lineTitle: 'Имя',
        inputClass: 'first_name',
        name: 'first_name',
        type: 'text',
        pattern: false,
        placeholder: 'Например: Иван/Мария'
    },
    lastName: {
        lineText: 'last_name',
        lineTitle: 'Фамилия',
        inputClass: 'last_name',
        name: 'last_name',
        type: 'text',
        pattern: false,
        placeholder: 'Например: Иванов/Иванова'
    },

    fileName: {
        lineText: 'file-name',
        lineTitle: 'Имя файла',
        inputClass: 'file-name',
        name: 'file-name',
        type: 'text',
        pattern: false,
        placeholder: 'Фото'
    },
    fileSize: {
        lineText: 'file-size',
        lineTitle: 'Размер файла',
        inputClass: 'file-size',
        name: 'file-size',
        type: 'text',
        pattern: false,
        placeholder: '20'
    },
};

export const formData = {
    'sign-up': {
        formClass: 'sign-up',
        formTitle: 'Регистрация'
    },
    'log-in': {
        formClass: 'log-in',
        formTitle: 'Вход'
    },
};

export const buttonDataForm = {
    buttonBoxClass: 'button-box',

    buttonTextSignUpInForm: 'Зарегистрироваться',
    buttonClassSignUpInForm: 'button__sign_up__in-form',
    buttonSignUpInFormType: 'submit',

    buttonTextCancel: 'Вернуться на главную',
    buttonCancelbuttonClass: 'button__cancel',
    buttonCancelType: 'button',

    buttonTextLoginpInForm: 'Войти в профиль',
    buttonLogInFormType: 'submit',
    buttonClassLigInInForm: 'button__lig-in__in-form'
};

export const buttonData = {
    buttonBoxClass: 'button-box',

    buttonSignUp: "Регистрация",
    buttonClassSignUp: "button__sign_up",
    buttonSignUpType: 'button',

    buttonLogIn: "Войти",
    buttonClassLogIn: "button__log_in",
    buttonLogInType: 'button',

    buttonLogOutText: "Выйти из профиля",
    buttonClassLogOut: "button__loud-file",
    buttonLogOutType: 'button',

    buttonBegin: "Начать пользоваться",
    buttonClassBegin: "greeting-begin",
    buttonBeginType: 'button',

    buttonClassLoud: 'button__file-container__header',
    buttonTextLoud: 'Загрузить файл',
    buttonTypeLoud: 'button',

    // Кнопки для скачивания, удаления файла, изменения комментария и имени
    buttonDeleteFileText: "Удалить",
    buttonClassDeleteFile: "button__delete-file",
    buttonDeleteFileType: 'button',

    buttonLoadFileText: "Скачать",
    buttonClassLoadFile: "button__download-file",
    buttonLoadFileType: 'button',

    buttonChangeDataText: "Bнести изменения",
    buttonChangeDataClass: "button__change-file",
    buttonChangeDataType: 'button',

    // Кнопка для просмотра файла в браузере
    buttonTextOpenFile: 'Открать файл',
    buttonOpenFileClass: 'button__open-file',
    buttonOpenFileType: 'buttin',


    // Кнопки для изменения файла
    buttonAddFileText: "Добавить файл",
    buttonClassAddFile: "button__add-file",
    buttonAddFileType: 'submit',


    // Кнопка для возврата назад
    buttonTextCancel: 'Вернуться на главную',
    buttonCancelbuttonClass: 'button__cancel',
    buttonCancelType: 'button',


    // Кнопка для загрузки пользователй администратором
    buttonTextGetUsers: 'Загрузить пользователей',
    buttonAdminClass: 'button__admin',
    buttonAdminType: 'button',

    buttonTextAdminFiles: 'Показать файлы пользователей',
    buttonTextAdminAddUser: 'Добавить пользователя',
    buttonTextAdminShowMyFiles: 'Показать свои файлы',


    // Кнопка для изменения данных файлов в модальном окне
    buttonTextChangeFile: 'Изменить данные',
    buttonChangeFileClass: 'button__modal-change-file',
    buttonChangeFileType: 'submit',


};

export const headerData = {
  headerGreetingPage: 'header-greeting-page',
  headerLogOut: 'header-log-out',
};

export const errorMessages = {
  login: { 
    valueMissing: 'Необходимо заполнить логин',
    patternMismatch: 'Логин должен иметь только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов'
  },
  password: { 
    valueMissing: 'Необходимо заполнить пароль',
    patternMismatch: 'Пароль должен иметь не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ'
  },
  email: { 
    valueMissing: 'Необходимо заполнить эл-почту',
    patternMismatch: 'Email имеет некорректную форму'
  },
  'first_name': { 
    valueMissing: 'Необходимо заполнить имя'
  },
  'last_name': { 
    valueMissing: 'Необходимо заполнить фамилию' 
  },
};
