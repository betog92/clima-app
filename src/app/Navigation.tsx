import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../features/search/SearchScreen";
import WeatherScreen from "../features/weather/WeatherScreen";

export type RootStackParamList = {
  Search: undefined;
  Weather: {
    cityId: string;
    cityName: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "Buscar Ciudades" }}
        />
        <Stack.Screen
          name="Weather"
          component={WeatherScreen}
          options={({ route }) => ({ title: route.params.cityName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
