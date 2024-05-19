import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../../services/api/api';
import { View, Text, H6} from 'tamagui';
/* samo za info na webu vrže en runtime error v konzolo, na fonu dela bp */
const Weather = () => {

  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await getCurrentWeather();
        setWeather(weatherData);
        console.log(weatherData)
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchData();

  }, []);

  const getWeatherIconSource = () => {
    if (weather && weather.current && weather.current.weather[0]) {
      const iconCode = weather.current.weather[0].icon;
      console.log(iconCode)
      return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
    console.log("default_icon_uri.png")
    return "default_icon_uri.png";
  };

  const kelvinToCelsius = (kelvin: any) => {
    return kelvin - 273.15;
  };

    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {weather && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text>
          <H6>{`Temperature: ${kelvinToCelsius(weather.current.temp).toFixed(0)} °C`}</H6>
          {/* zakomentirano ker ni časa in zgleda slabo! */}
          {/* <Image
            source={{ uri: getWeatherIconSource() }}
            style={{ width: 50, height: 50 }}
          /> */}
          </Text>
        </View>
      )}
    </View>
    );
    


}

export default Weather;

