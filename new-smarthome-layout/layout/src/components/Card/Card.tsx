import { Dispatch, ReactNode, SetStateAction, SyntheticEvent } from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { MdClose } from 'react-icons/md'
import { MdSettings } from 'react-icons/md'

import { database } from '../../services/firebase';

import "./styles.scss"

type CardProps = {
    path: string;
    city?: string;
    name: string;
    roomHint?: string;
    traits: {
      OnOff?: {on:boolean};
      Brightness?: {brightness:number};
      ArmDisarm?: {isArmed:boolean};
    };
    type: string;
    children?: ReactNode;
    setModal: Dispatch<SetStateAction<{ "open":boolean, "title": string, 'fields':Array<{ type:string, value:string}>, 'item':string, 'type':string, 'value':string}>>;
  }
  
export function Card({
    path,
    city,
    name,
    roomHint,
    traits,
    type,
    children,
    setModal
}: CardProps) {
    
  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 100,
      label: '100',
    },
  ]
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.id === "OnOff")
      database.ref(path+"/traits/OnOff").update({on:event.target.checked});
    else if (event.target.id === "ArmDisarm")
    database.ref(path+"/traits/ArmDisarm").update({isArmed:event.target.checked});
  };

  function openModal(event: SyntheticEvent) {
    event.preventDefault();
    let title = event.currentTarget.textContent
    let fields = [] as Array<{ type:string, value:string}>
    if(title === "Configuration")
      fields =  [ { type:"input", value:"rename"}, { type:"input", value:"Move new city"} ]
    setModal({ "open":true, "title": title || "", fields: fields, item:"device", type:event.currentTarget.id, value:path });
  }

    return (
        <div className={`card-container ${traits.Brightness?.brightness !== undefined ? 'bigger': ""}`} >
            <div className="card-header">
              <div className="card-title">
                {name}
              </div>
              <div className="card-buttons">
                <MdSettings id="config" size={28} onClick={openModal} className="card-buttons-click" title="Configuration"/>
                <MdClose id="remove" size={28} onClick={openModal} className="card-buttons-click" title="Remove Device"/>
              </div>
            </div>
            <div className="separator"></div>
            <div className="card-content">
              {traits.OnOff?.on !== undefined &&  
              <FormControlLabel
                control={<Switch checked={traits.OnOff?.on} id={'OnOff'} 
                onChange={handleChange} />}
                label={traits.OnOff.on ? "is On" : "is Off"}
              />} 
              {traits.Brightness?.brightness !== undefined  &&  
              <>
                <Typography id="discrete-slider-custom" gutterBottom>
                  Brightness
                </Typography>
                <Slider
                  defaultValue={traits.Brightness?.brightness}
                  aria-labelledby="discrete-slider-custom"
                  step={1}
                  valueLabelDisplay="on"
                  marks={marks}
                />
              </>
              }
              {traits.ArmDisarm?.isArmed !== undefined  && 
              <FormControlLabel
                control={<Switch checked={traits.ArmDisarm.isArmed} id={'ArmDisarm'}
                onChange={handleChange} />} 
                label={traits.ArmDisarm.isArmed ? "is Armed" : "is not Armed"}
              />} 
             
            </div>
        </div>
      );
}