import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/header.scss';

import { MdRefresh } from 'react-icons/md';

type HeaderProps = {
    avatar: string | undefined;
    name: string | undefined;
    children: ReactNode;
}

export function Header( props:HeaderProps) {
    const history = useHistory();
    const { logout } = useAuth()

    async function handleLogout (){
        await logout()
        localStorage.removeItem('logged')
        history.push('/auth')
    }

    return (
    <header 
      className={`header `}
      {...props}
    >
         <div className="header-content">
          <div className="logo">
            <span>Smart Home Codelab</span>
            <MdRefresh size={28} className="refresh-home"/>
          </div>
          <div className="user-content">
            {
            props.avatar &&
              <>
                <img src={props.avatar} alt="" />
                <span>{props.name}</span>
                <button onClick={handleLogout}>Exit</button>
              </>
            }
          </div>
        </div>
    </header>
  )
}