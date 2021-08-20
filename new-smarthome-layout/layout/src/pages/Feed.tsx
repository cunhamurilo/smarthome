import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

import { useDevices } from '../hooks/useDevices';
import { useCity } from '../hooks/useCity';
import { useWeather } from '../hooks/useWeather';
// import { Card } from '../components/Card/Card';
// import { ModalComponent } from '../components/Modal/Modal';
// import { OptionButton } from '../components/OptionButton/OptionButton';
import { ContainerItems } from '../components/ContainerItems/ContainerItems';
// import { CityContextProvider } from '../contexts/CityContext';

// import { Dashboard } from '../components/Dashboard/Dashboard';

import { FiSettings } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';

import '../styles/feed.scss';

// interface DeviceType {
//   id: string;
//   city: string | undefined;
//   name: string;
//   roomHint: string | "";
//   traits: {
//     OnOff?: {on:boolean};
//     Brightness?: {brightness:number};
//     ArmDisarm?: {isArmed:boolean};
//   };
//   type: string;
// }

type FeedProps = {
  handleToggleSidebar: (value:boolean) => void;
}

export function Feed({ handleToggleSidebar }:FeedProps) {
    const { user } = useAuth()
    
    // const [modal, setModal] = useState({ "open":false, "title": "", fields: [{ type:"input", value:""}], item:"", type:"", value:"" });
    const [search, setSearch] = useState('')

    const { cities } = useCity({user_id:user?.id})

    const [actualCity, setActualCity] = useState('Loading')

    // check data from firebase database fro city
    if(cities.length > 0){
      if(cities[0].city !== ''){
        // get from localstatorage
        const city = localStorage.getItem('actual_city')
        let json = JSON.parse(city+'')

        // check if not exists data
        if(json === 'No city' || json === null){
          json = cities[0].city + ""
        }
        // update if city if diferent
        if(actualCity !== json){
          localStorage.setItem('actual_city', `"${json}"`)
          setActualCity(json)
        }
        
      }else {
        // set no city if dont return data from database
        localStorage.setItem('actual_city', `"No city"`)
        if(actualCity !== 'No city'){
          localStorage.setItem('actual_city', `"No city"`)
          setActualCity('No city')
        }
      }
    }

    const { devices, getDevicesByRooms } = useDevices({city:actualCity,user_id:user?.id} )
    const { weather } = useWeather({city:actualCity})

    // function closeModal() {
    //   setModal({ "open":false, "title": "", item:"", type:"", fields: [{ type:"input", value:""}], value:""});
    // }
  
    // function groupByRoom() {
      // divide os dispostivos em grupos
      // let groups = devices.reduce( (r,a) => {
      //   r[a.roomHint] = [...r[a.roomHint] || [], a];
      //   return r;
      // } , {} as any)
      // return groups
    // }

    function handleSelect(event: FormEvent<HTMLSelectElement>) {
      event.preventDefault();

      console.log(event.currentTarget.value)
      localStorage.setItem('actual_city',`"${event.currentTarget.value}"`)
      
      setActualCity(event.currentTarget.value)
    }

    function handleClickBtn(event: FormEvent){
      event.preventDefault();
      const idBtn = event.currentTarget.id
      console.log(idBtn)

      if(idBtn[0] === 'actualCity'){

      }

    }

    return (
      <div id="page-feed">
        
        <header>
          <div className="toggle">     
            <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
              <FaBars />
            </div>
          </div>
          <div className="search">
            <input type="search" placeholder="Buscar" onChange={(e:FormEvent<HTMLInputElement>) => { setSearch(e.currentTarget.value) } }/>
          </div>
          <div className="user-info">
            <div className='settings'> <FiSettings className='icon-setttings'/> </div>
            <div className='user-image'>
              <img src={user?.avatar} alt='userimage'/>
            </div>
            <div className='user-name'>{user?.name}</div>
          </div>
        </header>
        <div className='main'>
          <div className='central'>
            <div className='resume'>
              Resumo
            </div>
            <div className='title'>
              <span>{user?.name}'s Home</span>
              <select name="room" id="room">
                {
                  Object.entries(getDevicesByRooms()).map(([key,group],index) => {
                    return <option key={index} value={key}>{key === '' ? 'No room': key }</option>
                  })
                }

              </select>
            </div>
            <div className="main-device">teste</div>
            <div className="devices">
              <div>1</div>
              <div>2</div>
            </div>
          </div>
          <div className='right'>
            <ContainerItems 
              title={'City:'}
              type={'cities'} 
              valueSelect={actualCity} 
              openSelect={true} 
              titleSelect={'Choose one city:'}
              defaultSelect={'No city'}
              backgroundContent={true}
              arraySelect={cities.map( (city) => {return city.city+''}) } 
              handleSelect={handleSelect} 
              handleClickBtn={handleClickBtn} >
                <div className='weather-info'>
                  { weather.humidity > 0 ?
                    <>
                      <img src={weather.icon} alt="weather" />
                      <div className='weather-items'>
                        <div className='item-title'>{weather.temp}°c</div>
                        <div className='item-subtitle'>Temperature</div>
                      </div>
                      <div className='weather-items'>
                        <div className='item-title'>{weather.humidity}%</div>
                        <div className='item-subtitle'>Humidity</div>
                      </div>
                    </>
                    :
                    <div>Unable to get weather information</div>
                  }
                </div>
                {/* <OptionButton /> */}
              </ContainerItems>
              
            <ContainerItems 
              title={'Devices'} 
              type={'devices'} 
              handleSelect={handleSelect} 
              handleClickBtn={handleClickBtn} >
                <div className='qtd-devices'>
                {Object.entries(getDevicesByRooms()).map(([key,group]:any,index) => {
                    return <div key={index} className='qtd-devices-room' style={{ backgroundColor: `rgb(${(index+1%4)*80} , ${(index+1%4)*40}, ${(index+1%4)*20})` }}>
                        <div className='title'>{key === '' ? 'No room': key }</div>
                        <div>{group.length} Device{group.length > 1 && 's'}</div>
                      </div>
                  })
                  }</div>
                </ContainerItems>
          </div>
        </div>
        {/* <main>
            <Dashboard actual={actual} setModal={setModal} sub_menu={sub_menu}/>
            { user &&
              <div className="main-content">
                { 
                  Object.entries(groupByRoom()).map(([key,group],indeindex) => {index                    return (
                      <diindex key={index} className='card-list'>
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
          </main> */}
      </div>
    )
  }