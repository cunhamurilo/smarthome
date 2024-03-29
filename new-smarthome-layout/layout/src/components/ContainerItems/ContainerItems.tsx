import { FormEvent, ReactNode } from 'react';
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
    backgroundContent?: boolean;
    children?: ReactNode;
    handleSelect:  (event: FormEvent<HTMLSelectElement>) => void ;
};

export function ContainerItems({ 
    title, type, valueSelect, 
    openSelect = false, titleSelect='', defaultSelect='', arraySelect= [], 
    openContent = false,  backgroundContent = false,
    handleSelect, children, ...props 
}: ButtonProps) {

    // const [open, setOpenContent] = useState(openContent)

    function handleClickBtn(event: FormEvent){
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
                <div className='option' id={`option-${type}`} onClick={handleClickBtn}>
                    <FiArrowRight />
                    </div>
                </div>
            </div>
            <div className={'container-item-content'} style={{backgroundColor: backgroundContent ? 'white': 'none'}}>
                {children}
            </div>
        </div>
    )
}