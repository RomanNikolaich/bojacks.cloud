// Стор для регистрации и входа

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const url = import.meta.env.VITE_API_URL;


export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,        // access токен (называем 'token' для удобства)
            refreshToken: null, // refresh токен
            error: null,

            isAuthenticated: () => !!get().token,

            // Для регистрации
            signUp: async (formData) => {
                set({ error: null });
                
                try {
                    const response = await fetch(`${url}/api/signup/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        return { success: false, fieldErrors: errorData };
                    }

                    const data = await response.json();
                    console.log('Ответ сервера:', data);
                    
                    // data.access  → в стор как 'token'
                    // data.refresh → в стор как 'refreshToken'
                    set({ 
                        user: data.user, 
                        token: data.access,         
                        refreshToken: data.refresh
                    });
                    
                    console.log('Регистрация прошла успешно, токен сохранён');
                    return { success: true, data };
                } catch (error) {
                    set({ error: error.message });
                    return { success: false, error };
                }
            },

            createUserByAdmin: async (formData) => {
                set({ isLoading: true, error: null });
                
                try {
                    const response = await fetch(`${url}/api/create_user/`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${get().token}`  // ← Токен админа
                        },
                        body: JSON.stringify(formData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        return { success: false, fieldErrors: errorData };
                    }

                    const data = await response.json();
                    set({ isLoading: false });
                    
                    console.log('✅ Пользователь создан админом:', data);
                    return { success: true, data };
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    return { success: false, error };
                }
            },

            // Для входа
            logIn: async (credentials) => {
                set({ error: null });
                
                try {
                    const response = await fetch(`${url}/api/login/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        return { success: false, errorData };
                    }

                    const data = await response.json();
                    
                    // ✅ ТО ЖЕ САМОЕ СОПОСТАВЛЕНИЕ
                    set({ 
                        user: data.user, 
                        token: data.access,         // ← 'token'
                        refreshToken: data.refresh, // ← 'refreshToken'
                        error: null,
                    });

                    console.log('Вы вошли в акаунт');
                    return { success: true, data };
                } catch (error) {
                    set({ 
                        error: 'Нет соединения с сервером. Попробуйте позже.', 
                        });
                    return { success: false };
                }
            },

            // Для рефреша токена
            refreshAccessToken: async () => {
                const { refreshToken } = get();
                if (!refreshToken) {
                    get().logOut();
                    return false;
                }

                try {
                    const response = await fetch(`${url}/api/token/refresh/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    if (!response.ok) {
                        get().logOut();
                        return false;
                    }

                    const data = await response.json();
                    
                    // ✅ И здесь то же сопоставление
                    set({ token: data.access });
                    
                    if (data.refresh) {
                        set({ refreshToken: data.refresh });
                    }
                    
                    return true;
                } catch {
                    get().logOut();
                    return false;
                }
            },

            // Для выхода
            logOut: () => {
                // Очищаем auth-данные
                set({ 
                    user: null, 
                    token: null, 
                    refreshToken: null, 
                    error: null 
                });
                
                console.log('Вы вышли из аккаунта');
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user, 
                token: state.token,           // сохраняем 'token'
                refreshToken: state.refreshToken, // сохраняем 'refreshToken'
            }),
        }
    )
);
