import { ButtonHTMLAttributes } from 'react'

import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  
};

export function OptionButton({ ...props }: ButtonProps) {
  return (
    <div className={`option-buttons `} >
        <div> Renomear </div>
        <div> Remover </div>
    </div>
  )
}