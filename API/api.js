import axios from 'axios';
import {API_KEY} from "@env"


export const callAutoComplete =  (letter)=>{
    const autoComplete = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${letter}`
    return axios.get(autoComplete);
}
export const selectedCity = (city)=>{
    const selectedCity = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
    return axios.get(selectedCity);
}
