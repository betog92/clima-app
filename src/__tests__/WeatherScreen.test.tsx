// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import WeatherScreen from "../features/weather/WeatherScreen";
import { store } from "../store";

const mockRoute = {
  params: {
    cityId: "C-MTY",
    cityName: "Monterrey",
  },
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>
  );
};

describe("WeatherScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería mostrar loading inicial", () => {
    const { getByText } = renderWithProviders(
      <WeatherScreen route={mockRoute} />
    );

    expect(getByText("Cargando datos del clima...")).toBeTruthy();
  });

  it("debería renderizar datos del clima correctamente", async () => {
    const { getByText } = renderWithProviders(
      <WeatherScreen route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText("Monterrey")).toBeTruthy();
      expect(getByText("31.2°C")).toBeTruthy();
      expect(getByText("Parcialmente nublado")).toBeTruthy();
      expect(getByText("52%")).toBeTruthy();
      expect(getByText("12.4 km/h")).toBeTruthy();
    });
  });

  it("debería mostrar error cuando falla la carga", async () => {
    // Usar una ciudad que no existe para forzar error
    const errorRoute = {
      params: {
        cityId: "C-INVALID",
        cityName: "Ciudad Invalida",
      },
    };

    const { getByText } = renderWithProviders(
      <WeatherScreen route={errorRoute} />
    );

    await waitFor(() => {
      expect(getByText("Error al cargar datos del clima")).toBeTruthy();
    });
  });

  it("debería mostrar toggle de temperatura", async () => {
    const { getByText } = renderWithProviders(
      <WeatherScreen route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText("Temperatura")).toBeTruthy();
      expect(getByText("°C")).toBeTruthy();
      expect(getByText("°F")).toBeTruthy();
    });
  });

  it("debería mostrar switch de favorito", async () => {
    const { getByText } = renderWithProviders(
      <WeatherScreen route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText("Favorito")).toBeTruthy();
    });
  });
});
