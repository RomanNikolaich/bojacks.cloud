// Компонент для рендера встречающей страницы

import './GreetingPage.css';

import { Button } from '../Button/Button';

import { buttonData as btn } from '../DataForAllApp'
import { esp } from '../EPSDataForAllApp';
import boJack1 from '../../assets/1.jpg';
import boJack2 from '../../assets/2.jpg';
import boJack3 from '../../assets/3.webp';

import { useIsBeginUse, useBeginUseState } from '../../store/useStoreFalseToTrue';
import { useLangStore } from '../../store/langStore';


export function GreetingPage() {

    const beginUse = useBeginUseState(); // Получаем состояния регистрации и входа
    const onBeginUse = useIsBeginUse();  // Передаем состояние для регистрации и входа
    const lang = useLangStore((state) => state.lang); // Состояние языка

    return (
        <div className='greeting-page'>
            <div className='greeting-title'>
                {lang === 'rus' ? 'БоДжек сохранит ваши файлы с безопасности!' : 
                'Bojack mantendrá sus archivos seguros!'}
            </div>
            <div className='greeting-present'>
                <div className='greeting-text'>
                    {lang === 'rus' ? 'Простой и удобный обачный сервис для хранения файлов' : 
                    'Servicio en la nube simple y conveniente para almacenar archivos'}
                </div>
                <img className='greeting-img' src={boJack1} alt='BoJack'/>
                <div className='greeting-text'>
                    {lang === 'rus' ? 'Полностью бесплатный' : 'Totalmente gratis'}
                </div>
                <img className='greeting-img' src={boJack2} alt='BoJack'/>
                <img className='greeting-img' src={boJack3} alt='BoJack'/>
                <div className='greeting-text'>
                    {lang === 'rus' ? '... и безопасный!' : '... ¡y seguro!'}
                </div>
                <Button 
                    type={btn.buttonBeginType} 
                    onAction={onBeginUse} 
                    textButton={lang === 'rus' ? btn.buttonBegin : esp.buttonBegin} 
                    buttonClass={btn.buttonClassBegin} 
                />
                {beginUse ? <div className='greeting-page-explanation'>
                    {lang === 'rus' ? 
                        `Это онлайн-сервис, который позволяет размещать ваши документы, 
                        фотографии, видео и другие данные. Доступ к этим файлам 
                        осуществляется через интернет с любого устройства — ноутбука, планшета, смартфона. 
                        Вы можете просматривать ваши файлы, делиться ссылками для скачивания.`
                     : `Es un Servicio en línea que le permite publicar sus documentos, 
                        fotos, videos y otros datos. Acceso a estos archivos 
                        se realiza a través de Internet desde cualquier dispositivo: 
                        computadora portátil, tableta, Teléfono inteligente. 
                        Puede navegar por sus archivos, compartir enlaces de descarga.`}
                </div> : null}
            </div>
        </div>
    )
};
