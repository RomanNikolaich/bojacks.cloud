// Компонент для рендера нужного компонента при изменении пути

import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';

import './CommonCloudTemplate.css';

import { Fon } from "../Fon/Fon";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

import { headerData as hd } from "../DataForAllApp";

import { useNotBeginUse } from '../../store/useStoreFalseToTrue';
import { useIsModelOpen, useNotModelOpen } from '../../store/useStoreFalseToTrue';
import { useIsBeginLogOut, useIsFormSignUp, useNotFormSignUp, useIsFormLogIn, useNotFormLogIn } from '../../store/useStoreFalseToTrue';
import { useAuthFormStore } from '../../store/useFormStore';
import { useAuthStore } from '../../store/authStore';


export function CommonCloudTemplate() {
    const navigate = useNavigate();
    const location = useLocation();

    // Хук для рендера кнопок регитрации и входа в шапке
    const outBeginUse = useNotBeginUse();

    // Хук для рендера компонента Fon
    const onIsModalOpen = useIsModelOpen();
    const onModelClose = useNotModelOpen();

    // Хук для рендера кнопки выхода в шапке
    const onBeginLogOut = useIsBeginLogOut();

    // Хук для рендера формы регистрации
    const onIsFormSignUp = useIsFormSignUp();
    const onIsFormSignUpClose = useNotFormSignUp();

     // Хук для рендера формы входа
    const onIsFormLogIn = useIsFormLogIn();
    const onIsFormLogInClose = useNotFormLogIn();

    const user = useAuthStore((state) => state.user); // Получает пользователя

    // Синхронизация с URL
    useEffect(() => {
        const path = location.pathname;
        // СНАЧАЛА проверяем /admin/signup (более специфичный путь)
        if (path === '/admin/signup') {
            onIsModalOpen();
            onIsFormSignUp();
            onIsFormLogInClose();
        } else if (path === '/signup') {
            onIsModalOpen();
            onIsFormSignUp();
            onIsFormLogInClose();
        } else if (path === '/login') {
            onIsModalOpen();
            onIsFormLogIn();
            onIsFormSignUpClose();
        } else if (path.startsWith('/admin')) {
            onBeginLogOut();
            outBeginUse();
            onModelClose();
        } else if (path.startsWith('/user')) {
            onBeginLogOut();
            outBeginUse();
            onModelClose();
        } else {
            onModelClose();
            onIsFormLogInClose();
            onIsFormSignUpClose();
        }
    }, [location.pathname]);

    // Действие для рендера формы для регистрации
    const toOpenFonSignUp = () => {
        useAuthFormStore.getState().reset();
        navigate('/signup');

    };

    // Действие для рендера формы для входа
    const toOpenFonLogIn = () => {
        useAuthFormStore.getState().reset();
        navigate('/login');
    };

    // Действие для закрытия модалки
    const onCloseFon = () => {
        useAuthFormStore.getState().reset();
        // ✅ ИСПРАВЛЕНО: используем optional chaining
        if (user?.is_staff) {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <Header 
                headerClass={hd.headerGreetingPage} 
                toOpenFonSignUp={toOpenFonSignUp} 
                toOpenFonLogIn={toOpenFonLogIn} 
            />
            <main>
                <Outlet context={{
                    onCloseFon,
                    toOpenFonSignUp,
                    toOpenFonLogIn
                }} />
            </main>
            <Footer />
            <Fon onCloseSignUpFon={onCloseFon} />
        </>
    );
};
