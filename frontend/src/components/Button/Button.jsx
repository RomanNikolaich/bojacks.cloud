// Компонент для рендера одной кнопки

import './Button.css';


export function Button({ textButton, buttonClass, type, onAction }) {
    return (
        <button className={`button ${buttonClass}`} type={type} onClick={onAction}>
            {textButton}
        </button>
    )
};
