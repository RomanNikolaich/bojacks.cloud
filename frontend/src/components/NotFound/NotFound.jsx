// Компонент для рендера окна для не правильного пути

import './NotFound.css';
import notFound from '../../assets/not-found.jpg';

export function NotFound() {

    return (
        <div className='not-found'>
             <img className='' src={notFound} alt='not-found'/>
        </div>
    )
};
