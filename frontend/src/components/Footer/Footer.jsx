// Компонента для рендера footer

import './Footer.css';

import { esp } from '../EPSDataForAllApp';

import { useLangStore } from '../../store/langStore';

export function Footer() {
    
    const lang = useLangStore((state) => state.lang); // Состояние языка

    return (
        <footer className='footer'>
            <div className='footer-box footer__email'>
                <div className='footer-box__el'>{lang === 'rus' ? 'Наша электронная почта' : 'Nuestro correo electrónico'}</div>
                <div className='footer-box__el'>email@email.ru</div>
            </div>
            <div className='footer-box footer__tel'>
                <div className='footer-box__el'>{lang === 'rus' ? 'Наш телефон' : 'Nuestro teléfono'}</div>
                <div className='footer-box__el'>8-800-800-80-80</div>
            </div>
        </footer>
    )
};
