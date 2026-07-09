// Компонент для рендера страницы пользователя

import { useNavigate, useParams, useLocation, Navigate } from 'react-router';
import { useRef, useCallback, useEffect, useState } from 'react';

import './UserProfile.css';

import { Button } from '../Button/Button';
import { FileCard } from '../Cards/FileCard';
import { FileInformation } from '../FileUserInformation/FileInformation';
import { ModalForLoadFile } from '../ModalForLoadFile/ModalForLoadFile';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useAuthStore } from '../../store/authStore';
import { useAddFileStore, useFileIdState, useUpdateFileId, useFileInfoState, useUpdateFileInfo } from '../../store/useStoreStrObjArr';
import { useFilesStore } from '../../store/useFilesStore';
import { useProfileStore } from '../../store/profileStore';
import { useLangStore } from '../../store/langStore';

const url = import.meta.env.VITE_API_URL;


export function UserProfile() {
    const { login } = useParams(); // Получаем :login из URL
    const location = useLocation(); // Для проверки пути
    const navigate = useNavigate();
    
    const fileInputRef = useRef(null);

    const files = useFilesStore((state) => state.files); // Список файлов пользователя
    const fetchFiles = useFilesStore((state) => state.fetchFiles); // Запрашивается список файлов пользователя

    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия модалки для добавления файла

    const token = useAuthStore((state) => state.token); // Получает токен пользователя
    const user = useAuthStore((state) => state.user); // Получает пользователя

    const getFileUnique = useFileIdState();  // Для передачи спец.ссылки для рендера информации о файле
    const updateFileInfo = useUpdateFileInfo();  // Для передачи объекта с данными нужного файла для рендера информации
    const getFileInfo = useFileInfoState(); // Получаем объект с данными файла для рендера

    const updateFileId = useUpdateFileId(); // Для обнуления состояния ID файла пользователя перед
    const fileChange = useProfileStore((state) => state.handleFileChange); // Хук для получения файла от скрытого инпута
    const onReadOneFileInfo = useProfileStore((state) => state.onReadOneFileInfo); // Передаем значение для updateFileInfo для рендера информации файла

    const lang = useLangStore((state) => state.lang); // Состояние языка

    // Проверка: свой ли это профиль
    const isOwnProfile = user?.username === login;

    useEffect(() => {
        // Проверяем, заканчивается ли путь на /add_file
        if (location.pathname.endsWith('/add_file')) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false)
        }
    }, [location.pathname]);

    // Выносим loadFiles из useEffect
    const loadFiles = useCallback(async () => {
        fetchFiles();
    }, [fetchFiles]);

    // useEffect просто вызывает loadFiles при монтировании и смене token
    useEffect(() => {
        if (token) loadFiles();
    }, [token, loadFiles]);

    // Действие для передачи клика скрытому инпуту
    const handleFileClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        updateFileInfo({});
        updateFileId('');
    }, []);

    // Действие change для скрытого инпута для добавления файла
    const handleFileChange = useCallback((e) => {
       fileChange(e, navigate);
    }, [getFileInfo]);

    // Действие для закрытия модального окна
    const handleCloseModal = useCallback(() => {
        useAddFileStore.getState().reset();
        navigate(`/user/${user.username}`);  // возвращаемся на профиль
    }, [user?.username]);

    // Действие для обновления списка файлов
    const handleFileUploaded = useCallback(() => {
        useAddFileStore.getState().reset();
        navigate(`/user/${user.username}`);
        loadFiles(); // ← перезагружаем список файлов с сервера
    }, [user?.username, loadFiles, navigate]);

    // Передаем значение для updateFileInfo для рендера информации файла
    useEffect(() => {
        onReadOneFileInfo(getFileUnique);
    }, [getFileUnique, files, updateFileInfo, updateFileId]);

    // Если логин в URL не совпадает с текущим пользователем — редирект
    if (user && !isOwnProfile) {
        return <Navigate to={`/user/${user.username}`} replace />;
    };

    // Если это профиль админа, редиректим его в админку
    if (user && (user.is_superuser || user.is_staff)) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className='user-profile'>
            <div className='file-container'>
                <div className='file-container__header'>
                    <div className='file-container__header__face-profile'>
                        <img className='profile-img' src='/src/assets/profile.jpg' alt='user'/>
                        <p className='profile-login'>{user?.username}</p>
                    </div>
                    <h3 className='file-container__header__title'>{lang === 'rus' ? 'Ваши файлы' : 'Sus archivos'}</h3>
                    <div className='file-container__header__load-file'>
                        <input 
                            onChange={handleFileChange} 
                            ref={fileInputRef} 
                            type='file' 
                            className='load-file__input' />
                        <Button 
                            textButton={lang === 'rus' ? btn.buttonTextLoud : esp.buttonTextLoud} 
                            buttonClass={btn.buttonClassLoud} 
                            type={btn.buttonTypeLoud} 
                            onAction={handleFileClick} />
                    </div>
                </div>
                <div className='file-container__boxes'>
                    {files.length != 0 ? 
                        files.map((file) => <FileCard 
                            fileSpecialLink={file.special_link} 
                            key={file.special_link} 
                            fileName={file.name} 
                        />) 
                    : null}
                </div>
            </div>
            <aside className='sidebar'>
               {getFileInfo && Object.keys(getFileInfo).length > 0 ? 
                    <><div>{lang === 'rus' ? 'Информация о файле:' : 'Información del archivo:'}</div><FileInformation /></>
                    : <div>{lang === 'rus' ? 
                        'Кликните на файл, и здесь появится вся информация об этом файле' 
                        : 'Haga clic en el archivo y aquí aparecerá toda la información sobre el archivo'}</div>
                }
            </aside>
            {/* Модалка рендерится поверх */}
            {isModalOpen && (
                <ModalForLoadFile 
                    onClose={handleCloseModal} 
                    token={token} 
                    onUploaded={handleFileUploaded} 
                />
            )}
        </div>
    )
};
