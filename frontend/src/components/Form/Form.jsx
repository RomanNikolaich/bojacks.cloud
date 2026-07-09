// Компонента для рендера формы регистрации и входа

import { useNavigate } from 'react-router';
import './Form.css';

import { LabelForForm } from '../LabelForForm/LabelForForm';
import { Button } from '../Button/Button';

import { labelsData as ld, buttonDataForm as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useAuthFormStore } from '../../store/useFormStore';
import { useAuthStore } from '../../store/authStore';
import { useLangStore } from '../../store/langStore';


export function Form({ isFormSignUp, isFormLogIn, formClass, formTitle, onCloseSignUpFon }) {
    const navigate = useNavigate();
    
    // Из стора формы useFormStore
    const login = useAuthFormStore((state) => state.login);  // Получаем логин пользователя
    const password = useAuthFormStore((state) => state.password); // Получаем парол пользователя
    const email = useAuthFormStore((state) => state.email); // Получаем почту пользователя
    const firstName = useAuthFormStore((state) => state.firstName); // Получаем имени пользователя
    const lastName = useAuthFormStore((state) => state.lastName); // Получаем фамилии пользователя
    
    const loginError = useAuthFormStore((state) => state.loginError); // Получаем ошибку логина пользователя
    const passwordError = useAuthFormStore((state) => state.passwordError); // Получаем ошибку пароля пользователя
    const emailError = useAuthFormStore((state) => state.emailError); // Получаем ошибку почты пользователя
    const firstNameError = useAuthFormStore((state) => state.firstNameError); // Получаем ошибку имени пользователя
    const lastNameError = useAuthFormStore((state) => state.lastNameError); // Получаем ошибку фамилии пользователя
    
    const setField = useAuthFormStore((state) => state.setField);
    const setError = useAuthFormStore((state) => state.setError);
    const setTouched = useAuthFormStore((state) => state.setTouched); // Передаем состояние - был ли уже ввод в поле
    const validateField = useAuthFormStore((state) => state.validateField);
    const validateAll = useAuthFormStore((state) => state.validateAll);
    const resetForm = useAuthFormStore((state) => state.reset);
    
    // Из стора аунтентификации authStore
    const signUp = useAuthStore((state) => state.signUp);
    const logIn = useAuthStore((state) => state.logIn);

    const createUserByAdmin = useAuthStore((state) => state.createUserByAdmin);
    const lang = useLangStore((state) => state.lang); // Состояние языка
    
    // Обработчик изменения поля
    const handleChangeInForm = (e) => {
        const { name, value } = e.target;
        const fieldName = name === 'first_name' 
            ? 'firstName' 
            : name === 'last_name' 
                ? 'lastName' 
                : name;
        
        setField(fieldName, value);
        
        // Получаем состояние был ли уже ввод в поле, для пдальнейших проверок
        const isTouched = useAuthFormStore.getState()[`${fieldName}Touched`];
        if (isTouched) {
            const error = validateField(
                value,
                name === 'login',
                name === 'password',
                name === 'email'
            );
            setError(fieldName, error);
        }
    };

    // Обработчик потери фокуса
    const handleBlur = (e) => {
        const { name, value } = e.target;
        // Изменияем формат ключей имени и фамилии
        const fieldName = name === 'first_name' ? 'firstName' : name === 'last_name' ? 'lastName' : name;
        
        setTouched(fieldName);
        const error = validateField(
            value,
            name === 'login',
            name === 'password',
            name === 'email'
        );
        setError(fieldName, error);
    };

    // Действие отправки формы регистрации
    const onSignUpToServer = async (e) => {
        e.preventDefault();
        
        if (validateAll()) {
            console.log('Form has errors, stopping submission');
            return;
        }

        // Проверяем, кто регистрирует: админ или обычный пользователь
        const currentUser = useAuthStore.getState().user;
        const isAdminCreatingUser = currentUser?.is_staff || currentUser?.is_superuser;

        let result;
        
        if (isAdminCreatingUser) {
            // Админ создаёт пользователя (без автовхода)
            result = await createUserByAdmin({
                username: login,
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
            });
            // Если ошибка на сервере "Forbidden (Origin checking failed - http://localhost:5173 
            // does not match any trusted origins.): /admin/create_user/
            // [07/Jul/2026 15:23:04] "POST /admin/create_user/ HTTP/1.1" 403 2596"
            // То регистрируем пользователя через обычную регистрацию
            if (!result.success) {
                result = await signUp({
                    username: login,
                    email: email,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                });
                console.log('Пользователь создан АДМИНОМ, переход на страницу пользователя');
            }
        } else {
            // Обычная регистрация для обычных пользователей
            result = await signUp({
                username: login,
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
            });
        }

        if (result.success) {
            resetForm();
            onCloseSignUpFon();
            if (isAdminCreatingUser) {
                navigate('/admin');
                console.log('Пользователь создан АДМИНОМ, админ остаётся в админке');
            } else {
                // Обычный пользователь входит в свой профиль
                navigate('/user');
                console.log('Пользователь создан, переход на страницу пользователя');
            }
        console.log('Успешная регистрация');
        } else if (result.fieldErrors) {
            const { email: emailErr, username: loginErr, password: passErr, first_name: fnErr, last_name: lnErr } = result.fieldErrors;
            if (emailErr) setError('email', lang === 'rus' ? 'Пользователь с таким email уже существует' : 'El usuario con este correo electrónico ya existe');
            if (loginErr) setError('login', lang === 'rus' ? 'Пользователь с таким логином уже существует' : 'El usuario con este nombre de usuario ya existe');
            if (passErr) setError('password', passErr[0]);
            if (fnErr) setError('firstName', fnErr[0]);
            if (lnErr) setError('lastName', lnErr[0]);
        }
    };

    // Действие отправки формы входа
    const onLogInToServer = async (e) => {
        e.preventDefault();
        
        // Простая валидация для входа
        if (!login || !password) {
            if (!login) setError('login', lang === 'rus' ? 'Введите логин' : 'Introduzca login');
            if (!password) setError('password', lang === 'rus' ? 'Введите пароль' : 'Introduzca su contraseña');
            return;
        }

        const result = await logIn({
            username: login,
            password: password,
        });

        if (result.success) {
            resetForm();
            //onCloseSignUpFon();

            //  Проверяем роль и редиректим правильно
            if (result.data.user?.is_superuser || result.data.user?.is_staff) {
                navigate('/admin');
                console.log('Вы зашли в профиль администратора');
            } else {
                navigate('/user');
                console.log('Вы зашли в профиль пользователя');
            }
        } else if (result.errorData) {
            setError('login', 'Неверный логин или пароль');
        }
    };

    // Выбираем нужный обработчик в зависимости от типа формы
    const handleSubmit = isFormSignUp ? onSignUpToServer : onLogInToServer;

    return (
        <form className={`form ${formClass}`} onSubmit={handleSubmit} noValidate>
            <h3 className='form-title'>{lang === 'rus' ? formTitle : esp.formTitle}</h3>
            {isFormSignUp && (
                <>
                    <LabelForForm
                        lineText={ld.login.lineText} 
                        lineTitle={lang === 'rus' ? ld.login.lineTitle : esp.loginLineTitle} 
                        inputClass={ld.login.inputClass} 
                        name={ld.login.name} 
                        type={ld.login.type} 
                        pattern={ld.login.pattern} 
                        placeholder={lang === 'rus' ? ld.login.placeholder : esp.loginPlaceholder} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={loginError}
                        value={login}
                    />
                    <LabelForForm
                        lineText={ld.password.lineText} 
                        lineTitle={lang === 'rus' ? ld.password.lineTitle : esp.passwordLineTitle} 
                        inputClass={ld.password.inputClass} 
                        name={ld.password.name} 
                        type={ld.password.type} 
                        pattern={ld.password.pattern} 
                        placeholder={lang === 'rus' ? ld.password.placeholder : esp.passwordPlaceholder} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={passwordError}
                        value={password}
                    />
                    <LabelForForm
                        lineText={ld.email.lineText} 
                        lineTitle={lang === 'rus' ? ld.email.lineTitle : esp.emailLineTitle} 
                        inputClass={ld.email.inputClass} 
                        name={ld.email.name} 
                        type={ld.email.type} 
                        pattern={ld.email.pattern} 
                        placeholder={lang === 'rus' ? ld.email.placeholder : esp.emailPlaceholder} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={emailError}
                        value={email}
                    />
                    <LabelForForm
                        lineText={ld.firstName.lineText} 
                        lineTitle={lang === 'rus' ? ld.firstName.lineTitle : esp.firstNameLineTitle} 
                        inputClass={ld.firstName.inputClass} 
                        name={ld.firstName.name} 
                        type={ld.firstName.type} 
                        pattern={ld.firstName.pattern} 
                        placeholder={lang === 'rus' ? ld.firstName.placeholder : esp.firstNamePlaceholde} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={firstNameError}
                        value={firstName}
                    />
                    <LabelForForm
                        lineText={ld.lastName.lineText} 
                        lineTitle={lang === 'rus' ? ld.lastName.lineTitle : esp.lastNameLineTitle} 
                        inputClass={ld.lastName.inputClass} 
                        name={ld.lastName.name} 
                        type={ld.lastName.type} 
                        pattern={ld.lastName.pattern} 
                        placeholder={lang === 'rus' ? ld.lastName.placeholder : esp.lastNamePlaceholde} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={lastNameError}
                        value={lastName}
                    />
                    <div className={btn.buttonBoxClass}>
                        <Button 
                            type={btn.buttonSignUpInFormType} 
                            textButton={lang === 'rus' ? btn.buttonTextSignUpInForm : esp.buttonTextSignUpInForm} 
                            buttonClass={btn.buttonClassSignUpInForm}  
                        />
                        <Button 
                            type={btn.buttonCancelType} 
                            onAction={onCloseSignUpFon} 
                            textButton={lang === 'rus' ? btn.buttonTextCancel : esp.buttonTextCancel}
                            buttonClass={btn.buttonCancelbuttonClass} 
                        />
                    </div>
                </>
            )}
            {isFormLogIn && (
                <>
                    <LabelForForm
                        lineText={ld.login.lineText} 
                        lineTitle={lang === 'rus' ? ld.login.lineTitle : esp.loginLineTitle} 
                        inputClass={ld.login.inputClass} 
                        name={ld.login.name} 
                        type={ld.login.type} 
                        pattern={ld.login.pattern} 
                        placeholder={lang === 'rus' ? ld.login.placeholder : esp.loginPlaceholder} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={loginError}
                        value={login}
                    />
                    <LabelForForm
                        lineText={ld.password.lineText} 
                        lineTitle={lang === 'rus' ? ld.password.lineTitle : esp.passwordLineTitle} 
                        inputClass={ld.password.inputClass} 
                        name={ld.password.name} 
                        type={ld.password.type} 
                        pattern={ld.password.pattern} 
                        placeholder={lang === 'rus' ? ld.password.placeholder : esp.passwordPlaceholder} 
                        onChangeToForm={handleChangeInForm}
                        onBlur={handleBlur}
                        error={passwordError}
                        value={password}
                    />
                    <div className={btn.buttonBoxClass}>
                        <Button 
                            type={btn.buttonLogInFormType} 
                            textButton={lang === 'rus' ? btn.buttonTextLoginpInForm : esp.buttonTextLoginpInForm}
                            buttonClass={btn.buttonClassLigInInForm} 
                        />
                        <Button 
                            type={btn.buttonCancelType} 
                            onAction={onCloseSignUpFon} 
                            textButton={lang === 'rus' ? btn.buttonTextCancel : esp.buttonTextCancel}
                            buttonClass={btn.buttonCancelbuttonClass} 
                        />
                    </div>
                </>
            )}
        </form>
    );
};
