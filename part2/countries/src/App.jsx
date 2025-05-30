import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import CountryFilter from './components/CountryFilter'
import Country from './components/Country'
import CountriesList from './components/CountriesList'

const App = () => {
  const [countries, setCountries] = useState(null)
  const [country, setCountry] = useState('')

  useEffect(() => {
    countriesService
        .getAll()
        .then(response => {
          setCountries(response)
        })
  }, [])

  const handleCountryChange = event => {
    event.preventDefault()
    setCountry(event.target.value)
  }

  const handleCountryClick = id => setCountry(filteredCountries[id].name.common)

  const filteredCountries = country === '' ? [] : countries.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase()))

  if (!countries) { 
    return null
  }

  return (
    <div>
      <CountryFilter country={country}  handleCountryChange={handleCountryChange} />
      {filteredCountries.length === 0 && country !== '' ? (
        <p>No countries found</p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <Country country={filteredCountries[0]} />
      ) : (
        <CountriesList countries={filteredCountries} handleCountryClick={handleCountryClick}/>
      )}
    </div>
  )
}

export default App
