# Moja Koszykówka — specyfikacja funkcjonalna MVP v1.0

Data: 2026-11-21
Docelowe repozytorium: `durart/moja-koszykowka` (do założenia)
Status: projekt funkcjonalny do implementacji; brak wdrożenia do produkcji.

## 1. Cel

Polskojęzyczna, mobilna PWA do budowania, wykonywania i analizowania treningów koszykarskich. Jedna baza ćwiczeń jest wykorzystywana przez dwa tryby: Zawodnik (trening indywidualny) i Trener (sesje indywidualne, grupowe, obwodowe/stacyjne). Zmiana trybu nie wymaga zmiany konta. MVP działa lokalnie i offline; nie zakłada backendu, współdzielenia kont ani synchronizacji między urządzeniami.

## 2. Granice MVP

W zakresie: katalog 90 autorskich opisów ćwiczeń, 10 kategorii, filtrowanie i wyszukiwanie, własne ćwiczenia, plany i szablony, aktywny trening, rejestracja wyników, trening grupowy z timerami/stacjami, lista obecności (opcjonalna i lokalna), historia, podstawowe statystyki, import/eksport JSON, PWA offline, testy automatyczne. 
Poza MVP: logowanie, role i uprawnienia w chmurze, wspólna praca trenera i zawodnika z różnych urządzeń, wiadomości, multimedia hostowane przez nas, płatności, AI dobierające obciążenia, kamery/analiza ruchu, automatyczny pomiar celności.

## 3. Katalog i taksonomia

Docelowo 90 ćwiczeń startowych:
- Kozłowanie i kontrola piłki: 16
- Rzuty: 16
- Wykończenia pod koszem: 10
- Rozgrzewka: 8
- Podania i chwyty: 8
- Obrona: 8
- Praca nóg i koordynacja: 8
- Decyzje, gra 1 na 1 i gry małe: 8
- Zbiórki i zastawianie: 4
- Schłodzenie i mobilność: 4

Każde ćwiczenie ma kategorię główną i 0..n kategorii dodatkowych. Filtry: poziom 1..4; sugerowany przedział wieku (wyłącznie wskazówka); liczba graczy min/max; sprzęt; wymagana przestrzeń (brak kosza, 1 kosz, pół boiska, pełne boisko); możliwość solo / para / grupa; czas; umiejętności; sposób mierzenia efektu; intensywność orientacyjna.

## 4. Model ćwiczenia

Wersjonowane `ExerciseDefinition`:
- id (UUID lub stabilny identyfikator katalogu), version, source (`built_in` | `custom`)
- name_pl, short_description_pl, instructions (kroki), coaching_cues, common_errors, safety_notes
- category_primary, category_secondary[], tags[]
- skill_level (1..4), suggested_age_min/max (nullable), participants_min/max (nullable)
- equipment[], space_required, basket_required, duration_default_sec, rest_default_sec
- metric_type (`completion`, `time`, `repetitions`, `shooting`, `made_attempted`, `errors`, `points`, `coach_rating`)
- metric_config (np. liczba serii, docelowe próby, czas rundy, skala oceny)
- variants: easier/harder, left_right_option, optional diagram/video URL
- author, sources[], created_at, updated_at, archived (dla własnych)

Dla wpisów katalogowych opisy i ilustracje należy tworzyć samodzielnie lub wykorzystywać zgodnie z licencją; nie kopiować automatycznie całych programów treningowych.

## 5. Przykładowe rekordy katalogu

1. Kozłowanie niskie prawą i lewą ręką — poziom 1, solo, piłka, 3x30 s na rękę, wynik: wykonanie/czas.
2. Kozłowanie slalomem — poziom 2, solo, piłka + 5 pachołków, 5 przejść, wynik: czas i straty (opcjonalnie).
3. Zmiana ręki przed sobą w ruchu — poziom 2, solo, piłka + przestrzeń, 4x20 m, wynik: powtórzenia.
4. Rzuty spod kosza z obu stron — poziom 1, solo, kosz + piłka, 20 prób, wynik: trafione/oddane osobno na stronę.
5. Rzuty z pięciu pozycji — poziom 2, solo, kosz + piłka, 5x10 prób, wynik: trafione/oddane dla każdej pozycji.
6. Rzuty wolne w seriach — poziom 1+, solo, kosz + piłka, 5x10 prób, wynik: trafione/oddane.
7. Dwutakt prawą i lewą stroną — poziom 1, solo, kosz + piłka, 2x10 prób na stronę, wynik: trafione/oddane.
8. Podania oburącz z klatki — poziom 1, para, piłka, 3x20 podań, wynik: liczba.
9. Podania w ruchu 2 na 0 — poziom 2, para, piłka + boisko, 6 przejść, wynik: wykonanie/błędy.
10. Przesuwanie w obronie — poziom 1, solo, linie lub znaczniki, 4x20 s, wynik: czas/wykonanie.
11. Closeout i zatrzymanie — poziom 3, para, kosz + piłka, 8 prób, wynik: ocena trenera/błędy.
12. 3 na 3 z ograniczeniem kozłowania — poziom 3, 6 graczy, pół boiska, 8 min, wynik: czas/ocena i opcjonalne punkty.

