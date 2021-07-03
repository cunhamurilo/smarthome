import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';

import '../styles/feed.scss';
import { useHistory } from 'react-router-dom';
import { useDevices } from '../hooks/useDevices';
import { Card } from '../components/Card/Card';
// import { CityContextProvider } from '../contexts/CityContext';


export function Feed() {
    const { user } = useAuth()
    const history = useHistory();
    
    const isLogged = localStorage.getItem("logged") === 'true'
    if(!isLogged)
      history.push('/auth')

    const { devices } = useDevices({city:"São Carlos",user_id:user?.id} )

    return (
      <div id="page-feed">
        <Header name={user?.name} avatar={user?.avatar}>
        </Header>
        {/* <CityContextProvider> */}
          <main>
            { user &&
              <div className="main-content">
                { devices.map(device => {
                  return <Card  key={device.id} name={device.name} traits={device.traits}  type="" city={device.city} roomHint={device.roomHint} />
                
                } )}
              </div>
            }
          </main>
        {/* </CityContextProvider> */}
      </div>
    )
  }