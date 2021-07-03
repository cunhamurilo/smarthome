import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/header.scss';


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
            <p>Smart Home Codelab</p>
            <button className="mdl-button mdl-js-button mdl-button--icon" id='request-sync'>refresh</button>
          </div>
          <div className="user-content">
            <img src={props.avatar} alt="" />
            <span>{props.name}</span>
            <button onClick={handleLogout}>Exit</button>
          </div>
          </div>
    </header>
  )
}