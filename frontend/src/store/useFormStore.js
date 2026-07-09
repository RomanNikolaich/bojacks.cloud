// Стор для работы с валидацией формы

import { create } from 'zustand';

import { useLangStore } from './langStore';

import { labelsData as ld } from '../components/DataForAllApp';
import { esp } from '../components/EPSDataForAllApp';


export const useAuthFormStore = create((set, get) => ({
    // === ДАННЫЕ ===
    login: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    
    loginError: '',
    passwordError: '',
    emailError: '',
    firstNameError: '',
    lastNameError: '',
    
    loginTouched: false,
    passwordTouched: false,
    emailTouched: false,
    firstNameTouched: false,
    lastNameTouched: false,

    // === СЕТТЕРЫ ===
    setField: (field, value) => set({ [field]: value }),
    setError: (field, error) => set({ [`${field}Error`]: error }),
    setTouched: (field) => set({ [`${field}Touched`]: true }),

    // === ВАЛИДАЦИЯ ===
    validateField: (val, isLogin, isPassword, isEmail) => {
        const lang = useLangStore.getState().lang;// Состояние языка
        if (!val.trim()) return 'Поле обязательно для заполнения';
        if (isLogin && ld.login.pattern && !new RegExp(ld.login.pattern).test(val)) {
            let res = lang === 'rus' ? 
                'Логин должен иметь только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов' 
                : `El Inicio de sesión debe tener solo letras y números latinos, el primer carácter es una letra, 
                de 4 a 20 caracteres de longitud`;
            return res;
        } else if (isPassword && ld.password.pattern && !new RegExp(ld.password.pattern).test(val)) {
            let res = lang === 'rus' ? 
                'Пароль должен иметь не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ' 
                : `La contraseña debe tener al menos 6 caracteres: al menos una letra mayúscula, un dígito y un carácter especial`;
            return res;
        } else if (isEmail && ld.email.pattern && !new RegExp(ld.email.pattern).test(val)) {
            let res = lang === 'rus' ? 
                'Email имеет некорректную форму' 
                : `El correo electrónico tiene un formulario incorrecto`;
            return res;
        }
        return '';
    },

    validateAll: () => {
        
        const { login, password, email, firstName, lastName, validateField } = get();
        
        const errors = {
            login: validateField(login, true, false, false),
            password: validateField(password, false, true, false),
            email: validateField(email, false, false, true),
            firstName: validateField(firstName, false, false, false),
            lastName: validateField(lastName, false, false, false),
        };

        set({
            loginError: errors.login,
            passwordError: errors.password,
            emailError: errors.email,
            firstNameError: errors.firstName,
            lastNameError: errors.lastName,
            loginTouched: true,
            passwordTouched: true,
            emailTouched: true,
            firstNameTouched: true,
            lastNameTouched: true,
        });

        return Object.values(errors).some(err => err !== '');
    },
    
    // === СБРОС ===
    reset: () => set({
        login: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        loginError: '',
        passwordError: '',
        emailError: '',
        firstNameError: '',
        lastNameError: '',
        loginTouched: false,
        passwordTouched: false,
        emailTouched: false,
        firstNameTouched: false,
        lastNameTouched: false,
    })
}));
