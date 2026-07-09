// Компонент для рендера окна для удаления файла и пользователя

import './DeleteFileModal.css';
import '../ModalForLoadFile/ModalForLoadFile.css';

import { Button } from '../Button/Button';

import { buttonData as btn } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { useAuthStore } from '../../store/authStore';
import { useNotDeleteFile } from '../../store/useStoreFalseToTrue';
import { useUpdateFileInfo, useUpdateFileId, useUpdateUserId, useUpdateUserInfo } from '../../store/useStoreStrObjArr';
import { useUsersStore } from '../../store/useUsersStore';
import { useFilesStore } from '../../store/useFilesStore';
import { useLangStore } from '../../store/langStore';

const url = import.meta.env.VITE_API_URL;


export function DeleteModal({ idFile, text, idUser }) {
    const updateFileInfo = useUpdateFileInfo(); // Получаем объект с данными файла для рендера
    const updateFileId = useUpdateFileId(); // Удаление ID файла

    const updateUserId = useUpdateUserId(); // Обнуляем объект с данными пользователя после удаления
    const updateUserInfo = useUpdateUserInfo(); // Обнуляем ID пользователя после удаления
    const notDeleteFile = useNotDeleteFile(); // Передаем состояние для закрытия модалки

    const user = useAuthStore((state) => state.user); // Получает пользователя
    const token = useAuthStore((state) => state.token); // Получаем токен пользователя
    const removeUser = useUsersStore((state) => state.removeUser); // Удаляем пользователя из users в useAuthStore при удалении 
    const removeFile = useFilesStore((state) => state.removeFile); // Удаляем пользователя из files в useFilesStore при удалении 

    const lang = useLangStore((state) => state.lang); // Состояние языка

    // Действие для удаления файла
    const onDeleteFile = async (e) => {
        try {
            const response = await fetch(`${url}/api/files/delete/${idFile}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Удаляем файл из локального массива
                removeFile(idFile);
                // Очищаем ID файла (специальную ссылку) и объект с информацией файла
            updateFileInfo({});
            updateFileId(''); 
                console.log('Файл удален');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }

        // Закрываем онко удаления
        notDeleteFile();
    };

    // Действие для удаления пользователя
    const onDeleteUser = async (e) => {
        try {
            const response = await fetch(`${url}/api/delete_users/${idUser}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Удаляем пользователя из локального массива
                removeUser(idUser);
                console.log('Пользователь удален');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
        // Очищаем ID пользовтаеля и объект с информацией файла
        updateUserInfo({});
        updateUserId(''); 
        notDeleteFile();
    };

    // Действие для закрытия окна удаления
    const onClose = () => {
        notDeleteFile();
    };

    return (
        <div className='modal-load-file delete-fon'>
            <div className='delete-form modal-load-form'>
                <div className='modal-load-form-title delete-title'>{text}</div>
                <div className={btn.buttonBoxClass}>
                    <Button 
                        type={btn.buttonAddFileType} 
                        textButton={lang === 'rus' ? 'Удалить' : 'Eliminar'}
                        buttonClass={btn.buttonClassAddFile} 
                        onAction={idFile ? onDeleteFile : onDeleteUser} 
                    />
                    <Button 
                        type={btn.buttonCancelType} 
                        onAction={onClose} 
                        textButton={lang === 'rus' ? btn.buttonTextCancel : esp.buttonTextCancel}
                        buttonClass={btn.buttonCancelbuttonClass} 
                    />
                </div>
            </div>
        </div>
    )
};
