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

export default function SavedCitiesScreen({navigation}: any) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch cities every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const fetchSavedCities = async () => {
        try {
          const savedCities = await loadCities();
          if (isMounted) {
            setCities(savedCities);
          }
        } catch (error) {
          console.error('Failed to load saved cities:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchSavedCities();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved cities</Text>

        <Pressable
          style={({pressed}) => [styles.addButton, pressed && styles.pressed]}
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
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable
              style={({pressed}) => [styles.cityRow, pressed && styles.pressedRow]}
              onPress={() =>
                navigation.navigate('WeatherDetail', {
                  cityId: item.id,
                })
              }>
              <View style={styles.cityInfo}>
                <View style={styles.statusDot} />
                <Text style={styles.cityName}>{item.name}</Text>
              </View>

              <Text style={styles.temperature}>--°</Text>
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
  pressed: {
    opacity: 0.8,
  },
  pressedRow: {
    backgroundColor: '#F9FAFB',
  },
});