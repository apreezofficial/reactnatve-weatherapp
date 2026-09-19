import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {City, WeatherData} from '../types/weather';
import {getWeather} from '../services/weatherService';
import {loadCities} from '../services/StorageService';

function getWeatherDescription(code: number): string {
  if (code === 0) {
    return 'Clear sky';
  }

  if (code === 1 || code === 2 || code === 3) {
    return 'Partly cloudy';
  }

  if (code === 45 || code === 48) {
    return 'Foggy';
  }

  if (
    (code >= 51 && code <= 57) ||
    (code >= 61 && code <= 67) ||
    (code >= 80 && code <= 82)
  ) {
    return 'Rainy';
  }

  if (code >= 71 && code <= 77) {
    return 'Snowy';
  }

  if (code >= 95) {
    return 'Thunderstorm';
  }

  return 'Cloudy';
}

function getWeatherColor(code: number): string {
  if (code === 0) {
    return '#FACC15';
  }

  if (code === 1 || code === 2 || code === 3) {
    return '#93C5FD';
  }

  if (code === 45 || code === 48) {
    return '#CBD5E1';
  }

  if (
    (code >= 51 && code <= 57) ||
    (code >= 61 && code <= 67) ||
    (code >= 80 && code <= 82)
  ) {
    return '#60A5FA';
  }

  if (code >= 71 && code <= 77) {
    return '#E0F2FE';
  }

  if (code >= 95) {
    return '#818CF8';
  }

  return '#93C5FD';
}

export default function WeatherDetailScreen({route, navigation}: any) {
  const {cityId} = route.params;

  const [city, setCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);

      const cities = await loadCities();

      const selectedCity = cities.find(
        item => item.id === cityId,
      );

      if (!selectedCity) {
        return;
      }

      setCity(selectedCity);

      const result = await getWeather(
        selectedCity.latitude,
        selectedCity.longitude,
      );

      setWeather(result);
    } finally {
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  if (loading || !city || !weather) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const description = getWeatherDescription(
    weather.weatherCode,
  );

  const weatherColor = getWeatherColor(
    weather.weatherCode,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>{city.name}</Text>

        <Pressable onPress={loadWeather}>
          <Text style={styles.refresh}>↻</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.weatherMain}>
        <View
          style={[
            styles.weatherIndicator,
            {backgroundColor: weatherColor},
          ]}
        />

        <Text style={styles.temperature}>
          {Math.round(weather.temperature)}°
        </Text>

        <View style={styles.descriptionRow}>
          <Text style={styles.description}>
            {description}
          </Text>

          <Text style={styles.feelsLike}>
            Feels like {Math.round(weather.apparentTemperature)}°
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>
            {weather.humidity}%
          </Text>

          <Text style={styles.infoLabel}>Humidity</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>
            {Math.round(weather.windSpeed)} km/h
          </Text>

          <Text style={styles.infoLabel}>Wind</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: {
    fontSize: 38,
    lineHeight: 40,
    color: '#111111',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  refresh: {
    fontSize: 28,
    color: '#111111',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 15,
  },

  weatherMain: {
    alignItems: 'center',
    paddingTop: 45,
  },

  weatherIndicator: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  temperature: {
    fontSize: 72,
    fontWeight: '700',
    color: '#111111',
    marginTop: 20,
  },

  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#111111',
  },

  feelsLike: {
    fontSize: 16,
    fontWeight: '400',
    color: '#777777',
    marginLeft: 12,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    padding: 18,
  },

  infoValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },

  infoLabel: {
    fontSize: 14,
    color: '#555555',
    marginTop: 6,
  },
});
