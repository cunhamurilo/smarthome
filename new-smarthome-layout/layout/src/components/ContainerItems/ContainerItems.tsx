import { FormEvent, useState,ReactNode } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import './styles.scss';

type ButtonProps = {
    title: string;
    type: string;
    openSelect?: boolean;
    valueSelect?: string;
    titleSelect?: string;
    defaultSelect?: string;
    arraySelect?: string[];
    openContent?: boolean;
    children?: ReactNode;
    handleSelect:  (event: FormEvent<HTMLSelectElement>) => void ;
    handleClickBtn: (event: FormEvent) => void;
};

export function ContainerItems({ title, type, valueSelect, openSelect = false, titleSelect='', defaultSelect='', arraySelect= [], openContent = false, handleSelect, handleClickBtn, children, ...props }: ButtonProps) {
    const [open, setOpenContent] = useState(openContent)

    function handleClickBtn2(event: FormEvent){
        event.preventDefault();
        const idBtn = event.currentTarget.id
        console.log(idBtn)
        // if(idBtn.split('-')[1] === 'cities')
        //     setOpenContent(!open)
      }

    return (
    <div className="container-item">
        <div className="container-item-header">
            <span>{title}</span>
            <div>
                { openSelect &&
                    <select name={type} id={type} value={valueSelect} onChange={handleSelect} disabled={valueSelect !== defaultSelect ? false: true}>
                        <option value='empty' disabled >{titleSelect}</option>
                        <option value={defaultSelect} disabled hidden>{defaultSelect}</option>
                        <option value='Loading' disabled hidden>Loading</option>
                        {arraySelect.map(( city, index) => {
                        return <option key={index} value={city}>{city}</option>
                        })}
                    </select>
                }
                <div className='option' id={`option-${type}`} onClick={handleClickBtn2}>
                    <FiArrowRight />
                    </div>
                </div>
            </div>
            <div className={open ? 'container-item-content active': 'container-item-content'}>
                {children}
            </div>
        </div>
    )
}