import { useCallback } from 'react';

import './FileInformation.css';

import { Button } from '../Button/Button';
import { DeleteModal } from '../DeleteModal/DeleteModal';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useUserInfoState, useDontDelAldminState, useUpdateDontDelAldmin } from '../../store/useStoreStrObjArr';
import { useUpdateFileId, useUpdateFileInfo } from '../../store/useStoreStrObjArr';
import { useIsDeleteFileState, useIsDeleteFile } from '../../store/useStoreFalseToTrue';
import { useAuthStore } from '../../store/authStore';
import { useUsersStore } from '../../store/useUsersStore';
import { useFilesStore } from '../../store/useFilesStore';
import { useLangStore } from '../../store/langStore';

const url = import.meta.env.VITE_API_URL;


// Компонент для рендера информации о файле
// Информация берется без запроса на сервер, из выгружанных файлов пользователя

export function UserInformation() {
    const error = useDontDelAldminState(); // Состояние выведения ошибки, что нельзя удалять свой профиль и другого админа
    const setError = useUpdateDontDelAldmin(); // Передаем состояние выведения ошибки, что нельзя удалять свой профиль и другого админа

    const deleteFile = useIsDeleteFileState(); // Состояние для открытия модалки
    const isDeleteFile = useIsDeleteFile(); // Передаем состояние для открытия модалки

    const getUserInfo = useUserInfoState(); // Получаем объект с данными файла для рендера

    const token = useAuthStore((state) => state.token); // Получает токен пользователя
    const user = useAuthStore((state) => state.user); // Получает пользователя

    const updateUser = useUsersStore((state) => state.updateUser); // Запрашивается список пользователей администратором
    const fetchAdminFiles = useFilesStore((state) => state.fetchAdminFiles); // Админ запрашивате свои файлы

    const updateFileInfo = useUpdateFileInfo();  // Для передачи объекта с данными нужного файла для рендера информации
    const updateFileId = useUpdateFileId(); // Обнуляем объект с данными файла пользователя после удаления
    
    const clearUsers = useUsersStore((state) => state.clearUsers);

    const lang = useLangStore((state) => state.lang); // Состояние языка

    // Отправка запроса на сервер для удаления файла
    const onDelete = async (e) => {
        if (user.id === getUserInfo.id) {
            setError(lang === 'rus' ? 'Нельзя удалить свой аккаунт' : 'No se puede eliminar tu cuenta')
            setTimeout(() => {
                 setError('');
            }, 2000);
            return;
        } else if (getUserInfo.is_staff === true) {
            setError(lang === 'rus' ? 'Нельзя удалить аккаунт администратора' : 'No se puede eliminar la cuenta de administrador')
            setTimeout(() => {
                 setError('');
            }, 2000);
            return;
        } else {
            setError('');
            isDeleteFile();
        }
    };

    // Действие для рендера файлов всех пользователей
    const onDownload = useCallback(async () => {
        // Проверка перед отправкой
        if (!getUserInfo.id) {
            console.error('ID пользователя не определён');
            return;
        };
       
        if (getUserInfo.is_superuser) {
            setError(lang === 'rus' ? 'У суперпользователя нет файлов' : 'El superusuario no tiene archivos');
            setTimeout(() => {
                 setError('');
            }, 2000);
        } else {
            console.log(`Загружаем файлы пользователя с ID: ${getUserInfo.id}`);
            try {
                const response = await fetch(`${url}/api/files/get/?user_id=${getUserInfo.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                
                if (response.ok) {
                    const data = await response.json();
                
                    console.log('Количество файлов:', data.length);
                    console.log('Файлы пользователя загружены:', data);
                    if (data.length == 0) {
                        setError(lang === 'rus' ? 'У пользователя пока нет файлов' : 'El usuario aún no tiene archivos');
                        setTimeout(() => {
                            setError('');
                        }, 2000)
                    } else {
                        // Очищаем список пользователей  и файлов перед загрузкой файлов
                        clearUsers();
                        updateFileInfo({});
                        updateFileId('');
                        useFilesStore.setState({ files: data });
                    }
                } else {
                    console.error('❌ Ошибка сервера:', response.status);
                }
            } catch (error) {
                console.error('❌ Ошибка загрузки файлов:', error);
            }
        }
    }, [getUserInfo.id, token, clearUsers, updateFileInfo, updateFileId]);  // Добавили getUserInfo.id и token в зависимости

    // Действие для изменения статуса пользователей
    const onChangeStatusUser = async () => {
        if (user.id === getUserInfo.id) {
            setError(lang === 'rus' ? 'Нельзя поменять свой статус' : 'No puedes cambiar tu estatus');
            setTimeout(() => {
                 setError('');
            }, 2000);
            return;
        } else if (getUserInfo.is_superuser === true) {
            setError(lang === 'rus' ? 'Нельзя поменять статус суперпользователя' : 'No se puede cambiar el estado de superusuario');
            setTimeout(() => {
                 setError('');
            }, 2000);
            return;
        } else {
            setError('');
            let staff = !getUserInfo.is_staff ? true : false
            try {
                const response = await fetch(`${url}/api/change_status/${getUserInfo.id}/`, {
                    method: 'PATCH',
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ is_staff: staff })
                });
                    
                if (response.ok) {
                    const data = await response.json();
                    //console.log(data);
                    setError(lang === 'rus' ? 'Статус пользователя изменен' : 'Estado de usuario cambiado');
                    // Обновляем статус через обновление локального массива
                    updateUser(getUserInfo.id, { is_staff: staff });
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    console.error('Ошибка сервера:', errorData);
                    setError(lang === 'rus' ? 'Ошибка при изменении статуса' : 'Error al cambiar el estado');
                }
                
            } catch (error) {
                console.error('Ошибка загрузки файлов:', error);
            }
        };
    };
    
    let admin = !getUserInfo.is_staff 
        ? (lang === 'rus' ? 'Нет' : 'No') 
        : (lang === 'rus' ? 'Да' : 'Sí');

    let makeAdmin = !getUserInfo.is_staff 
        ? (lang === 'rus' ? 'Назначить администратором' : 'Asignar administrador') 
        : (lang === 'rus' ? 'Сделать пользователем' : 'Hacer usuario');

    // Если нет инфомации для рендера данных пользователя - то ничего не рендерим
    if (!getUserInfo.id) return null;
    
    return (
        <div className='information'>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Имя пользователя:' : 'Nombre de usuario:'}</p>
                <p className='from-db'>{getUserInfo.first_name}</p>
            </div>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Фамилия' : 'Apellido'}</p>
                <p className='from-db'>{getUserInfo.last_name}</p>
            </div>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Логин' : 'Login'}</p>
                <p className='from-db username'>{getUserInfo.username}</p>
            </div>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Почта' : 'Correo'}</p>
                <p className='from-db'>{getUserInfo.email}</p>
            </div>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Количество файлов:' : 'Número de archivos:'}</p>
                <p className='from-db'>{getUserInfo.files_count}</p>
            </div>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Являестя ли админтратором?' : '¿Es administrador?'}</p>
                <p className='from-db'>{admin}</p>
            </div>
            <div className='buttons-container'>
                <Button 
                    textButton={lang === 'rus' ? 'Удалить пользователя' : 'Eliminar usuario'}
                    buttonClass={btn.buttonAdminClass} 
                    type={btn.buttonAdminType} 
                    onAction={onDelete} 
                />
                <Button 
                    textButton={lang === 'rus' ? 'Посмтреть файлы' : 'Ver archivos'}
                    buttonClass={btn.buttonAdminClass} 
                    type={btn.buttonAdminType} 
                    onAction={onDownload} 
                />
                <Button 
                    textButton={makeAdmin}
                    buttonClass={btn.buttonAdminClass} 
                    type={btn.buttonAdminType} 
                    onAction={onChangeStatusUser} 
                />
            </div>
            <div className='information__error'>{error}</div>
            {deleteFile ? <DeleteModal 
                            idUser={getUserInfo.id} 
                            text = {lang === 'rus' ? 
                            'Вы действительно хотите удалить файл?' : 
                            '¿Realmente quieres eliminar el archivo?'} /> 
            : null}
        </div>
    )
};
