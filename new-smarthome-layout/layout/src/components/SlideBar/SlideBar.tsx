import { useState, FormEvent } from "react";

import { ProSidebar} from 'react-pro-sidebar';
import { useHistory, useLocation } from "react-router-dom";

import { FiLogOut, FiHome } from 'react-icons/fi';
import { RiDashboardLine } from 'react-icons/ri';

import './style.scss'

type SlideBarProps = {
    toggled: boolean;
    collapsed: boolean;
    handleToggleSidebar: (value:boolean) => void;
}

export default function SlideBar({ toggled, collapsed, handleToggleSidebar }:SlideBarProps) {
    const history = useHistory();
    const location = useLocation();  
    
    const menus = [ 'Feed', 'Teste']
    const urls = ['/feed','/teste']
    const imgs = [RiDashboardLine,RiDashboardLine]

    // obtem a atual url e configura estado atual do menu 
    function getActualLocation(){
        const indexUrl= urls.findIndex((url) => url.toLowerCase() === location.pathname.toLowerCase())
        if (indexUrl > -1)
            return menus[indexUrl]
        else
            return 'Feed'
    }

    const [menuState, setMenuState] = useState(getActualLocation)

    // verifica qual botao foi clicado e muda de url
    function menuClickButton(event: FormEvent){
        const idMenuItem = event.currentTarget.id

        const indexMenu = menus.findIndex((menu) => menu.toLowerCase() === idMenuItem.toLowerCase())
        if(indexMenu > -1){
            history.push(urls[indexMenu])
            setMenuState(idMenuItem)
        }else{
            if(idMenuItem === 'Logout')
                console.log(idMenuItem)
            else if(idMenuItem === 'Home')
                console.log(idMenuItem)
        }
        handleToggleSidebar(false);
    }

    return (
        <ProSidebar
            breakPoint="lg"
            toggled={toggled}
            collapsed={collapsed}
            onToggle={handleToggleSidebar}
            style={{backgroundColor: 'white'}}
        >
            
            <div className="slide-bar">
                <div className="slide-bar-header">
                    <div className='slide-items' id='Home' onClick={menuClickButton}>
                        <div className="slide-items-header">
                            <div></div>
                        </div>
                        <div className='slide-items-content'>
                            <FiHome size={24} style={{marginLeft: '12px'}}/>
                            <div className={collapsed ? "slide-text collapsed":"slide-text"}>Home</div >
                        </div>
                        <div className="slide-items-footer">
                            <div></div>
                        </div>
                    </div>
                </div>
                <div className="slide-bar-content">
                    { menus.map((item, index) => {
                        
                        const Icon = imgs[index]
                        return (
                            <div className={menuState === item ? 'slide-items current':'slide-items'} key={index} id={item} onClick={menuClickButton}>
                                <div className="slide-items-header">
                                    <div></div>
                                </div>
                                <div className='slide-items-content'>
                                    <Icon size={24} style={{marginLeft: '12px'}} />
                                    <div className={collapsed ? "slide-text collapsed":"slide-text"}>{item}</div >
                                </div>
                                <div className="slide-items-footer">
                                    <div></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="slide-bar-footer">
                    <div className='slide-items' id="Logout" onClick={menuClickButton}>
                        <div className="slide-items-header">
                            <div></div>
                        </div>
                        <div className='slide-items-content'>
                            <FiLogOut size={24} style={{marginLeft: '12px'}}/>
                            <div className={collapsed ? "slide-text collapsed":"slide-text"}>Logout</div >
                        </div>
                        <div className="slide-items-footer">
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </ProSidebar>
    )
}