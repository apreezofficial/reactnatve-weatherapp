import AsyncStrorage from '@react-native-async-storage/async-storage';
import {City, TemperatureUnit} from '../types/weather';

const CITIES_KEY = '@weather_app/cities';
const UNIT_KEY = '@weather_app/unit';

export async function loadCities(): Promise<City[]> {
    const data = await AsyncStrorage.getItem(CITIES_KEY);
    if (!data) {
        return [];
    }
    return JSON.parse(data) as City[];
}
export async function saveCities(cities: City[]): Promise<void> {
    await AsyncStrorage.setItem(
    CITIES_KEY,
    JSON.stringify(cities),
    );
}
export default async function loadUnit(): Promise<TemperatureUnit> {
    const unit = await AsyncStrorage.getItem(UNIT_KEY);
    if (unit === 'F') {
        return 'F';
    }
    return 'C';
}

export async function saveunit(unit: TemperatureUnit): Promise<void> {
    await AsyncStrorage.setItem(UNIT_KEY, unit);
}   
export async function saveCurrentLocation(
    latitude: number,
    longitude: number,
    name: string,
): Promise<void> {
    const cities = await loadCities();
    const currentLocation: City ={
        id: 'current_location',
        name,
        latitude,
        longitude,
        isCurrentLocation: true,
    };
    const otherCities = cities.filter(city => city.id !== 'current_location');
    await saveCities([currentLocation, ...otherCities]);
    }