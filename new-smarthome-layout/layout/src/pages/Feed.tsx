import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';

import { useDevices } from '../hooks/useDevices';
import { Card } from '../components/Card/Card';
import { ModalComponent } from '../components/Modal/Modal';
import { useState } from 'react';
// import { CityContextProvider } from '../contexts/CityContext';

import { Dashboard } from '../components/Dashboard/Dashboard';

import '../styles/feed.scss';

interface DeviceType {
  id: string;
  city: string | undefined;
  name: string;
  roomHint: string | "";
  traits: {
    OnOff?: {on:boolean};
    Brightness?: {brightness:number};
    ArmDisarm?: {isArmed:boolean};
  };
  type: string;
}

export function Feed() {
    const { user } = useAuth()
    
    const [modal, setModal] = useState({ "open":false, "title": "", fields: [{ type:"input", value:""}], item:"", type:"", value:"" });

    console.log('feed', user)
    
    let cities = localStorage.getItem("cities")
    let sub_menu = [] as string[]
    let actual = ""
    if(cities === null)
      cities =  `{ "actual": "No city", "cities":[] }`
    
    let json = JSON.parse(cities)
    sub_menu = json.cities
    sub_menu.push("Add new City")
    actual = json.actual
    
    if(actual !== "No city"){ 
      sub_menu.push("Remove City")
    }

    const { devices } = useDevices({city:actual,user_id:user?.id} )

    function closeModal() {
      setModal({ "open":false, "title": "", item:"", type:"", fields: [{ type:"input", value:""}], value:""});
    }
  
    function groupByRoom() {
      // divide os dispostivos em grupos
      let groups = devices.reduce( (r,a) => {
        r[a.roomHint] = [...r[a.roomHint] || [], a];
        return r;
      } , {} as any)
      return groups
    }


    return (
      <div id="page-feed">
        <Header name={user?.name} avatar={user?.avatar}>
        </Header>
        {/* <CityContextProvider> */}
          <main>
            <Dashboard actual={actual} setModal={setModal} sub_menu={sub_menu}/>
            { user &&
              <div className="main-content">
                { 
                  Object.entries(groupByRoom()).map(([key,group],index) => {
                    return (
                      <div key={index} className='card-list'>
                        <div className="card-list-title">{key === "" ? "Assign device to a room":key}</div>
                        <div className="card-list-devices">
                        {
                          Object.values(group as DeviceType).map((device) => {
                            return <Card key={device.id} path={`/users/${user.id}/devices/${device.id}`} name={device.name} traits={device.traits}  type={device.type} city={device.city} roomHint={device.roomHint} setModal={setModal}/>
                          })
                        }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            }
            <ModalComponent open={modal.open} title={modal.title} closeModal={closeModal} fields={modal.fields} item={modal.item} type={modal.type} value={modal.value}/>
          </main>
        {/* </CityContextProvider> */}
      </div>
    )
  }