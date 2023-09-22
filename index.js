
import  express  from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiKey = 'YOUR API KEY';

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

let weatherData = null;
const photoUrls = {
  sunny: 'ENTER YOUR PHOTO URL HERE',
  clear: 'ENTER YOUR PHOTO URL HERE',
  rain: 'ENTER YOUR PHOTO URL HERE',
  clouds: 'ENTER YOUR PHOTO URL HERE',
  // you can add more weather type if you like just don't forget to change the if else !!
}

app.get('/', async (req, res) => {
  res.render("index.ejs",{data:weatherData})
});

app.post('/getWeather', async(req, res) => {
  try {
    const city = req.body.city;
    const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    const cityData = geoResponse.data;
    const city_lat = cityData[0].lat;
    const city_lon = cityData[0].lon;

    
    // time to get the weather
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city_lat}&lon=${city_lon}&appid=${apiKey}`);
    const weatherData = weatherResponse.data;
    
    let url;
    if(weatherData.weather[0].main === 'Clear'){
      url = photoUrls.clear;
    }
    else if(weatherData.weather[0].main === 'Sunny'){
      url = photoUrls.sunny;
    }
    else if(weatherData.weather[0].main === 'Rain'){
      url = photoUrls.rain;
    }
    else if(weatherData.weather[0].main === 'Clouds'){
      url = photoUrls.clouds;
    }
    
    res.render('index.ejs',{data: weatherData, photoUrl: url });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs");
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});