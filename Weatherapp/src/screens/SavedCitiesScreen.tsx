import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {City} from '../types/weather';
import {loadCities} from '../services/StorageService';
import {getWeather} from '../services/weatherService';

export default function SavedCitiesScreen({navigation}: any) {
  const [cities, setCities] = useState<City[]>([]);
  const [temperatures, setTemperatures] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);

  const loadSavedCities = useCallback(async () => {
    try {
      setLoading(true);

      const savedCities = await loadCities();

      setCities(savedCities);

      const results = await Promise.all(
        savedCities.map(async city => {
          try {
            const weather = await getWeather(
              city.latitude,
              city.longitude,
            );

            return {
              id: city.id,
              temperature: weather.temperature,
            };
          } catch {
            return {
              id: city.id,
              temperature: null,
            };
          }
        }),
      );

      const temperatureMap: Record<string, number> = {};

      results.forEach(item => {
        if (item.temperature !== null) {
          temperatureMap[item.id] = item.temperature;
        }
      });

      setTemperatures(temperatureMap);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedCities();
    }, [loadSavedCities]),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved cities</Text>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCity')}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      {cities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved cities</Text>
        </View>
      ) : (
        <FlatList
          data={cities}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Pressable
              style={styles.cityRow}
              onPress={() =>
                navigation.navigate('WeatherDetail', {
                  cityId: item.id,
                })
              }>
              <View style={styles.cityInfo}>
                <View style={styles.statusDot} />

                <Text style={styles.cityName}>{item.name}</Text>
              </View>

              <Text style={styles.temperature}>
                {temperatures[item.id] !== undefined
                  ? `${Math.round(temperatures[item.id])}°`
                  : '--°'}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111111',
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '400',
    lineHeight: 32,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 20,
  },

  cityRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    marginRight: 12,
  },

  cityName: {
    fontSize: 17,
    color: '#111111',
  },

  temperature: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#777777',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
