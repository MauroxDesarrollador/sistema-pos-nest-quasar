import * as Yup from 'yup';

// Configurar las traducciones en español
Yup.setLocale({
  mixed: {
    default: 'El campo ${path} es inválido',
    required: 'El campo ${path} es obligatorio',
    oneOf: '${path}, debe ser uno de los siguientes valores: ${values}',
    notOneOf: '${path}, no puede ser uno de los siguientes valores: ${values}',
  },
  string: {
    length: '${path}, debe tener exactamente ${length} caracteres',
    min: '${path}, debe tener al menos ${min} caracteres',
    max: '${path}, debe tener como máximo ${max} caracteres',
    email: 'Ingrese un correo electrónico válido',
    url: 'Ingrese una URL válida',
    trim: 'No debe contener espacios al principio o al final',
    lowercase: 'Debe estar en minúsculas',
    uppercase: 'Debe estar en mayúsculas',
  },
  number: {
    min: 'Debe ser mayor o igual a ${min}',
    max: 'Debe ser menor o igual a ${max}',
    lessThan: 'Debe ser menor que ${less}',
    moreThan: 'Debe ser mayor que ${more}',
    positive: 'Debe ser un número positivo',
    negative: 'Debe ser un número negativo',
    integer: 'Debe ser un número entero',
  },
  date: {
    min: 'Debe ser posterior a ${min}',
    max: 'Debe ser anterior a ${max}',
  },
  array: {
    min: 'Debe tener al menos ${min} elementos',
    max: 'Debe tener como máximo ${max} elementos',
  },
});

export default Yup;