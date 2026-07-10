// Компонент для рендера профиля администратора

import { useNavigate, useParams, useLocation, Navigate } from 'react-router';
import { useRef, useCallback, useEffect, useState } from 'react';

import './AdminProfile.css';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';
import profileImg from '../../assets/profile.jpg';

import { Button } from '../Button/Button';
import { UserCard } from '../Cards/UserCard';
import { FileCard } from '../Cards/FileCard';
import { FileInformation } from '../FileUserInformation/FileInformation';
import { UserInformation } from '../FileUserInformation/UserInformation';
import { ModalForLoadFile } from '../ModalForLoadFile/ModalForLoadFile';

import { useAuthStore } from '../../store/authStore';
import { useAddFileStore, useFileIdState, useUserIdState, useUpdateUserInfo, useUpdateFileId, useAdminDontAddFilesState, useUpdateAdminDontAddFiles } from '../../store/useStoreStrObjArr';
import { useFileInfoState, useUpdateFileInfo, useUpdateUserId } from '../../store/useStoreStrObjArr';
import { useAdminNoDelState, useUpdateAdminNoDel } from '../../store/useStoreStrObjArr';
import { useUsersStore } from '../../store/useUsersStore';
import { useFilesStore } from '../../store/useFilesStore';
import { useProfileStore } from '../../store/profileStore';
import { useLangStore } from '../../store/langStore';


const url = import.meta.env.VITE_API_URL;


