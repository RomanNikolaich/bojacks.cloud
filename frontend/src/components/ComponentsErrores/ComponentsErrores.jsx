// Компонент для рендера ошибок при вводе данных при регистрации и входа

import './ComponentsErrores.css'

import { useLangStore } from '../../store/langStore';


export function ComponentsErrores({ textError }) {
    const lang = useLangStore((state) => state.lang); // Состояние языка
    
    let classEr;
    let noValue = lang === 'rus' ? 'Поле обязательно для заполнения' : 'Campo obligatorio'
    if (textError !== 'Поле обязательно для заполнения') {
        classEr = 'error error-no-wrong-value'
    } else classEr = 'error error-no-value';

    return (
        <div className={classEr}>
            {textError}
        </div>
    )
};
 