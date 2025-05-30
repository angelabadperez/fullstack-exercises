const Weather = ({ weather }) => {
    if (!weather) { 
        return null
    }
    console.log(weather)
    return (
        <div>
            <h2>Weather in {weather.name}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={`Icon for ${weather.weather[0].description.toLowerCase()}`} 
            />
            <p>Wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather