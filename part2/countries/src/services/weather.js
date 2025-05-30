import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
const api_key = import.meta.env.VITE_SOME_KEY

const get = (location) => {
    const request = axios.get(`${baseUrl}appid=${api_key}&q=${location}&units=metric`)
    return request.then(response => response.data)
}

export default { get }