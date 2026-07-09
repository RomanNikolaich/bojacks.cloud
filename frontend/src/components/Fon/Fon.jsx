// Компонент для обертывания компонента Form

import './Fon.css';

import { Form } from '../Form/Form';

import { formData } from '../DataForAllApp';

import { useIsModalState, useIsFormSignUpState, useIsFormLogInState } from '../../store/useStoreFalseToTrue';

export function Fon({ onCloseSignUpFon }) {
    const isOpen = useIsModalState(); // Состояние для открытия Fon
    const isFormSignUp = useIsFormSignUpState(); // Состояние для рендера формы регистрации
    const isFormLogIn = useIsFormLogInState(); // Состояние для рендера формы входа

    // Если false - то ничего не рендерим
    if (!isOpen) return null;

    return (
        <div className='fon'>
            <Form 
                formClass={isFormSignUp ? formData['sign-up'].formClass : formData['log-in'].formClass} 
                formTitle={isFormSignUp ? formData['sign-up'].formTitle : formData['log-in'].formTitle} 
                onCloseSignUpFon={onCloseSignUpFon} 
                isFormSignUp={isFormSignUp} 
                isFormLogIn={isFormLogIn} 
            />
        </div>
    )
};
