// Стор для передачи состояния true - false

import { create } from 'zustand'

// Общий хук для перехода от false к true и обратно
export const falseToTrueCreate = (set) => ({
    value: false,
    toTrue: () => set({ value: true }),
    toFalse: () => set({ value: false }),
    toggle: () => set((state) => ({ value: !state.value })), // бонус: переключатель
});

// Хук для рендера кнопок регитрации и входа в шапке
export const useBeginUseStore = create(falseToTrueCreate);

export const useBeginUseState = () => useBeginUseStore((state) => state.value);
export const useIsBeginUse = () => useBeginUseStore((state) => state.toTrue);
export const useNotBeginUse = () => useBeginUseStore((state) => state.toFalse);


// Хук для открытия компонента Fon
const useIsFonOpenStore = create(falseToTrueCreate);

export const useIsModalState = () => useIsFonOpenStore((state) => state.value);
export const useIsModelOpen = () => useIsFonOpenStore((state) => state.toTrue);
export const useNotModelOpen = () => useIsFonOpenStore((state) => state.toFalse);


// Хук для рендера кнопки выхода в шапке
const useBeginLogOutStore = create(falseToTrueCreate);

export const useBeginLogOutState = () => useBeginLogOutStore((state) => state.value);
export const useIsBeginLogOut = () => useBeginLogOutStore((state) => state.toTrue);
export const useNotBeginLogOut = () => useBeginLogOutStore((state) => state.toFalse);


// Хук для рендера формы регистрации в компоненте Fon
const useIsFormSignUpStore= create(falseToTrueCreate);

export const useIsFormSignUpState = () => useIsFormSignUpStore((state) => state.value);
export const useIsFormSignUp = () => useIsFormSignUpStore((state) => state.toTrue);
export const useNotFormSignUp = () => useIsFormSignUpStore((state) => state.toFalse);


// Хук для рендера формы регистрации в компоненте Fon
const useIsFormLogInStore = create(falseToTrueCreate);

export const useIsFormLogInState = () => useIsFormLogInStore((state) => state.value);
export const useIsFormLogIn = () => useIsFormLogInStore((state) => state.toTrue);
export const useNotFormLogIn = () => useIsFormLogInStore((state) => state.toFalse);


// Хук для рендера модалки для добавления нового файла
const useIsAddModalFileStore = create(falseToTrueCreate);
export const useIsAddModalFileState = () => useIsAddModalFileStore((state) => state.value);
export const useIsAddModalFile = () => useIsAddModalFileStore((state) => state.toTrue);   // ✅ ИСПРАВЛЕНО!
export const useNotAddModalFile = () => useIsAddModalFileStore((state) => state.toFalse); // ✅ ИСПРАВЛЕНО!

// Хук для рендера модалки для удаления файла
const useIsDeleteFileStore = create(falseToTrueCreate);
export const useIsDeleteFileState = () => useIsDeleteFileStore((state) => state.value);
export const useIsDeleteFile = () => useIsDeleteFileStore((state) => state.toTrue);
export const useNotDeleteFile = () => useIsDeleteFileStore((state) => state.toFalse);


// Хук выделения UserCard при клике на пользователя админом
const useUserReadStore = create(falseToTrueCreate);
export const useUserReadState = () => useUserReadStore((state) => state.value);
export const useIsUserRead = () => useUserReadStore((state) => state.toTrue);
export const useNotUserRead = () => useUserReadStore((state) => state.toFalse);


// Хук для открытия моладки для изменения файлов
const useChangeDataFileStore = create(falseToTrueCreate);
export const useChangeDataFileState = () => useChangeDataFileStore((state) => state.value);
export const useIsChangeDataFile = () => useChangeDataFileStore((state) => state.toTrue);
export const useNotChangeDataFile = () => useChangeDataFileStore((state) => state.toFalse);


// Хук для открытия моладки для администратора для работы с файлами пользователей
const useAdminJobUserFileStore = create(falseToTrueCreate);
export const useAdminJobUserFileState = () => useAdminJobUserFileStore((state) => state.value);
export const useIsAdminJobUserFile = () => useAdminJobUserFileStore((state) => state.toTrue);
export const useNotAdminJobUserFile = () => useAdminJobUserFileStore((state) => state.toFalse);
