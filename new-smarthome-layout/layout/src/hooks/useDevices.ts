import { useEffect, useState } from "react";

import { database } from "../services/firebase";

type FirebaseDevices = Record<string, {
  city: string | undefined;
  name: string;
  roomHint: string | "";
  traits: {
    OnOff?: {on:boolean};
    Brightness?: {brightness:number};
    ArmDisarm?: {isArmed:boolean};
  };
  type: string;
}>

type DeviceType = {
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

type DeviceParams = {
  city: string;
  user_id:string | undefined;
}

export function useDevices( props: DeviceParams) {
  const [devices, setDevices] = useState<DeviceType[]>([])
  
  useEffect(() => {
    if(props.user_id){
      const deviceRef = database.ref(`users/${props.user_id}/devices/`);

      deviceRef.on('value', device => {
        const databaseDevices = device.val();
        
        const firebaseDevices: FirebaseDevices = databaseDevices ?? {};
        const parsedDevices = Object.entries(firebaseDevices).filter(([key, value]) => value.city === props.city || value.city === "").map(([key, value]) => {
            return {
              id: key,
              city: value.city,
              name: value.name,
              roomHint: value.roomHint,
              traits: value.traits,
              type: value.type,
            }
        })

        setDevices(parsedDevices);
      })
      
      return () => {
        deviceRef.off('value');
      }
    }
  }, [props.city, props.user_id]);

  return { devices }
}