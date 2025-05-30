const CountriesList = ({countries, handleCountryClick}) => {
    return (
        <div>
            {countries.map((country, index) =>  <p key={index}>{country.name.common} <button onClick={() => handleCountryClick(index)}>show</button></p>)}
        </div>
    )
}

export default CountriesList