// Компонент для рендера шапки сайта

import { useNavigate } from 'react-router';

import './Header.css';
import curvedArrow from '../../assets/curved-arrow.png';
import rusImg from '../../assets/rus.png';
import espImg from '../../assets/esp.webp';

import { Logo } from '../Logo/Logo';
import { Button } from '../Button/Button';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useBeginUseState, useIsBeginUse, useBeginLogOutState, useNotBeginLogOut } from '../../store/useStoreFalseToTrue';
import { useUpdateFileInfo, useUpdateFileId, useUpdateUserId, useUpdateUserInfo } from '../../store/useStoreStrObjArr';
import { useAuthStore } from '../../store/authStore';
import { useFilesStore } from '../../store/useFilesStore';
import { useUsersStore } from '../../store/useUsersStore';
import { useLangStore } from '../../store/langStore';


export function Header({ headerClass, toOpenFonLogIn, toOpenFonSignUp }) {
    const beginUse = useBeginUseState(); // Получаем состояния регистрации и входа
    const headerBtnLogOut = useBeginLogOutState();  // Передаем состояние для выхода
    const isBeginUse = useIsBeginUse(); // Изменяем в true состояния регистрации и входа
    const notBeginLogOut = useNotBeginLogOut(); // Изменяем в false состояния регистрации и входа

    const updateFileInfo = useUpdateFileInfo(); // Удаляем информацию файла для рендера перед выходом
    const updateFileId = useUpdateFileId(); // Удаление ID файла перед выходом
    const updateUserId = useUpdateUserId(); // Удаление ID пользователя перед выходом
    const updateUserInfo = useUpdateUserInfo(); // Удаление информацию файла для рендера перед выходом

    const navigate = useNavigate();
    const logOut = useAuthStore((state) => state.logOut); // Получаем действие для выхода из профиля

    const langEsp = useLangStore((state) => state.langEsp); // Меняем язык на испанский
    const langRus = useLangStore((state) => state.langRus); // Меняем язык на русский
    const lang = useLangStore((state) => state.lang); // Состояние языка

    const handleLogOut = () => {
        useUsersStore.getState().clearUsers(); // Отчищаем список пользователей
        useFilesStore.getState().clearFiles(); // Отчищаем список файлов
        updateFileInfo({}); // Отчищаем объект с информацией файла
        updateFileId(''); // Отчищаем ID файла
        updateUserId(''); // Отчищаем ID пользователя
        updateUserInfo({}); // Отчищаем объект с информацией пользователя

        logOut();
        notBeginLogOut();
        isBeginUse();
        console.log('Вы вышли из профиля')
        navigate('/');
    };

    const onChangeLang = () => {
        if (lang === 'rus') {
            langEsp();
            console.log('ESP Переключено на испанский');
        } else if (lang === 'esp') {
            langRus()
            console.log('RUS Переключено на русский');
        }
    };

    return (
        <header className={`header ${headerClass}`}>
            <Logo />
            <div className='change-lang' onClick={onChangeLang}>{lang === 'rus' ? 'Язык интерфейса' : 'Idioma de la interfaz'}
                <div className='change-LNG'>
                {lang === 'rus' ? 'ESP' : 'RUS'}
                    <img className='change-lang__img' src={lang === 'rus' ? espImg : rusImg} alt='lang'/>
                </div>
            </div>
            {/* Если нажато на "Начать полльзоваться" */}
            {beginUse ? 
            <div className='buttons-container'>
                <div className='greeting-begin-next'>{lang === 'rus' ? 'Войдите или зарегистрируйтесь' : esp.beginUse}
                    <img className='greeting-begin-next-img' src={curvedArrow} alt='BoJack'/></div>
                <Button 
                    type={btn.buttonLogInType} 
                    onAction={toOpenFonLogIn} 
                    textButton={lang === 'rus' ? btn.buttonLogIn : esp.buttonLogIn} 
                    buttonClass={btn.buttonClassLogIn} 
                />
                <Button 
                    type={btn.buttonSignUpType} 
                    onAction={toOpenFonSignUp} 
                    textButton={lang === 'rus' ? btn.buttonSignUp : esp.buttonSignUp} 
                    buttonClass={btn.buttonClassSignUp}
                />
            </div> : null}
            {/* Когда прошла аутентификация*/}
            {headerBtnLogOut ? 
                <div className='buttons-container'>
                    <Button 
                        type={btn.buttonLogOutType} 
                        onAction={handleLogOut} 
                        textButton={lang === 'rus' ? btn.buttonLogOutText : esp.buttonLogOutText} 
                        buttonClass={btn.buttonClassLogOut} 
                    />
                </div>
            : null}
        </header>
    )
};
