import React, {useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

import {
  loadCities,
  saveCities,
  saveCurrentLocation,
} from '../services/StorageService';

import {searchCity} from '../services/weatherService';

import {City} from '../types/weather';

export default function AddCityScreen({navigation}: any) {
  const [cityName, setCityName] = useState('');
  const [adding, setAdding] = useState(false);

  async function addCity() {
    if (!cityName.trim()) {
      Alert.alert('Error', 'Please enter a city name.');
      return;
    }

    try {
      setAdding(true);

      const result = await searchCity(cityName.trim());

      const city: City = {
        id: Date.now().toString(),
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        isCurrentLocation: false,
      };

      const cities = await loadCities();

      await saveCities([...cities, city]);

      navigation.goBack();
    } catch {
      Alert.alert(
        'Error',
        'Could not find that city. Check the city name and try again.',
      );
    } finally {
      setAdding(false);
    }
  }

  async function requestLocationPermission() {
    if (Platform.OS !== 'android') {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function useCurrentLocation() {
    const allowed = await requestLocationPermission();

    if (!allowed) {
      Alert.alert(
        'Permission required',
        'Location permission is required.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude, longitude} = position.coords;

          await saveCurrentLocation(
            latitude,
            longitude,
            'Current location',
          );

          navigation.goBack();
        } catch {
          Alert.alert(
            'Error',
            'Could not save your current location.',
          );
        }
      },
      error => {
        Alert.alert('Location error', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Add city</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>City name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        placeholderTextColor="#999"
        value={cityName}
        onChangeText={setCityName}
        autoCapitalize="words"
      />

      <Pressable
        style={styles.addButton}
        onPress={addCity}
        disabled={adding}>
        <Text style={styles.addButtonText}>
          {adding ? 'Adding...' : 'Add city'}
        </Text>
      </Pressable>

      <View style={styles.orContainer}>
        <View style={styles.orLine} />

        <Text style={styles.orText}>or</Text>

        <View style={styles.orLine} />
      </View>

      <Pressable
        style={styles.locationButton}
        onPress={useCurrentLocation}>
        <Text style={styles.locationButtonText}>
          Use my current location
        </Text>
      </Pressable>
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

  header: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: {
    fontSize: 38,
    color: '#111111',
    lineHeight: 40,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  headerSpacer: {
    width: 30,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 15,
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 10,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111111',
  },

  addButton: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },

  orText: {
    marginHorizontal: 15,
    color: '#888888',
  },

  locationButton: {
  height: 54,
  borderWidth: 1,
  borderColor: '#2563EB',
  backgroundColor: 'transparent',
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

  locationButtonText: {
  color: '#111111',
  fontSize: 16,
  fontWeight: '600',
},
});
