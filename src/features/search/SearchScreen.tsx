import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { searchCities } from "../../services/WeatherService";
import { loadFavorites } from "../favorites/favoritesSlice";
import { City } from "../../shared/types";
import { AppDispatch, RootState } from "../../store";
import { Card } from "../../shared/components/Card";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../app/Navigation";

const SearchScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Search">>();
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { cities: favoriteCities } = useSelector(
    (state: RootState) => state.favorites
  );

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  // Búsqueda automática
  useEffect(() => {
    if (!query.trim()) {
      setCities([]);
      return;
    }

    const searchCitiesAsync = async () => {
      const results = await searchCities(query);
      setCities(results);
    };

    searchCitiesAsync();
  }, [query]);

  const handleCityPress = (city: City) => {
    navigation.navigate("Weather", {
      cityId: city.id,
      cityName: city.name,
    });
  };

  const isFavorite = useCallback(
    (cityId: string) => favoriteCities.includes(cityId),
    [favoriteCities]
  );

  const renderCity = useCallback(
    ({ item }: { item: City }) => (
      <TouchableOpacity onPress={() => handleCityPress(item)}>
        <Card style={styles.cityCard}>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{item.name}</Text>
            <Text style={styles.cityCountry}>{item.country}</Text>
          </View>
          {isFavorite(item.id) && (
            <View style={styles.favoriteIndicator}>
              <Text style={styles.favoriteIndicatorText}>⭐</Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    ),
    [handleCityPress, isFavorite]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Ciudades</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Escribe el nombre de una ciudad..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={cities}
        renderItem={renderCity}
        keyExtractor={(item) => item.id}
        style={styles.citiesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  citiesList: {
    flex: 1,
  },
  cityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cityCountry: {
    fontSize: 14,
    color: "#666",
  },
  favoriteIndicator: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIndicatorText: {
    fontSize: 25,
  },
});

export default SearchScreen;
