// Компонент для рендера инпута и лейбла

import { useState, useEffect } from 'react';

import './LabelForForm.css';

import { errorMessages } from '../DataForAllApp';
import { esp } from '../EPSDataForAllApp';

import { ComponentsErrores } from '../ComponentsErrores/ComponentsErrores';
import { useLangStore } from '../../store/langStore';


export function LabelForForm({ 
    lineTitle, 
    inputClass, 
    name, 
    type, 
    pattern, 
    placeholder, 
    onChangeToForm,
    onBlur,
    value,
    error: externalError
}) {
  const [localValue, setLocalValue] = useState('');  // Передаем состояние для value
  const [localError, setLocalError] = useState(externalError || ''); // Передаем состояние для jошибок
  const lang = useLangStore((state) => state.lang); // Состояние языка

  // Синхронизация значения поля с внешним значением
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Синхронизация ошибок поля с внешним значением
  useEffect(() => {
    if (externalError !== undefined) {
      setLocalError(externalError);
    }
  }, [externalError]);

  const validate = (inputValue) => {
    // 1. Проверка на пустоту
    if (!inputValue.trim()) {
      let er = lang === 'rus' ? 
        errorMessages[name]?.valueMissing 
        : esp.name?.valueMissing
      return er || lang === 'rus' ? 'Неверный формат' : 'Formato incorrecto';
    }

    // 2. Проверка по паттерну (если он передан)
    if (pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(inputValue)) {
        let er = lang === 'rus' ? 
          errorMessages[name]?.patternMismatch 
          : esp.name?.patternMismatch
        return er || lang === 'rus' ? 'Неверный формат' : 'Formato incorrecto';
      }
    }
    // 3. Всё ок
    return '';
  };

  // Действие для change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChangeToForm) {
      onChangeToForm(e);
    }
  };

  // Действие для blur
  const handleBlur = (e) => {
    const validationError = validate(localValue);
    setLocalError(validationError);
    if (onBlur) {
      onBlur(e, validationError);
    }
  };

  return (
    <label className='line'>
      <h3 className='line__title'>{lineTitle}</h3>
      <input
        className={`line-input ${inputClass}`}
        type={type}
        name={name}
        value={localValue} 
        placeholder={placeholder} 
        onChange={handleChange}
        onBlur={handleBlur}
        required 
      />
      {localError && <ComponentsErrores textError={localError} />}
    </label>
  );
};
