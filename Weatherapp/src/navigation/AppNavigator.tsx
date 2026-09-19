import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SavedCitiesScreen from '../screens/SavedCitiesScreen';
import AddCityScreen from '../screens/AddCityScreen';
import WeatherDetailScreen from '../screens/WeatherDetailScreen';

export type RootStackParamList = {
    SavedCities: undefined;
    AddCity: undefined;
    WeatherDetail: {cityId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
             initialRouteName="SavedCities"
             screenOptions={{
                headerShown: false,
             }}>
                <Stack.Screen 
                name="SavedCities"
                component={SavedCitiesScreen} />
                <Stack.Screen
                name="AddCity"
                component={AddCityScreen} />
                <Stack.Screen
                name="WeatherDetail"
                component={WeatherDetailScreen} />
             </Stack.Navigator>
        </NavigationContainer>
    );
}
