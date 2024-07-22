import axios from 'axios';
import {API_KEY} from "@env"


export const callAutoComplete =  (letter)=>{
    const autoComplete = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${letter}`
    return axios.get(autoComplete);
}
export const selectedCity = (days,city)=>{
    const selectedCity = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`
    return axios.get(selectedCity);
}
