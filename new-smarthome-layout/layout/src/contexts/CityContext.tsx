import { createContext, ReactNode, useState } from "react";
// import { database, firebase } from "../services/firebase";
import { useAuth } from '../hooks/useAuth';

type Device = {
  id: string;
  city: string;
  name: string;
  roomHint: string;
  type: string;
}

type CityContextType = {
    devices: Device | undefined;
}

type CityContextProviderProps = {
  children: ReactNode;
}
export const CityContext = createContext({} as CityContextType);

export function CityContextProvider(props: CityContextProviderProps) {

  const [devices, setSevices] = useState<Device>();
  const { user } = useAuth()

  

    
  return (
    <CityContext.Provider value={{ devices }}>
      {props.children}
    </CityContext.Provider>
  );

}