Parametry stanowią początkowe domyślne ustawienia edytowalne przez trenera, nie sztywne normy szkoleniowe.

## 6. Model danych aplikacji

- `Profile`: id, displayName (opcjonalne), mode (`player` | `coach`), locale, preferences, dateCreated.
- `Player`: id, pseudonym/name (opcjonalne), ageGroup (opcjonalne), notes (opcjonalne), status.
- `Group`: id, name, playerIds[].
- `ExerciseDefinition`: opis katalogowy, wersja, typ i schemat wyników.
- `TrainingTemplate`: id, ownerProfileId, name, targetMode, estimatedDuration, age/level hints, blocks[].
- `TemplateBlock`: id, phase (`warmup`, `skills`, `game`, `cooldown`), order, exercises[], station settings.
- `TemplateExercise`: id, exerciseDefinitionId, exerciseVersion, assignedConfig (czas/serie/liczba prób/przerwa), order, group/station assignment.
- `TrainingSession`: id, sourceTemplateId nullable, mode, groupId nullable, status (`planned`,`active`,`paused`,`completed`,`abandoned`), startedAt, endedAt, activeElapsedSec, notes, sessionExerciseIds[].
- `SessionExercise`: id (NOWY, unikatowy dla danego wystąpienia w treningu), exerciseDefinitionId, definitionSnapshot, configSnapshot, order, status (`pending`, `active`, `completed`, `skipped`), rounds[], startedAt, completedAt, notes.
- `ExerciseRound`: id, sessionExerciseId, order, metrics, done, startedAt, finishedAt.
- `Attendance`: sessionId, playerId, present (opcjonalnie).
- `SessionMetric`: per ćwiczenie/runda, na poziomie całej grupy lub konkretnego gracza tylko wtedy, gdy trener wyraźnie wybierze zapis indywidualny.
- `UserSettings`: domyślne przerwy, dźwięki, automatyczne przejście, preferencje prywatności.

**Zasada kluczowa:** katalogowe `exerciseDefinitionId` nie jest identyfikatorem wykonania. Oznaczanie zakończenia musi zmieniać wyłącznie `SessionExercise.id` lub `ExerciseRound.id`, bez mutowania innych wystąpień tej samej definicji, nawet jeśli występują kilka razy w jednym treningu.

## 7. Metryki i walidacja

- `completion`: boolean.
- `time`: nonnegative integer seconds.
- `repetitions`: nonnegative integer count.
- `shooting`: `made` integer >=0, `attempted` integer >=0, `made <= attempted`, opcjonalnie split po strefie/ręce/pozycji/odległości.
- `errors`: nonnegative integer; porównuj w ramach tego samego wariantu.
- `points`: integer, zależny od reguł gry.
- `coach_rating`: np. 1–5, subiektywna ocena; NIE łącz ze skutecznością liczbową.

Wyliczenia: skuteczność = 100*made/attempted, tylko jeśli attempted>0. Brak danych jest `null`, a nie `0`; `0/0` nie jest 0% skuteczności. Nie porównujemy bez oznaczenia odległości rzutów, wariantu ćwiczenia i warunków treningu. Przy historii pokazujemy liczbę prób dla kontekstu.

## 8. Reguły tworzenia treningów

