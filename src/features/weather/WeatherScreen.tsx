import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getWeatherData } from "../../services/WeatherService";
import { addFavorite, removeFavorite } from "../favorites/favoritesSlice";
import { WeatherData } from "../../shared/types";
import { AppDispatch, RootState } from "../../store";
import { Card } from "../../shared/components/Card";
import { Loader } from "../../shared/components/Loader";
import { ErrorView } from "../../shared/components/ErrorView";
import { formatDate } from "../../shared/utils/formatDate";

interface WeatherScreenProps {
  route: {
    params: {
      cityId: string;
      cityName: string;
    };
  };
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ route }) => {
  const { cityId, cityName } = route.params;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { cities: favoriteCities } = useSelector(
    (state: RootState) => state.favorites
  );

  useEffect(() => {
    loadWeatherData();
  }, [cityId]);

  const loadWeatherData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(cityId);
      setWeather(data);
    } catch (err) {
      setError("Error al cargar datos del clima");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(cityId));
    } else {
      dispatch(addFavorite(cityId));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    setIsLoading(true);

    try {
      const data = await getWeatherData(cityId);
      setWeather(data);
    } catch (err) {
      setError("Error al cargar datos del clima");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const convertToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const getDisplayTemperature = (): string => {
    if (!weather) return "0°C";
    const temp = isFahrenheit
      ? convertToFahrenheit(weather.tempC)
      : weather.tempC;
    const unit = isFahrenheit ? "°F" : "°C";
    return `${temp}${unit}`;
  };

  const getWeatherIcon = (icon: string): string => {
    const iconMap: Record<string, string> = {
      partly_cloudy: "⛅",
      light_rain: "🌦️",
      sunny: "☀️",
      cloudy: "☁️",
      rain: "🌧️",
      storm: "⛈️",
      snow: "❄️",
    };
    return iconMap[icon] || "🌤️";
  };

  const isFavorite = favoriteCities.includes(cityId);

  if (isLoading) {
    return <Loader message="Cargando datos del clima..." />;
  }

  if (error) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.errorContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
      >
        <ErrorView message={error} onRetry={handleRefresh} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={["#007AFF"]} // Android
          tintColor="#007AFF" // iOS
        />
      }
    >
      <Text style={styles.title}>{cityName}</Text>
      <Text style={styles.subtitle}>{formatDate(weather!.updatedAt)}</Text>

      <Card style={styles.weatherCard}>
        <Text style={styles.weatherIcon}>
          {getWeatherIcon(weather!.condition.icon)}
        </Text>
        <Text style={styles.temperature}>{getDisplayTemperature()}</Text>
        <Text style={styles.condition}>{weather!.condition.text}</Text>
      </Card>

      <View style={styles.detailsContainer}>
        <Card style={styles.detailCard}>
          <Text style={styles.detailLabel}>Humedad</Text>
          <Text style={styles.detailValue}>{weather!.humidity}%</Text>
        </Card>

        <Card style={styles.detailCard}>
          <Text style={styles.detailLabel}>Viento</Text>
          <Text style={styles.detailValue}>{weather!.windKph} km/h</Text>
        </Card>
      </View>

      <View style={styles.temperatureToggleContainer}>
        <Text style={styles.temperatureToggleLabel}>Temperatura</Text>
        <View style={styles.temperatureToggleButtons}>
          <TouchableOpacity
            style={[
              styles.temperatureButton,
              !isFahrenheit && styles.temperatureButtonActive,
            ]}
            onPress={() => setIsFahrenheit(false)}
          >
            <Text
              style={[
                styles.temperatureButtonText,
                !isFahrenheit && styles.temperatureButtonTextActive,
              ]}
            >
              °C
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.temperatureButton,
              isFahrenheit && styles.temperatureButtonActive,
            ]}
            onPress={() => setIsFahrenheit(true)}
          >
            <Text
              style={[
                styles.temperatureButtonText,
                isFahrenheit && styles.temperatureButtonTextActive,
              ]}
            >
              °F
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.favoriteSwitchContainer,
          isFavorite && styles.favoriteSwitchContainerActive,
        ]}
      >
        <Text style={styles.favoriteSwitchLabel}>Favorito</Text>
        <Switch
          value={isFavorite}
          onValueChange={handleToggleFavorite}
          trackColor={{ false: "#f0f0f0", true: "#FFD700" }}
          thumbColor={isFavorite ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#f0f0f0"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  weatherCard: {
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
  },
  weatherIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#007AFF",
  },
  condition: {
    fontSize: 20,
    marginTop: 8,
    textAlign: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  favoriteSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  favoriteSwitchContainerActive: {
    backgroundColor: "#FFF8DC",
    borderColor: "#FFD700",
  },
  favoriteSwitchLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  temperatureToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  temperatureToggleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  temperatureToggleButtons: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 2,
  },
  temperatureButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
  },
  temperatureButtonActive: {
    backgroundColor: "#007AFF",
  },
  temperatureButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  temperatureButtonTextActive: {
    color: "white",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WeatherScreen;
