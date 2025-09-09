// Tipos basados en los datos mock de la documentación
export interface City {
  id: string;
  name: string;
  country: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
}

export interface WeatherData {
  cityId: string;
  updatedAt: string;
  tempC: number;
  humidity: number;
  windKph: number;
  condition: WeatherCondition;
}

export interface FavoritesState {
  cities: string[];
  isLoading: boolean;
  error: string | null;
}
