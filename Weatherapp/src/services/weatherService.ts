import {WeatherData} from '../types/weather';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchCity(cityName: string) {
  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(
      cityName,
    )}&count=1&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error('Failed to find city');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('City not found');
  }

  return data.results[0];
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const url =
    `${WEATHER_URL}?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
  };
}
