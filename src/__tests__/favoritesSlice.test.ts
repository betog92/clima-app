// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

import favoritesSlice, {
  addFavorite,
  removeFavorite,
  loadFavorites,
  initialState,
} from "../features/favorites/favoritesSlice";

describe("favoritesSlice", () => {
  it("debería manejar estado inicial", () => {
    expect(favoritesSlice(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("debería agregar ciudad a favoritos", () => {
    const action = addFavorite("C-MTY");
    const newState = favoritesSlice(initialState, action);

    expect(newState.cities).toContain("C-MTY");
    expect(newState.cities).toHaveLength(1);
  });

  it("debería remover ciudad de favoritos", () => {
    const stateWithFavorites = {
      ...initialState,
      cities: ["C-MTY", "C-CDMX"],
    };

    const action = removeFavorite("C-MTY");
    const newState = favoritesSlice(stateWithFavorites, action);

    expect(newState.cities).not.toContain("C-MTY");
    expect(newState.cities).toContain("C-CDMX");
    expect(newState.cities).toHaveLength(1);
  });

  it("debería manejar loadFavorites.pending", () => {
    const action = { type: loadFavorites.pending.type };
    const newState = favoritesSlice(initialState, action);

    expect(newState.isLoading).toBe(true);
  });

  it("debería manejar loadFavorites.fulfilled", () => {
    const mockFavorites = ["C-MTY", "C-GDL"];
    const action = {
      type: loadFavorites.fulfilled.type,
      payload: mockFavorites,
    };
    const newState = favoritesSlice(initialState, action);

    expect(newState.cities).toEqual(mockFavorites);
    expect(newState.isLoading).toBe(false);
  });
});
