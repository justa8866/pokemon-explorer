# Pokemon Explorer

Aplikacja webowa do przeglądania i eksploracji świata Pokemon, zbudowana z React, TypeScript i Tailwind CSS.

## Funkcjonalności

### Podstawowe funkcje
- **Przeglądanie Pokemon** - Wyświetlanie listy Pokemon z oficjalnymi artworkami
- **Wyszukiwanie** - Szukanie Pokemon po nazwie lub numerze ID
- **Filtrowanie** - Filtrowanie Pokemon według typów (Fire, Water, Grass, itp.)
- **Nieskończone przewijanie** - Automatyczne ładowanie nowych Pokemon podczas przewijania
- **Szczegóły Pokemon** - Modal z pełnymi informacjami o wybranym Pokemon
- **Ulubione** - Dodawanie Pokemon do ulubionych (zapisywane lokalnie)

## Technologie

### Frontend
- **React 19** - Najnowsza wersja React z hooks
- **TypeScript** - Typowanie statyczne dla lepszej jakości kodu
- **Vite** - Szybki bundler i dev server
- **Tailwind CSS v4** - CSS framework

### Biblioteki i narzędzia
- **Lucide React** - Ikony SVG
- **PokeAPI** - Oficjalne API Pokemon
- **LocalStorage** - Lokalne przechowywanie ulubionych

## Instalacja i uruchomienie

### Wymagania
- Node.js
- npm lub yarn

### Kroki instalacji

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/justa8866/pokemon-explorer
cd pokemon
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Uruchom serwer deweloperski**
```bash
npm run dev
```

4. **Otwórz aplikację**
Przejdź do `http://localhost:5173` w przeglądarce

### Skrypty npm

```bash
npm run dev          # Uruchom serwer deweloperski
npm run build        # Zbuduj aplikację produkcyjną
npm run preview      # Podgląd zbudowanej aplikacji
npm run lint         # Sprawdź kod
```

## Jak używać aplikacji

### 1. Przeglądanie Pokemon
- Po załadowaniu zobaczysz siatkę 24 Pokemon
- Przewijaj w dół, aby automatycznie załadować więcej
- Kliknij "Load More Pokemon" dla ręcznego ładowania

### 2. Wyszukiwanie
- Użyj paska wyszukiwania na górze
- Wpisz nazwę Pokemon (np. "pikachu") lub numer ID (np. "25")
- Wyniki aktualizują się automatycznie

### 3. Filtrowanie według typów
- Kliknij na znaczniki typów pod paskiem wyszukiwania
- Wybierz jeden lub więcej typów (Fire, Water, Electric, itp.)
- Pokemon będą filtrowane według wybranych typów

### 4. Szczegóły Pokemon
- Kliknij na kartę Pokemon, aby otworzyć modal
- Zobacz szczegółowe informacje: statystyki, typy, ewolucje
- Dodaj do ulubionych klikając ikonę serca

### 5. Ulubione Pokemon
- Kliknij ikonę serca w modalu, aby dodać do ulubionych
- Ulubione są zapisywane lokalnie w przeglądarce

## 🔧 API i dane

### PokeAPI
Aplikacja używa [PokeAPI](https://pokeapi.co/) - darmowego RESTful API dla danych Pokemon.

### Endpoints używane:
- `GET /pokemon` - Lista Pokemon
- `GET /pokemon/{id}` - Szczegóły Pokemon
- `GET /type` - Lista typów Pokemon

### Cache'owanie
- API responses są cache'owane w pamięci
- Obrazki są lazy-loaded
- LocalStorage dla ulubionych
