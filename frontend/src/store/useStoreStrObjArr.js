// Стор для передачи состояния через массив, строку либо объект

import { create } from 'zustand'


// Функция, которая создаёт конфигурацию стора для строк
const createStringStore = (initialValue = '') => (set) => ({
    value: initialValue,
    updateValue: (newValue) => set({ value: newValue }),
});


// Функция, которая создаёт конфигурацию стора для объектов
const createObjectStore = (initialValue = {}) => (set) => ({
    value: initialValue,
    updateValue: (newValue) => set({ value: newValue })
});


// Хук для получения информации нужного файла по useFileIdState для рендера в FileInformation
export const useFileInfoStore = create(createObjectStore({}));

export const useFileInfoState = () => useFileInfoStore((state) => state.value);
export const useUpdateFileInfo = () => useFileInfoStore((state) => state.updateValue);


// Хук для получения информации нужного пользователя по useUserIdState для рендера в UserInformation
export const useUserInfoStore = create(createObjectStore({}));

export const useUserInfoState = () => useUserInfoStore((state) => state.value);
export const useUpdateUserInfo = () => useUserInfoStore((state) => state.updateValue);


export const useLoginStore = create(createStringStore(''));

export const useLoginUserState = () => useLoginStore((state) => state.value);
export const useUpdateLoginUser = () => useLoginStore((state) => state.updateValue);


// Хук для передачи индентификатора файла для чтения информации в боковой панели
export const useFileId= create(createStringStore(''));

export const useFileIdState = () => useFileId((state) => state.value);
export const useUpdateFileId = () => useFileId((state) => state.updateValue);


// Хук для передачи индентификатора пользователя для рендера в на странице админа
export const useUserId= create(createStringStore(''));

export const useUserIdState = () => useUserId((state) => state.value);
export const useUpdateUserId = () => useUserId((state) => state.updateValue);


// Хук для запрета удаления своего аккаутна админу
export const useAdminNoDel= create(createStringStore(''));

export const useAdminNoDelState = () => useAdminNoDel((state) => state.value);
export const useUpdateAdminNoDel = () => useAdminNoDel((state) => state.updateValue);


// Хук для сохранения файла после нажатий на "Загрузить файл" для передачи в модальное окно для сохранения
export const useAddFileStore = create((set) => ({
    value: null,
    updateValue: (newValue) => set({ value: newValue }),
    reset: () => set({ value: null }),
}));

export const useAddFileState = () => useAddFileStore((state) => state.value);
export const useUpdateAddFile = () => useAddFileStore((state) => state.updateValue);


// Хук для уведомления админу, что нельза удалять свой профиль и профиль другого админа
export const useDontDelAldminStore= create(createStringStore(''));

export const useDontDelAldminState = () => useDontDelAldminStore((state) => state.value);
export const useUpdateDontDelAldmin = () => useDontDelAldminStore((state) => state.updateValue);


// Хук для уведомления админу, что админ со статусом суперпользователя не может добавить файлы
export const useAdminDontAddFilesStore= create(createStringStore(''));

export const useAdminDontAddFilesState = () => useAdminDontAddFilesStore((state) => state.value);
export const useUpdateAdminDontAddFiles = () => useAdminDontAddFilesStore((state) => state.updateValue);