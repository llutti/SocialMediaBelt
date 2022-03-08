import React, { ForwardedRef, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface Props
{
  name: string;
  label?: string;
  className?: string;
  erros?: FieldError
}

type InputProps = JSX.IntrinsicElements['input'] & Props;


const Input = forwardRef(
  ({ name, label, className, erros, ...rest }: InputProps, ref: ForwardedRef<HTMLDivElement>) =>
  {
    return (
      <div
        ref={ref}
        className="relative z-0 mt-2 w-full group"
      >
        <input
          name={name}
          className={`block p-2 pt-3 w-full text-sm text-gray-900 bg-transparent appearance-none peer border rounded border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 ${className ?? ''}`}
          {...rest}
        />
        {label &&
          <label
            htmlFor={name}
            className="absolute ml-2 px-1 text-gray-500 bg-white duration-300 transition-all transform -translate-y-3 scale-75 top-0 z-1 origin-[0] peer-placeholder-shown:opacity-1 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-3">
            {label}
          </label>}
        {erros?.type === 'required' && <span className='text-red-500 text-xs mt-1 ml-1'>Este Campo é obrigatório</span>}
        {erros?.type !== 'required' && erros?.message && <span className='text-red-500 text-xs mt-1 ml-1'>{erros?.message}</span>}
      </div>
    );
  });

export default Input;
