import { useEffect, useState } from "react";

import axios from 'axios';

type WeatherParams = {
    city: string;
  }

export function useWeather(props: WeatherParams) {
    const [weather, setWeather] = useState({temp: 0, humidity: 0, icon: ''})
    
    const cityFormated = props.city.replace(" ", "%20").toLowerCase()
    const latLongPath = `https://geocode.xyz/locate=${cityFormated}-br?json=1`

    useEffect(() => { 

        async function getWeatherInfo() {
            const data = await axios.get(latLongPath)
                .then(res => {
                    return res.data
                })
                
            if(!isNaN(data.longt) && !isNaN(data.latt) ) {
                const weatherPath = `https://fcc-weather-api.glitch.me/api/current?lat=${parseFloat(data.latt)}&lon=${parseFloat(data.longt)}`
                await axios.get(weatherPath)
                    .then(res => {
                        
                        if(res.data.name !== 'Shuzenji')
                            setWeather({temp: res.data.main.temp, humidity: res.data.main.humidity, icon: res.data.weather[0].icon })
                        else
                            setWeather({temp: 0, humidity: 0, icon: '' })
                    })
            }

        }

        getWeatherInfo()

    }, [latLongPath])

    return { weather}

}