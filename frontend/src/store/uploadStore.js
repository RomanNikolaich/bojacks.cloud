// Стор для работы с worker

import { create } from 'zustand';
import UploadWorkerConstructor from '../webWorkers/worker?worker';
import { useFilesStore } from './useFilesStore';

// Один worker на всё приложение
let workerInstance = null;


const getWorker = () => {
    if (!workerInstance) {
        workerInstance = new UploadWorkerConstructor();
        
        // Глобальный обработчик ответов
        workerInstance.onmessage = (e) => {
            const { success, data, error } = e.data;
            
            if (success) {
                console.log('Файл загружен:', data);
                // Добавляем файл в глобальный список
                useFilesStore.getState().addFile(data.file);
            } else {
                console.error('Ошибка загрузки:', error);
            }
        };
    }
    return workerInstance;
};

export const useUploadStore = create(() => ({
    // Запускаем загрузку
    uploadFile: ({ file, fullName, comment, userId, token }) => {
        const worker = getWorker();
        
        worker.postMessage({
            file,
            fullName,
            comment,
            userId,
            token,
        });
    },
}));
