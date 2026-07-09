// Стор для работы с загрузкой, удаления и обновления пользователей

import { create } from 'zustand';
import { useAuthStore } from './authStore';

const url = import.meta.env.VITE_API_URL;


export const useUsersStore = create((set, get) => ({
    // === СОСТОЯНИЕ ===
    users: [],
    error: null,

    // === ДЕЙСТВИЯ ===
    
    // Загрузка пользователей
    fetchUsers: async () => {
        const token = useAuthStore.getState().token;
        
        if (!token) {
            set({ error: 'Нет токена авторизации' });
            return { success: false };
        }
        
        set({ error: null });
        
        try {
            const response = await fetch(`${url}/api/get_users/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const data = await response.json();
            set({ users: data });
            
            console.log('Пользователи успешно загружены. Используется useUsersStore');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Ошибка загрузки пользователей:', error);
            set({ error: error.message });
            return { success: false, error };
        }
    },

    // Очистка списка
    clearUsers: () => set({ users: [], error: null }),
    
    // Удаление одного пользователя из списка (после DELETE на сервере)
    removeUser: (userId) => set((state) => ({
        users: state.users.filter((u) => u.id !== userId)
    })),
    
    // Обновление одного пользователя (после PATCH на сервере)
    updateUser: (userId, updatedData) => set((state) => ({
        users: state.users.map((u) => u.id === userId ? { ...u, ...updatedData } : u)
    })),
}));
