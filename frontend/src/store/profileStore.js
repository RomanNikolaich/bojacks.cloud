// Стор для функций обрато

import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { useFilesStore } from './useFilesStore';
import { useFileInfoStore, useAddFileStore } from './useStoreStrObjArr';

const url = import.meta.env.VITE_API_URL;


export const useProfileStore = create((set, get) => ({
    // === СОСТОЯНИЕ ===
    error: null,

    // === ДЕЙСТВИЯ ===

    // Действие change для скрытого инпута для добавления файла
    handleFileChange: (e, navigate) => {
        const user = useAuthStore.getState().user;
        const token = useAuthStore.getState().token;
        //const getUserInfo = useUserInfoStore.getState().value;

        const file = e.target.files[0];
        if (!file) return;
                
        // Сохраняем файл в Zustand и переходим на /user/:login/add_file
        useAddFileStore.getState().updateValue(file);
        if (user.is_staff) {
            navigate(`/admin/add_file`);
        } else {
            navigate(`/user/${user.username}/add_file`);
        }
        // Сбрасываем input
        e.target.value = '';
    },

    // Передаем значение для updateFileInfo для рендера информации файла
    onReadOneFileInfo: (getFileUnique) => {
        const files = useFilesStore.getState().files;

        if (!getFileUnique) return;

        let file = files.find((file) => file.special_link === getFileUnique);
        if (file) {
            useFileInfoStore.getState().updateValue(file);
        } else {
            // Очищаем, если файл не найден
            useFileInfoStore.getState().updateValue({});
        }
    },

}));
