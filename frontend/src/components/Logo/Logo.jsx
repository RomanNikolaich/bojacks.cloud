// Компонент для рендера логотипа

import './Logo.css';

import logo from '../../assets/logo.png';

export function Logo() {
    return (
        <img className='logo' src={logo} alt='Logo'/>
    )
};
