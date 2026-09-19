export type TemperatureUnit = 'C' | 'F';

export type City = { 
    id: string;
    name : string;
    longitude: number;
    latitude: number;
    isCurrentLocation: boolean;
};

export type WeatherData = {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    WeatherCode: number;
};