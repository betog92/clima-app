import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesState } from "../../shared/types";

const FAVORITES_KEY = "@weatherly_favorites";

export const initialState: FavoritesState = {
  cities: [],
  isLoading: false,
  error: null,
};

// Thunks para AsyncStorage
export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      throw new Error("Error al cargar favoritos");
    }
  }
);

export const saveFavorites = createAsyncThunk(
  "favorites/saveFavorites",
  async (cities: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(cities));
      return cities;
    } catch (error) {
      throw new Error("Error al guardar favoritos");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((cityId) => cityId !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error al cargar favoritos";
      })
      .addCase(saveFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload;
      })
      .addCase(saveFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error al guardar favoritos";
      });
  },
});

export const { addFavorite, removeFavorite, clearError } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