- Indywidualny i trenerski trening używają tej samej listy ćwiczeń.
- Plan składa się z faz: rozgrzewka, technika/umiejętności, gra/zastosowanie, schłodzenie; fazy edytowalne.
- Każde dodanie ćwiczenia generuje nową instancję i odrębne parametry.
- Trener może grupować ćwiczenia w stacje z czasem na stanowisko, czasem rotacji i liczbą rund.
- Generator planu (jeżeli użyty) jest heurystyczny i pokazuje uzasadnienie, nigdy nie narzuca obciążeń bez zgody.
- Kontrola zasobów: ostrzegaj, gdy plan wymaga więcej koszy/piłek lub miejsca niż użytkownik zadeklarował. Ostrzeżenie nie blokuje ręcznej edycji.
- Domyślny czas treningu to suma czasu ćwiczeń + przerw + zaplanowanych przejść/rotacji. Tylko szacunek.
- Czas rzeczywisty sesji rozdziela się od czasu aktywnego timera ćwiczenia.
- Dla dzieci aktywność ma być adekwatna do poziomu, urozmaicona i nastawiona na uczenie/udział; aplikacja nie ustala sztywnych limitów obciążeń.

## 9. Reguły aktywnego treningu

1. Uruchom z szablonu lub pustą sesję.
2. Start sesji tworzy `TrainingSession` i trwałe `SessionExercise` snapshoty. Dane zapisują się lokalnie po każdej zmianie.
3. Użytkownik może rozpocząć od dowolnego ćwiczenia; kolejność listy nie determinuje statusu innych ćwiczeń.
4. `pending -> active -> completed`; możliwy `skipped` oraz powrót z `completed` do `active/pending` bez wpływu na inne instancje.
5. Ukończenie rundy nie oznacza automatycznie ukończenia całego ćwiczenia, jeśli pozostały rundy.
6. Każde ukończenie można cofnąć także po rozpoczęciu przerwy lub następnej rundy; nie blokować ikonki po przejściu ekranu.
7. Dodawanie ćwiczenia spoza planu do aktywnej sesji jest dozwolone; nie zmienia szablonu źródłowego bez osobnej decyzji.
8. Zmiana parametrów ćwiczenia w trakcie sesji nie modyfikuje globalnej definicji ani historii.
9. Pauza zatrzymuje timery odliczające. Po zamknięciu/ponownym otwarciu PWA sesja wraca do ostatniego stanu. Przywracanie timera ma jasną politykę (w MVP po wznowieniu pozostaje wstrzymany, aby nie 'odmierzać' w tle nieskończoności).
10. Koniec sesji możliwy mimo nieukończonych ćwiczeń: aplikacja oferuje pozostawienie jako niewykonane lub oznaczenie jako pominięte.
11. Zapisywana jest historia zakończona, ale usunięcie treningu wymaga potwierdzenia.
12. Tryb trenera: szybkie przełączanie między stacjami i etapami, duży timer, jeden status wykonania grupowego bez obowiązkowego liczenia wyników każdego gracza.

## 10. Ścieżka zawodnika

Start -> katalog / moje plany / nowy trening -> wybór ćwiczeń i parametrów -> trening (timer, serie, wynik, wykonano, pomiń, dodaj) -> podsumowanie (czas, wykonane ćwiczenia, trafienia/oddane, notatka) -> historia i postępy.

## 11. Ścieżka trenera

Start -> grupa lub trening indywidualny -> budowa jednostki -> podział na fazy i opcjonalne stacje -> prowadzenie sesji (timer grupowy, lista ćwiczeń/stacji, szybkie oznaczanie) -> podsumowanie (realizacja planu, notatki, obecność opcjonalna) -> historia.

W MVP trener nie potrzebuje wielu urządzeń. Dane nie synchronizują się automatycznie z zawodnikami; to świadome ograniczenie architektury offline-first.

## 12. Przykładowe plany

### Zawodnik — 45 min
- Rozgrzewka i kontrola piłki: 5 min
- Kozłowanie niskie / zmiany ręki: 8 min
- Slalom z pachołkami: 7 min
- Dwutakt, prawa/lewa: 10 min
- Rzuty z 5 pozycji: 10 min
- Rzuty wolne / schłodzenie: 5 min

### Trener — grupa, 60 min
- Rozgrzewka z piłką: 10 min
- Technika kozłowania i podań: 10 min
- 3 stacje po 8 min + 2 rotacje po 1 min: 26 min
- Gra 3 na 3 na zadanych zasadach: 10 min
- Schłodzenie i podsumowanie: 4 min

Każdy plan jest przykładem, zależnym od wieku, poziomu, liczebności, dostępności obiektów i obciążenia zawodników.

## 13. Ekrany MVP

