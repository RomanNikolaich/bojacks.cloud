// Компонент для рендера панели с информацией файла

import { useState, useCallback } from 'react';

import './FileInformation.css';

import { Button } from '../Button/Button';
import { DeleteModal } from '../DeleteModal/DeleteModal';
import { ModalForLoadFile } from '../ModalForLoadFile/ModalForLoadFile';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useFileInfoState, useDontDelAldminState, useUpdateFileInfo, useUpdateFileId, useUserInfoState, useUpdateDontDelAldmin } from '../../store/useStoreStrObjArr';
import { useAuthStore } from '../../store/authStore';
import { useIsDeleteFileState, useIsDeleteFile, useChangeDataFileState, useIsChangeDataFile, useNotChangeDataFile } from '../../store/useStoreFalseToTrue';
import { useFilesStore } from '../../store/useFilesStore';
import { useLangStore } from '../../store/langStore';

const url = import.meta.env.VITE_API_URL;


// Компонент для рендера информации о файле
// Информация берется без запроса на сервер и из выгружанных файлов пользователя

export function FileInformation() {
    const [copied, setCopied] = useState(false); // Для сообщения, когда ссылка скопирована
    const changeDataFile = useChangeDataFileState(); // Получаем состояния для открытия моладки для изменения файлов
    const isChangeDataFile = useIsChangeDataFile(); // Передаем состояния для открытия моладки для изменения файлов
    const notChangeDataFile = useNotChangeDataFile(); // Отменяем состояния для открытия моладки для изменения файлов

    const fetchFiles = useFilesStore((state) => state.fetchFiles); // Запрашивается список файлов пользователя

    const token = useAuthStore((state) => state.token); // Получает токен пользователя
    const user = useAuthStore((state) => state.user); // Получает пользователя

    const deleteFile = useIsDeleteFileState(); // Состояние для открытия модалки
    const isDeleteFile = useIsDeleteFile(); // Передаем состояние для открытия модалки
    const updateFileId = useUpdateFileId(); // Обнуляем объект с данными файла пользователя после удаления

    const getFileInfo = useFileInfoState(); // Получаем объект с данными файла для рендера
    const updateFileInfo = useUpdateFileInfo(); // Получаем объект с данными файла для рендера

    const getUserInfo = useUserInfoState(); // Получаем объект с данными файла для рендера
    const error = useDontDelAldminState(); // Состояние выведения ошибки, что нельзя удалять свой профиль и другого админа
    const setError = useUpdateDontDelAldmin(); // Передаем состояние, что нельзя удалить файлы администратора

    const lang = useLangStore((state) => state.lang); // Состояние языка

    // Меняем формат даты, полученный от сервера
    const formatDate = (isoString) => {
        if (!isoString) return 'Не указано';
        
        return new Date(isoString).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Конструкция для копирования ссылки файла
    const shareableLink = getFileInfo?.special_link ? `${url}/api/files/download/${getFileInfo.special_link}/` : '';

    const handleCopyLink = async () => {
        if (!shareableLink) return;
        await navigator.clipboard.writeText(shareableLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Действие для открытия окна для удаления файла
    const onDelete = async (e) => {
        if (user.is_staff && getUserInfo?.is_staff && user.id !== getUserInfo?.id) {
            setError(lang === 'rus' ? 'Нельзя удалить файла администратора' : 'No se puede eliminar el archivo de administrador');
            setTimeout(() => {
                 setError('');
            }, 2000);
            return;
        }
        isDeleteFile();
    };

    // Действие для скачивания файла
    const onDownload = () => {
        window.open(`${url}/api/files/download/${getFileInfo.special_link}/`, '_blank');
    };

    // Действие для окна для изменения файла
    const onChangeData = () => {
        if (user.is_staff && getUserInfo?.is_staff) {
            setError(lang === 'rus' ? 'Нельзя изменять файла администратора' : 'No se puede modificar el archivo de administrador');
            setTimeout(() => {
                 setError('');
            }, 2000);
            return;
        }
        isChangeDataFile();
        console.log('Событие на onChangeData')
    };

    // Действие для закрытия окна изменения файла
    const handleCloseModal = useCallback(() => {
        notChangeDataFile();
    }, [notChangeDataFile]);

    // Обработчик успешного обновления файла
    const handleFileUpdated = useCallback(() => {
        // Перезагружаем список файлов с сервера
        fetchFiles();
        notChangeDataFile();
    }, [fetchFiles, notChangeDataFile]);

    // Действие для открытия файла для просмотра в браузере
    const onOpenFile = () => {
        window.open(`${url}/api/files/open/${getFileInfo.special_link}/`, '_blank');
    };

    let notDateDownload = lang === 'rus' ? 'Файл пока не скачивался' : 'El archivo aún no se ha descargado'

    // Если нет инфомации для рендера данных файла - то ничего не рендерим
    if (!getFileInfo || Object.keys(getFileInfo).length === 0) {
        return null;
    }
    
    return (
        <div className='information'>
            {user?.is_staff ? 
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Логин пользователя:' : 'Inicio de sesión de usuario:'}</p>
                <p className='from-db'>{getFileInfo.user}</p>
            </div>
            : null}
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Имя файла: ' : 'Nombre de archivo: '}</p>
                <p className='from-db name'>{getFileInfo.name}</p>
            </div>
            <div className='information-brick'>
                <p className='file-information-brick__title'>{lang === 'rus' ? 'Размер: ' : 'Tamaño: '}</p>
                <p className='from-db'>{getFileInfo.size} КБ</p>
            </div>
            <div className='file-information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Комментарий: ' : 'Comentario: '}</p>
                <p className='from-db comment'>{getFileInfo.comment}</p>
            </div>
            <div className='information-brick'>
                <p className='file-information-brick__title'>{lang === 'rus' ? 'Дата загрузки: ' : 'Fecha de carga: '}</p>
                <p className='from-db'>{formatDate(getFileInfo.upload_date)}</p>
            </div>
            <div className='information-brick'>
                <p className='file-information-brick__title'>{lang === 'rus' ? 'Дата последнего скачивания: ' : 'Fecha de la Última descarga: '}</p>
                <p className='from-db'>{getFileInfo.last_download_date ? formatDate(getFileInfo.last_download_date) : notDateDownload}</p>
            </div>
            <div className='information-brick'>
                <p className='information-brick__title'>{lang === 'rus' ? 'Специальная ссылка для скачивания:' : 'Enlace de descarga especial:'}</p>
                <p className='from-db special-link' onClick={handleCopyLink}>{shareableLink}
                    {copied ? <p className='copied'>{lang === 'rus' ? 'Ссылка скопирована' : 'Enlace de descarga especial:'}</p> : null}
                </p>
            </div>
            <div className='buttons-container'>
                <Button 
                    textButton={lang === 'rus' ? btn.buttonDeleteFileText : esp.buttonDeleteFileText} 
                    buttonClass={btn.buttonClassDeleteFile} 
                    type={btn.buttonDeleteFileType} 
                    onAction={onDelete} 
                />
                <Button 
                    textButton={lang === 'rus' ? btn.buttonLoadFileText : esp.buttonLoadFileText} 
                    buttonClass={btn.buttonClassLoadFile} 
                    type={btn.buttonLoadFileType} 
                    onAction={onDownload} 
                />
                <Button 
                    textButton={lang === 'rus' ? btn.buttonChangeDataText : esp.buttonChangeDataText} 
                    buttonClass={btn.buttonChangeDataClass} 
                    type={btn.buttonChangeDataType} 
                    onAction={onChangeData} 
                />
                <Button 
                    textButton={lang === 'rus' ? btn.buttonTextOpenFile : esp.buttonTextOpenFile} 
                    buttonClass={btn.buttonOpenFileClass} 
                    type={btn.buttonOpenFileType} 
                    onAction={onOpenFile} 
                />
            </div>
            {deleteFile ? <DeleteModal 
                            idFile={getFileInfo.id} 
                            text = {lang === 'rus' ? 
                            'Вы действительно хотите удалить файл?' : 
                            '¿Realmente quieres eliminar el archivo?'}
            /> : null}
            {changeDataFile ? 
                <ModalForLoadFile 
                    onClose={handleCloseModal} 
                    token={token} 
                    onUploaded={handleFileUpdated} 
                />
            : null}
            {error ? <div className='information__error'>{error}</div> : null }
        </div>
    )
};