export function AdminProfile() {
    //const { login } = useParams();           // ← получаем :login из URL
    const location = useLocation();          // ← для проверки пути
    const navigate = useNavigate();
    
    const fileInputRef = useRef(null); // Ref для инпута

    const noDel = useAdminNoDelState();
    const setNoDel = useUpdateAdminNoDel();

    const error = useAdminDontAddFilesState(); // Состояние выведения ошибки, что пользователь со статусом суперпользователя не может добавить файлы
    const setError = useUpdateAdminDontAddFiles(); // Передаем состояние, что пользователь со статусом суперпользователя не может добавить файлы

    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия модалки для добавления файла

    const token = useAuthStore((state) => state.token); // Получает токен пользователя
    const user = useAuthStore((state) => state.user); // Получает пользователя

    const getFileUnique = useFileIdState();  // Для передачи спец.ссылки для рендера информации о файле
    const updateFileInfo = useUpdateFileInfo();  // Для передачи объекта с данными нужного файла для рендера информации
    const getFileInfo = useFileInfoState(); // Получаем объект с данными файла для рендера
    const updateFileId = useUpdateFileId(); // Обнуляем объект с данными файла пользователя после удаления

    const getUserId = useUserIdState();  // Для передачи ID пользователя для вывода информации для админа
    const updateUserInfo = useUpdateUserInfo();  // Для передачи объекта с данными нужного пользователя для рендера информации
    const updateUserId = useUpdateUserId(); // Обнуляем объект с данными пользователя после удаления

    const users = useUsersStore((state) => state.users); // Список пользователей для админа
    const fetchUsers = useUsersStore((state) => state.fetchUsers); // Запрашивается список пользователей администратором
    const clearUsers = useUsersStore((state) => state.clearUsers); // Очищается список пользователей

    const files = useFilesStore((state) => state.files); // Список файлов пользователя
    const fetchAdminFiles = useFilesStore((state) => state.fetchAdminFiles); // Админ запрашивате свои файлы
    const fetchFiles = useFilesStore((state) => state.fetchFiles); // Запрашивается список файлов пользователя
    const clearFiles = useFilesStore((state) => state.clearFiles); // Очищается список пользователей

    const fileChange = useProfileStore((state) => state.handleFileChange); // Хук для получения файла от скрытого инпута
    const onReadOneFileInfo = useProfileStore((state) => state.onReadOneFileInfo); // Передаем значение для updateFileInfo для рендера информации файла
    
    const lang = useLangStore((state) => state.lang); // Состояние языка

    useEffect(() => {
        // Проверяем, заканчивается ли путь на /add_file
        if (location.pathname.endsWith('/add_file')) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false)
        }
    }, [location.pathname]);

    // Действие для передачи клика скрытому инпуту
    const handleFileClick = useCallback(() => {
        if (!user.is_superuser) {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        } else {
            setError((lang === 'rus' ? 
                'Пользователь со статусом суперпользователя не может добавить файлы' 
                : 'Un usuario con estado de superusuario no puede agregar archivos'));
            setTimeout(() => {
                 setError('');
            }, 4000);
        }; // Передаем состояние, что суперпользователь не может добавить файлы
    }, []);
    
    // Действие change для скрытого инпута для добавления файла
    const handleFileChange = useCallback((e) => {
       fileChange(e, navigate);
    }, [user?.username]);

    // Действие для закрытия модального окна
    const handleCloseModal = useCallback(() => {
        useAddFileStore.getState().reset();
        navigate(`/admin`); // возвращаемся на профиль админа
    }, [user?.username]);

    // Действие для обновления списка файлов
    const handleFileUploaded = useCallback((newFile) => {
        useAddFileStore.getState().reset();
        navigate(`/admin`); // возвращаемся на профиль админа
        if (user?.is_staff) {
            setError((lang === 'rus' ? 'Файл загружен' : 'Archivo cargado'));
            setTimeout(() => {
                setError('');
            }, 4000);
        }
    }, [getFileInfo?.id]);
    
    // Передаем значение для updateFileInfo для рендера информации файла
    useEffect(() => {
        onReadOneFileInfo(getFileUnique);
    }, [getFileUnique]);

    // Передаем значение для updateUserInfo для рендера информации пользователя
    useEffect(() => {
        const onReadOneUserInfo = () => {
            let user = users.find((user) => user.id === getUserId);
            if (user) {
                updateUserInfo(user);
            };
            //console.log(user);
        };
        onReadOneUserInfo();
    }, [getUserId, users]);
    
    // Получаем пользователей
    const onGetUsers = useCallback(async () => {
        // Очищаем все перед загрузкой пользователей
        clearUsers(); // Очищаем пользователей
        clearFiles(); // Очищаем файлы
        updateFileId(''); // Очищает информация файла
        updateFileInfo({}); // Очищает ID файла
        updateUserId(''); // Очищает ID пользователя
        updateUserInfo({}); // Очищает информация файла
        
        await fetchUsers();
    }, [fetchUsers, clearFiles, updateFileId, updateFileInfo, updateUserId, updateUserInfo]);

    const onAddUser = useCallback(async () => {
        clearUsers();
        clearFiles();
        updateFileId('');
        updateFileInfo({});
        updateUserId('');
        updateUserInfo({});
        navigate('/admin/signup');  // ✅ Правильный путь!
    }, []);

    // Получем файлы всех пользователей
    const onDownloadFiles = useCallback(async () => {
        // Очищаем все перед загрузкой пользователей
        clearUsers(); // Очищаем пользователей
        clearFiles(); // Очищаем файлы
        updateFileId(''); // Очищает информация файла
        updateFileInfo({}); // Очищает ID файла
        updateUserId(''); // Очищает ID пользователя
        updateUserInfo({}); // Очищает информация файла
        
        await fetchFiles();
        // Получаем АКТУАЛЬНЫЙ список файлов из стора
        const currentError = useFilesStore.getState().error;
        if (currentError) {
            setError(lang === 'rus' ? currentError : 'Los usuarios aún no tienen archivos');
            setTimeout(() => {
                setError('');
            }, 4000);
        }
    }, [fetchFiles, clearUsers, updateFileId, updateFileInfo, updateUserInfo, updateUserId]);

    const onAddMyFiles = useCallback(async () => {
        clearUsers();
        updateFileInfo({});
        updateFileId('');
        await fetchAdminFiles();
        // Показываем ошибку, если она есть
        const currentError = useFilesStore.getState().error;
        if (currentError) {
            setError(lang === 'rus' ? currentError : 'El superusuario no tiene archivos');
            setTimeout(() => {
                setError('');
            }, 4000);
        }
        clearUsers();
        updateFileInfo({});
        updateFileId('');
    }, [fetchAdminFiles, clearUsers, updateFileInfo, updateFileId]);

    // Если логин в URL не совпадает с текущим пользователем — редирект
    useEffect(() => {
        // Если пользователь НЕ админ и НЕ персонал — выкидываем на его профиль
        if (user && !user.is_superuser && !user.is_staff) {
            navigate(`/user/${user.username}`, { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className='admin-profile'>
             <aside className='admin-sidebar'>
                
                <div className='buttons-container'>
                    <Button 
                        textButton={lang === 'rus' ? btn.buttonTextGetUsers : esp.buttonTextGetUsers} 
                        buttonClass={btn.buttonAdminClass} 
                        type={btn.buttonAdminType} 
                        onAction={onGetUsers} 
                    />
                    <Button 
                        textButton={lang === 'rus' ? btn.buttonTextAdminAddUser : esp.buttonTextAdminAddUser} 
                        buttonClass={btn.buttonAdminClass} 
                        type={btn.buttonAdminType} 
                        onAction={onAddUser} 
                    />
                    <Button 
                        textButton={lang === 'rus' ? btn.buttonTextAdminFiles : esp.buttonTextAdminFiles} 
                        buttonClass={btn.buttonAdminClass} 
                        type={btn.buttonAdminType} 
                        onAction={onDownloadFiles} 
                    />
                    <Button 
                        textButton={lang === 'rus' ? btn.buttonTextAdminShowMyFiles : esp.buttonTextAdminShowMyFiles} 
                        buttonClass={btn.buttonAdminClass} 
                        type={btn.buttonAdminType} 
                        onAction={onAddMyFiles} 
                    />
                    {getUserId && users.length != 0 && files.length == 0 ? 
                        <><div>{lang === 'rus' ? 'Информация о пользователе:' : 'Información del usuario:'}</div><UserInformation /></>
                    : null }
                    {getFileUnique && files.length != 0 && users.length == 0 ? 
                        <><div>{lang === 'rus' ? 'Информация о файле пользователе:' : 'Información del archivo del usuario:'}</div><FileInformation /></>
                    : null }
                </div>
                
            </aside>
            <div className='admin-container'>
                <div className='admin-container__header'>
                    <div className='admin-container__header__face-profile'>
                        <img className='profile-img' src={profileImg} alt='user'/>
                        <p className='profile-login'>{user?.username}</p>
                    </div>
                    <h3 className='admin-container__header__title'>{lang === 'rus' ? 'Профиль администратора' : 'Perfil de administrador'}</h3>
                    <div className='admin-container__header__load-file'>
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
                <div className='admin-container__boxes'>
                    {files.length != 0 && users.length == 0? 
                        files.map((file) => <FileCard 
                            fileSpecialLink={file.special_link}
                            key={file.special_link} 
                            fileName={file.name} 
                        />) 
                    : null}
                    {users.length != 0 && files.length == 0 ? 
                        users.map((user) => <UserCard 
                            userId={user.id}
                            userName={user.first_name}
                            key={user.id} 
                            userSurname={user.last_name} 
                        />) 
                    : null}
                    {error ? <div className='admin__error'>{error}</div> : null}
                </div>
            </div>
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
