// Компонент для рендера модального окня для добавления и изменения файла

import { useCallback, useState, useEffect } from 'react';

import './ModalForLoadFile.css';

import { Button } from '../Button/Button';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useAddFileState, useFileInfoState, useUpdateFileInfo, useUpdateFileId } from '../../store/useStoreStrObjArr';
import { useAuthStore } from '../../store/authStore';
import { useChangeDataFileState, useNotChangeDataFile } from '../../store/useStoreFalseToTrue';
import { useFilesStore } from '../../store/useFilesStore';
import { useUploadStore } from '../../store/uploadStore';
import { useLangStore } from '../../store/langStore';

const url = import.meta.env.VITE_API_URL;


// Вспомогательная функция для извлечения имени и расширения из полного имени файла
const splitFileName = (fullName) => {
    if (!fullName) return { baseName: '', extension: '' };
    
    const lastDotIndex = fullName.lastIndexOf('.');
    
    // Если точки нет или она первая (скрытый файл типа .gitignore)
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return { baseName: fullName, extension: '' };
    }
    
    return {
        baseName: fullName.substring(0, lastDotIndex),
        extension: fullName.substring(lastDotIndex), // включая точку: ".pdf"
    };
};

export function ModalForLoadFile({ token, onClose, onUploaded }) {
    const changeDataFile = useChangeDataFileState(); // Получаем сщстояния для открытия моладки для изменения файлов
    const getFileInfo = useFileInfoState(); // Получаем объект с данными файла для рендера
    const updateFileInfo = useUpdateFileInfo((state) => state.updateUser); // Запрашивается список пользователей администратором
    const updateFileId = useUpdateFileId(); // Обнуляем объект с данными файла пользователя после удаления

    const file = useAddFileState(); // Получаем массив файлов
    const [comment, setComment] = useState('Нет комментария'); // Состояние для передачи комментария
    
    const [fileName, setFileName] = useState(''); // Состояние для изменения оригинального названия файла в инпуте
    const [baseName, setBaseName] = useState('');  // Состояние имени файла без формата
    const [extension, setExtension] = useState(''); // Состояние формата файла

    const user = useAuthStore((state) => state.user);

    const uploadFile = useUploadStore((state) => state.uploadFile);

    const lang = useLangStore((state) => state.lang); // Состояние языка

    // Назначаем fileName значение, переданое при закрузки файла
    useEffect(() => {
        if (file) {
            // При  загрузке нового файла
            const { baseName: bn, extension: ext } = splitFileName(file.name);
            setBaseName(bn);
            setExtension(ext);
            setComment('');
        } else if (getFileInfo && Object.keys(getFileInfo).length > 0) {
            // При редактировании существующего файла
            const { baseName: bn, extension: ext } = splitFileName(getFileInfo.name);
            setBaseName(bn);
            setExtension(ext);
            setComment(getFileInfo.comment);
        } else {
            setBaseName('');
            setExtension('');
            setComment('');
        }
    }, [file, getFileInfo]);

    // Проверяем, что пользователь авторизован
    if (!user?.id) {
        console.error('Пользователь не авторизован');
        return;
    };

    // Действие для change инпута имени файла
    const handleBaseNameChange = (e) => {
        let value = e.target.value;

        const maxLength = 200;
        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        setBaseName(value);
    };

    // Действие для отправки изменения файла на сервер
    const handleChangeFile = useCallback(async (e) => {
        e.preventDefault();
        console.log('Произошел submit в ModalForLoadFile в handleChangeFile')

        const fullName = baseName + extension;

        try {
            const response = await fetch(`${url}/api/files/change/${getFileInfo.id}/`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: fullName, comment: comment })
            });

            console.error('Запрос отправлен');

            if (response.ok) {
                const updatedFile = await response.json();
                onClose();
                // Обновляем файл в локальном списке
                useFilesStore.getState().updateFile(getFileInfo.id, {
                    name: fullName,
                    comment: comment,
                });
                console.log(updatedFile);
                updateFileInfo({});
                updateFileId('');
            }

        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    }, [baseName, extension, comment, token, onClose, onUploaded, getFileInfo, updateFileInfo]);

    // Действие для отправки файла на сервер
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        //console.log('Произошел submit в ModalForLoadFile от имени администратора')
        if (!file) return;

        const fullName = baseName + extension;

        // Отправляем в worker (не ждём ответа!)
        uploadFile({
            file,
            fullName: fullName,
            comment,
            userId: user?.id,
            token,
        });

        // Сразу после закрываем модалку
        onClose();
        
        // Вызываем колбэк (если нужно что-то сделать в родителе)
        if (onUploaded) onUploaded();
        
    }, [file, baseName, extension, comment, user?.id, token, onClose, onUploaded, uploadFile]);

    let titleChange = lang === 'rus' ? 'Изменить файл' : 'Editar archivo';
    let titleAdd = lang === 'rus' ? 'Добавить файл' : 'Añadir archivo';

    // Правильный guard clause
    if (changeDataFile) {
        // Для режима редактирования — нужен getFileInfo
        if (!getFileInfo) return null;
    } else {
        // Для режима загрузки — нужен file
        if (!file) return null;
    }

    return (
        <form className='modal-load-file' onSubmit={changeDataFile ? handleChangeFile : handleSubmit}>
            <div className='modal-load-form'>
                <div className='modal-load-form-title'>{changeDataFile ? titleChange : titleAdd}</div>
                <label className='line'>
                    <h3 className='line__title'>{lang === 'rus' ? 'Имя файла' : 'Nombre de archivo'}</h3>
                    <input className='line-input' value={baseName} onChange={handleBaseNameChange} maxLength={30}/>
                </label>
                <div className='modal-load-form-size'>
                    <p className='size-title'>{lang === 'rus' ? 'Размер:' : 'Tamaño:'}</p>
                    <p className='size-result'>{changeDataFile ? getFileInfo.size : (file.size / 1024).toFixed(1)} КБ</p>
                </div>
                <textarea 
                    className='file-load-textarea' 
                    rows="5" 
                    placeholder={lang === 'rus' ? 'Введите не более 300 символов' : 'Introduzca un máximo de 300 caracteres'}
                    maxLength='300'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                {changeDataFile ? 
                    <div className={btn.buttonBoxClass}>
                        <Button 
                            type={btn.buttonChangeFileType} 
                            textButton={lang === 'rus' ? btn.buttonTextChangeFile : esp.buttonTextChangeFile} 
                            buttonClass={btn.buttonChangeFileClass} 
                        />
                        <Button 
                            type={btn.buttonCancelType} 
                            onAction={onClose} 
                            textButton={lang === 'rus' ? btn.buttonTextCancel : esp.buttonTextCancel} 
                            buttonClass={btn.buttonCancelbuttonClass} 
                        />
                    </div>
                : <div className={btn.buttonBoxClass}>
                    <Button 
                        type={btn.buttonAddFileType} 
                        textButton={btn.buttonAddFileText} 
                        buttonClass={btn.buttonClassAddFile} 
                    />
                    <Button 
                        type={btn.buttonCancelType} 
                        onAction={onClose} 
                        textButton={btn.buttonTextCancel} 
                        buttonClass={btn.buttonCancelbuttonClass} 
                    />
                </div>}
            </div>
        </form>
    );
};