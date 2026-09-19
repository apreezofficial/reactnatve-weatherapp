import React, {useEffect, useState} from 'react';
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

export default function WeatherDetailScreen({route, navigation}: any) {
  const {cityId} = route.params;

  const [city, setCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadWeather() {
    try {
      setLoading(true);

      const cities = await loadCities();
      const selectedCity = cities.find(item => item.id === cityId);

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
  }

  useEffect(() => {
    loadWeather();
  }, []);

  if (loading || !city || !weather) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
        <View style={styles.weatherIcon}>
          <Text style={styles.weatherEmoji}>☀</Text>
        </View>

        <Text style={styles.temperature}>
          {Math.round(weather.temperature)}°
        </Text>

        <Text style={styles.description}>Clear sky</Text>

        <Text style={styles.feelsLike}>
          Feels like {Math.round(weather.apparentTemperature)}°
        </Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Humidity</Text>
          <Text style={styles.infoValue}>{weather.humidity}%</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Wind</Text>
          <Text style={styles.infoValue}>
            {Math.round(weather.windSpeed)} km/h
          </Text>
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
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  refresh: {
    fontSize: 28,
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

  weatherIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weatherEmoji: {
    fontSize: 55,
  },

  temperature: {
    fontSize: 72,
    fontWeight: '700',
    marginTop: 20,
  },

  description: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
  },

  feelsLike: {
    fontSize: 15,
    color: '#777777',
    marginTop: 8,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },

  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    padding: 18,
  },

  infoLabel: {
    fontSize: 14,
    color: '#777777',
  },

  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
});