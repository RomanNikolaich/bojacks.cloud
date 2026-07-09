// Стор для регистрации и входа

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const url = import.meta.env.VITE_API_URL;


export const useLangStore = create(
    persist(
        (set, get) => ({
            lang: 'rus',

            // Меняем на испанский
            langEsp:  () => {
                set({ lang: 'esp' });
            },
            // Меняем на русский
            langRus:  () => {
                set({ lang: 'rus' });
            },
        }),
        {
            name: 'language',
            partialize: (state) => ({ 
                lang: state.lang
            }),
        }
    )
);
