import { useEffect, useState } from "react";

import { database } from "../services/firebase";


type CityType = {
  id: string;
  city: string | undefined;
}
type CityParams = {
  user_id:string | undefined;
}

export function useCity( props: CityParams) {
  const [cities, setCities] = useState<CityType[]>([])
  
  useEffect(() => {
    if(props.user_id){
      const citiesRef = database.ref(`users/${props.user_id}/cities/`);

      citiesRef.on('value', device => {
        const databaseCities = device.val();
        
        const firebaseCities = databaseCities ?? {};
        const parsedCity = Object.entries(firebaseCities).map(([key, value]) => {
    
            return {
              id: key,
              city: value as string,
            }
        })      

        if(parsedCity.length === 0)
          setCities([{id: '', city:''}]);
        else
          setCities(parsedCity);
      })
      
      return () => {
        citiesRef.off('value');
      }
    }
  }, [props.user_id]);

  return { cities }
}