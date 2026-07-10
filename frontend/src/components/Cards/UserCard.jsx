// Компонент для рендера одного пользователя для администратора

import './Cards.css';
import profileImg from '../../assets/profile.jpg';

import { useUpdateUserId, useUpdateDontDelAldmin } from '../../store/useStoreStrObjArr';


export function UserCard({ userId, userName, userSurname }) {
    const setError = useUpdateDontDelAldmin(); // Передаем состояние выведения ошибки, что нельзя удалять свой профиль и другого админа

    const updateUserId = useUpdateUserId(); // Обновляем ID пользователя

    const onReadUserInfo = () => {
        console.log(`Клик в UserCard: имя файла ${userName} ${userSurname}`)
        updateUserId(userId);
        setError('');
        console.log(typeof userId);
    };
    
    return (
        <div data-user-id={userId} className='file-card' onClick={onReadUserInfo}>
            <img className='file-card__img' src={profileImg} alt='user'/>
            <div className={userName ? 'file-card__name' : 'file-card__admnin' }>{!userName ? 'Админ' : userName} {userSurname}</div>
        </div>
    )
};