1. Start: tryb, rozpocznij trening, ostatni trening, skrót do planów i katalogu.
2. Katalog: wyszukiwanie, filtry, ulubione, karta ćwiczenia.
3. Kreator planu: dodawanie, kolejność, parametry, fazy; w trenerze także stacje.
4. Aktywny trening: nagłówek sesji, lista ćwiczeń, timer, metryki, wykonano/cofnij, dodaj ćwiczenie, pauza, zakończ.
5. Podsumowanie: czas, wykonane/pominięte, wyniki liczbowe tam, gdzie istnieją.
6. Historia: sesje, podgląd szczegółów, podstawowe wykresy.
7. Trener: grupy i lista zawodników opcjonalnie, przygotowanie jednostki, widok stacji.
8. Ustawienia: tryb, dźwięk, dane, eksport/import JSON, reset z potwierdzeniem.

## 14. Architektura techniczna

- Frontend: TypeScript + React + Vite, responsywny mobile-first.
- PWA: manifest i service worker (np. vite-plugin-pwa), cache aplikacji i bazowego katalogu offline.
- Dane: IndexedDB (np. Dexie). Konfiguracja/ustawienia mogą używać tego samego źródła.
- Eksport: JSON z wersją schematu (`schemaVersion`) i datą, import z walidacją, podglądem konfliktów i opcją przywrócenia.
- Testy: Vitest (logika), React Testing Library (UI), Playwright (kluczowe scenariusze mobilne i PWA), walidacja `npm run build`.
- GitHub: nowe repo `durart/moja-koszykowka` i GitHub Pages; nazwa bazowej ścieżki skonfigurowana jawnie w Vite.
- Bezpieczeństwo: brak wymagania podawania pełnych danych identyfikujących dzieci; lokalny tryb anonimowy, możliwość kasowania i eksportu, brak zbierania danych analitycznych w MVP. Wersja z kontami i synchronizacją wymaga osobnego projektu uprawnień i zgodności z RODO.

## 15. Kryteria akceptacji MVP

- Katalog zawiera 90 poprawnych, rozłącznych identyfikatorów i przefiltrowuje ćwiczenia wg kategorii, poziomu, liczby osób oraz sprzętu.
- Użytkownik może zbudować 45-minutowy trening samodzielny i 60-minutowy z trzema stacjami.
- Uruchomienie treningu od drugiego ćwiczenia nie zmienia statusu pierwszego.
- Oznaczenie ćwiczenia B jako wykonanego nie zmienia ćwiczenia A ani innych wystąpień B.
- Cofnięcie wykonania B działa także po rozpoczęciu następnej rundy/przerwy.
- Ten sam typ ćwiczenia może wystąpić dwa razy w jednej sesji i wyniki pozostają niezależne.
- W trakcie aktywnego treningu można dodać ćwiczenie spoza planu bez modyfikowania szablonu.
- Trafienia i próby przyjmują tylko logicznie poprawne wartości; 0/0 jest oznaczone jako brak skuteczności.
- Zakończenie sesji z niewykonanymi ćwiczeniami zapisuje prawidłową historię.
- Po przeładowaniu, zamknięciu i ponownym otwarciu aplikacji aktywny trening i wpisane dane pozostają dostępne.
- Eksport -> wyczyszczenie -> import odtwarza identyczne profile, plany, sesje i wyniki (z wyjątkiem zamierzonych metadanych operacji).
- Sesja trenerska ze stacjami i rotacjami działa bez konieczności tworzenia osobnego wyniku dla każdego zawodnika.
- Instalacja PWA i start w trybie offline działają po pierwszym załadowaniu na obsługiwanej przeglądarce.

## 16. Priorytet implementacji

**P0:** dane, katalog, 2 tryby, kreator planu, engine sesji, zapisywanie i cofanie statusów, zapisywanie wyników, eksport/import, offline, testy regresyjne.
**P1:** grupy, stacje/rotacje, szybki timer trenera, historia, podstawowe statystyki, 90 ćwiczeń, własne ćwiczenia.
**P2:** rozbudowane wykresy, multimedia, udostępnianie planu plikiem, sugestie progresji, późniejsza synchronizacja.

## 17. Materiały referencyjne

- Jr. NBA Instructional Curriculum: https://jr.nba.com/jr-nba-instructional-curriculum/
- Jr. NBA Practice Plans: https://jr.nba.com/jr-nba-practice-plans/
- USA Basketball Youth Guidelines: https://www.usab.com/play/youth-basketball-guidelines
- FIBA / WABC coaching resources: https://about.fiba.basketball/en/wabc-documents

To są materiały metodyczne do weryfikacji podejścia; nie stanowią licencji na kopiowanie oryginalnej bazy opisów lub mediów.
