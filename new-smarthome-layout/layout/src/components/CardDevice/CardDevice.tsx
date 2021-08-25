// import { Dispatch, ReactNode, SetStateAction, SyntheticEvent } from 'react';
// import Switch from '@material-ui/core/Switch';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Typography from '@material-ui/core/Typography';
// import Slider from '@material-ui/core/Slider';

// import { MdClose } from 'react-icons/md'
// import { MdSettings } from 'react-icons/md'

// import { database } from '../../services/firebase';

import "./styles.scss"

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

type CardProps = {
  device: DeviceType;
}
  
export function CardDevice({ device }:CardProps) {
  return (
    <div className='card-device' >
      <input id={device.id} type="radio" name='radio-device' hidden />
      <label htmlFor={device.id}>
      <div className="card-device-header">
        <div className="onOff">On</div>
        <div className="onOff">input</div>
      </div>
      <div className='card-device-content'>
        <div className="icon">icon</div>
      </div>
      <div className='card-device-footer'>
        <div className="title">{device.name}</div>
      </div>
      </label>
    </div>
  )
}