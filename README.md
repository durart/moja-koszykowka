# 🏀 Moja Koszykówka — MVP 0.1

Mobilna, polskojęzyczna aplikacja PWA do planowania i rejestrowania treningów koszykarskich. Obsługuje tryb zawodnika i trenera; działa lokalnie, bez zakładania konta.

## Co działa?

- Katalog **90 ćwiczeń** w 10 kategoriach z wyszukiwaniem, poziomami i instrukcjami.
- Tworzenie planów, dodawanie i usuwanie ćwiczeń, zmiana kolejności i czasu.
- Szybki trening bez planu oraz trening uruchomiony z zapisanego planu.
- Niezależny status każdej instancji ćwiczenia, cofanie wykonania, pomijanie, start od dowolnego ćwiczenia.
- Liczniki skuteczności rzutów, powtórzeń, czasu, błędów i ocen trenera.
- Tryb trenera z przypisywaniem stacji do ćwiczeń oraz grupowym timerem stacji.
- Historia i podsumowania, eksport/import kopii danych JSON.
- Automatyczny zapis w **IndexedDB** po zmianach, wstrzymanie przy przywracaniu sesji po zamknięciu aplikacji.
- PWA z obsługą offline po pierwszym załadowaniu.

**Ważne:** jest to lokalne MVP. Nie ma kont, współdzielenia między urządzeniami ani zarządzania danymi dzieci w chmurze. Istniejące aplikacje `moja-silownia` i `moj-bilans` są niezależne.

## Uruchomienie

Wymagany Node.js 20+. Nie trzeba instalować pakietów.

```bash
npm run dev
```

Otwórz http://localhost:4173. Aplikację można również serwować jako statyczne pliki z serwera HTTP(S). Nie uruchamiaj przez `file://`, ponieważ moduły ES i IndexedDB wymagają prawidłowego pochodzenia.

## Testy i budowanie

```bash
npm test
npm run check
npm run build
```

`npm run build` tworzy katalog `dist/`, który można opublikować bezpośrednio na GitHub Pages. Dzięki względnym ścieżkom działa pod `/moja-koszykowka/`. Automatyczna publikacja jest w `.github/workflows/pages.yml`; wymaga konfiguracji GitHub Pages → Source: **GitHub Actions** i publicznego repozytorium przy typowym darmowym hostingu.

## Technologie

MVP używa **natywnego JavaScript (ES Modules), CSS oraz IndexedDB** bez zależności npm, aby natychmiast działać i dało się je testować offline. Jest to świadome uproszczenie względem planowanej docelowo architektury React + TypeScript + Vite; migracja może nastąpić przed dalszą rozbudową.

## Prywatność i kopie zapasowe

Dane zapisują się tylko w przeglądarce używanego urządzenia. Czyszczenie danych przeglądarki może je usunąć. Regularnie eksportuj plik JSON z zakładki „Więcej”. Import zastępuje bieżące dane po potwierdzeniu. Przed zmianą urządzenia wykonaj eksport.

## Dalsze kroki

- Dopracowanie metryk w wielu rundach, przerw i rotacji stacji.
- Profile grup i zawodników, ocena techniki oraz rozdzielenie wyników zespołu i zawodnika.
- Weryfikacja materiałów ćwiczeń przez trenera i rozbudowa autorskich wskazówek technicznych.
- Migracja do React + TypeScript + Vite, a następnie pełne testy przeglądarkowe Playwright.

Autorzy ćwiczeń: autorskie, krótkie opisy przygotowane do MVP; bez kopiowania materiałów źródłowych.
