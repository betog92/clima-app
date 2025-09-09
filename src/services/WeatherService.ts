import { City, WeatherData } from "../shared/types";
import searchData from "../assets/mock/search.json";
import weatherMTY from "../assets/mock/weather.C-MTY.json";
import weatherCDMX from "../assets/mock/weather.C-CDMX.json";
import weatherGDL from "../assets/mock/weather.C-GDL.json";

// Mapear los datos de clima por cityId
const weatherDataMap: Record<string, WeatherData> = {
  "C-MTY": weatherMTY,
  "C-CDMX": weatherCDMX,
  "C-GDL": weatherGDL,
};

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query.trim()) return [];

  return (searchData as City[]).filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Simular obtención de datos de clima con delay
export const getWeatherData = async (cityId: string): Promise<WeatherData> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simular latencia

  // No simular errores aleatorios en tests
  if (process.env.NODE_ENV !== "test") {
    // Simular error aleatorio (50% de probabilidad) solo en desarrollo
    if (Math.random() < 0.5) {
      throw new Error("Error de conexión");
    }
  }

  const weather = weatherDataMap[cityId];
  if (!weather) {
    throw new Error(`No se encontraron datos de clima para ${cityId}`);
  }

  return weather;
};
