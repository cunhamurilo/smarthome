// import { useEffect } from "react";

import { useAuth } from '../hooks/useAuth';
// import { database } from '../services/firebase';
import { Header } from '../components/Header';

import '../styles/feed.scss';
// import { CityContextProvider } from '../contexts/CityContext';

import { useDevices } from '../hooks/useDevices';
import { useHistory } from 'react-router-dom';

export function Feed() {
    const { user } = useAuth()
    const history = useHistory();

    console.log(user)
    //const { title, devices } = useDevices("São carlos",'xKYUPWAUIFNh3YzvmkJmLp2VbgC2')
    

    return (
      <div id="page-feed">
        <Header name={user?.name} avatar={user?.avatar}>
        </Header>
        {/* <CityContextProvider> */}
          <main>
            { user &&
              <div className="main-content">
              teste
              </div>
            }
          </main>
        {/* </CityContextProvider> */}
      </div>
    )
  }