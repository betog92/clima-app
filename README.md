# Weatherly

Hola! Mi implementación de la prueba técnica de Weatherly. App móvil de clima con React Native, Expo, Redux Toolkit y TypeScript.

## Setup

### Prerrequisitos

- Node.js (v18+)
- Expo Go app en tu teléfono

### Instalación

```bash
npm install
npm start
# Escanear QR con Expo Go
```

## Características

- Búsqueda de ciudades en tiempo real
- Información detallada del clima (temp, humedad, viento)
- Sistema de favoritos con AsyncStorage
- Conversión °C/°F
- Pull-to-refresh

## Testing

```bash
npm test  # 2 tests: 1 UI + 1 lógica Redux
```

## Especificaciones Técnicas

**Datos Mock**: Simples archivos JSON con delays para simular API real.

**Búsqueda instantánea**: Sin delays, resultados inmediatos al escribir

**Pull-to-refresh**: Más moderno que botón "Actualizar".

**Switch nativo**: Para favoritos, más intuitivo que botón.

**Toggle °C/°F**: Conversión simple en el frontend

**Errores aleatorios**: 50% probabilidad para probar manejo de errores.

## Stack

- React Native + Expo
- TypeScript
- Redux Toolkit
- React Navigation
- Jest + RNTL
