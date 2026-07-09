// Стор для работы с добавлением, изменением, удалением файлов

import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { useUserInfoStore } from './useStoreStrObjArr';

const url = import.meta.env.VITE_API_URL;


export const useFilesStore = create((set, get) => ({
    // === СОСТОЯНИЕ ===
    files: [],
    error: null,

    // === ДЕЙСТВИЯ ===
    
    // Загрузка файлов пользователя
    fetchFiles: async () => {
        const token = useAuthStore.getState().token;
        
        if (!token) {
            set({ error: 'Нет токена авторизации' });
        }
        
        set({ error: null });
        
        try {
            const response = await fetch(`${url}/api/files/get/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.length === 0) {
                set({ error: 'У пользователей пока нет файлов' });
            }
            set({ files: data });

            
            console.log('Файлы успешно загружены. Используется useFilesStore');
        } catch (error) {
            console.error('Ошибка загрузки файлов:', error);
            set({ error: error.message });
        }
    },

    fetchAdminFiles: async  () => {
        // ✅ Используем getState() вместо хука
        const user = useAuthStore.getState().user;
        const token = useAuthStore.getState().token;
        const getUserInfo = useUserInfoStore.getState().value;

        if (!user.id) {
            console.error('❌ ID пользователя не определён');
            return;
        };
       
        if (user.is_superuser) {
            set({ error: 'У суперпользователя нет файлов' });
        } else {
            console.log(`Загружаем файлы пользователя с ID: ${user.id}`);
            try {
                if (user.is_staff && user.id === getUserInfo?.id) {
                    const response = await fetch(`${url}/api/files/get/?user_id=${user.id}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const data = await response.json();
                    
                        console.log('Количество файлов:', data.length);
                        console.log('Файлы пользователя загружены:', data);
                        if (data.length == 0) {
                            set({ error: 'У вас пока нет файлов' });
                        } else {
                            set({ files: data });
                        }
                } else {
                    console.error('Ошибка сервера:', response.status);
                }
                } else if (user.is_staff && user.id !== getUserInfo?.id) {
                    const response = await fetch(`${url}/api/files/get/?user_id=${user.id}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const data = await response.json();
                    
                        console.log('Количество файлов:', data.length);
                        console.log('Файлы пользователя загружены:', data);
                        if (data.length == 0) {
                            set({ error: 'У вас пока нет файлов' });
                        } else {
                            set({ files: data });
                        }
                    } else {
                        console.error('Ошибка сервера:', response.status);
                    }
                }
                
                if (response.ok) {
                    const data = await response.json();
                
                    console.log('Количество файлов:', data.length);
                    console.log('Файлы пользователя загружены:', data);
                    if (data.length == 0) {
                        set({ error: 'У вас пока нет файлов' });
                    } else {
                        set({ files: data });
                    }
                } else {
                    console.error('Ошибка сервера:', response.status);
                }
            } catch (error) {
                console.error('Ошибка загрузки файлов:', error);
            }
        }
    },
    
    // Очистка списка
    clearFiles: () => set({ files: [], error: null }),
    
    // Удаления файла из списка (обновляем files)
    removeFile: (fileId) => set((state) => ({
        files: state.files.filter((f) => f.id !== fileId)  // ✅ files, а не users
    })),
    
    // Обновление файла в списке (обновляем files)
    updateFile: (fileId, updatedData) => set((state) => ({
        files: state.files.map((f) => 
            f.id === fileId ? { ...f, ...updatedData } : f
        )
    })),

    // Перезагрузить файлы (с учётом currentUserId)
    refreshFiles: async () => {
        const { currentUserId } = get();
        if (currentUserId) {
            await get().fetchUserFiles(currentUserId);
        } else {
            await get().fetchFiles();
        }
    },

    // Для изменения локального списка файлов в worker
    addFile: (newFile) => set((state) => ({
        files: [...state.files, newFile]
    })),
}));
