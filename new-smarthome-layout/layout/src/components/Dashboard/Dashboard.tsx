
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md'

import "./styles.scss";

type DashboardProps = {
  actual: string;
  sub_menu: string[];
  setModal: Dispatch<SetStateAction<{ "open":boolean, "title": string, 'fields':Array<{ type:string, value:string}>, 'item':string, 'type':string, "value":string }>>;
}

export function Dashboard({ actual, sub_menu, setModal, ...props }: DashboardProps) {

  const [state, setState] = useState(false);

  function handleButtonClick () {
    setState(!state);
  };

  function handleMenuCityClick(event: FormEvent){
    let menu_item = event.currentTarget.innerHTML
    let testObject = ""
    let aux = []
    let new_actual = menu_item
    switch(menu_item){
      case "Add new City":
        //testObject = `{ "actual": "São Carlos", "cities":["Colina", "São Carlos"] }`;
        //localStorage.setItem('cities', testObject);
        setModal({ "open":true, "title": menu_item, "fields":[{type:"input", value:"Name..."}], item:'city', type:"add", value: ""})
        break;
      case "Remove City":
        setModal({ "open":true, "title": menu_item, "fields":[], item:'city', type:"remove", value:actual})
        break;
      default:
        aux = sub_menu.filter((value)=> value !== "Add new city" && value !== "Remove city")
        // if(menu_item === "Remove city"){
        //   aux = aux.filter((value)=> value !== actual)
        //   new_actual = aux.length === 0 ? "No city":aux[0]
        // }
        
        aux = aux.map(value => {
          return `"${value}"`
        })
        testObject = `{ "actual": "${new_actual}", "cities":[${aux}] }`;
        localStorage.setItem('cities', testObject);
        break;
    }
    setState(false)
  }
  
  const ref = useRef();

  function handleClickOutside (e:any) {
    if (ref && ref.current){
      const componentRef: any = ref.current
      if(!componentRef.contains(e.target) && state === true) {
        setState(false);          
      }
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
        document.removeEventListener('click', handleClickOutside, true);
    };
  });


  return (
    <div className="dashboard-header">
      <div className="dashboard-title">Dashboard</div>
      <div className="dashboard-list-city">
        <div className="dashboard-list-city-selected">
          {
            actual
          }
        </div>
        <div className="dashboard-list-city-container" ref={ref as any}> 
          <MdKeyboardArrowDown className="button" onClick={handleButtonClick} style={ {transform:state?'rotate(180deg)':"", transition:"all 0.3s ease-out"} } />
          {state && (
            <div className="dropdown">
              <ul>
              {sub_menu.map((menus,index) => {
                if( menus !== actual ){
                  return (
                    <div key={index}>
                      { (menus === "Add new City" && sub_menu.length > 1)  &&
                      <div className="separator-city"></div> }
                      <li key={index} onClick={handleMenuCityClick}>
                        {menus}
                      </li>
                    </div>
                  )
                } 
                return ""
              })}
              </ul>
            </div>)
          }
        </div>
      </div>
    </div>
  )
}