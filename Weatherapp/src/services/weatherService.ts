import {WeatherData}  from '../types/weather';
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeather(
    latitude: number,
    longitude: number,
): Promise<WeatherData> {
    const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=termperature_2m,relativehumidity_2m,apparent_temperature_2m,windspeed_10m&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    const data = await response.json();
    return {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature_2m,
        humidity: data.current.relativehumidity_2m,
        windSpeed: data.current.windspeed_10m,
        WeatherCode: data.current.weathercode,
    };
}