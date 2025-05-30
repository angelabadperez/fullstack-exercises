import { useState, useEffect } from 'react'
import weatherService from "../services/weather"
import LanguagesList from "./LanguagesList"
import Flag from "./Flag"
import Weather from "./Weather"

const Country = ({country}) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        weatherService
            .get(country.capital)
            .then(response => {
                setWeather(response)
            })
    }, [])

    return (
        <div>
          <h1>{country.name.common}</h1>
          <p>Capital {country.capital}</p>
          <p>Population {country.population}</p>
          <LanguagesList languages={country.languages} />
          <Flag flag={country.flags.png} country={country.name.common} />
          <Weather weather={weather} />
        </div>
    )
}

export default Country