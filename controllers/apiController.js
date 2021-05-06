const axios = require('axios')

class ApiController {
    static getWeather(req, res, next) {
        const apiKey = process.env.WEATHER_API_KEY
        const unit = "metric";
        const location = "jakarta"
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;
        axios({
            method: 'GET',
            url: url,
        })
        .then(result => {
            let value = {
                name: result.data.name,
                icon: result.data.weather[0].icon,
                temp: result.data.main.temp,
                feels_like: result.data.main.feels_like,
                description: result.data.weather[0].description,
                pressure: result.data.main.pressure,
                humidity: result.data.main.humidity,
                visibility: result.data.visibility,
                temp_max: result.data.main.temp_max
            }
            res.status(200).json(value)
        })
        .catch(err => {
            next({status: 404})
        })
    }
}

module.exports = ApiController