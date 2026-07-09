// Компонент для рендера одного файла

import './Cards.css';
import { useUpdateFileId } from '../../store/useStoreStrObjArr';

export function FileCard({ fileSpecialLink, fileName }) {
    const updateFileUnique = useUpdateFileId();

    const onReadFileInfo = () => {
        console.log(`Клик в FileCard: имя файла ${fileName}`)
        updateFileUnique(fileSpecialLink);
    };

    return (
        <div data-id={fileSpecialLink} className='file-card' onClick={onReadFileInfo}>
            <div className='file-card__img'></div>
            <div className='file-card__name'>{fileName}</div>
        </div>
    )
};
