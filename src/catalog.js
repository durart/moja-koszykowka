// Autorski katalog ćwiczeń. Wbudowane identyfikatory nie zmieniają się między wersjami.
export const CATEGORIES = [
  {id:'dribbling', name:'Kozłowanie', emoji:'🏀', count:16},
  {id:'shooting', name:'Rzuty', emoji:'🎯', count:16},
  {id:'finishing', name:'Wykończenia', emoji:'⛹️', count:10},
  {id:'warmup', name:'Rozgrzewka', emoji:'🔥', count:8},
  {id:'passing', name:'Podania', emoji:'🤝', count:8},
  {id:'defense', name:'Obrona', emoji:'🛡️', count:8},
  {id:'footwork', name:'Praca nóg', emoji:'⚡', count:8},
  {id:'games', name:'Gra i decyzje', emoji:'🧠', count:8},
  {id:'rebounding', name:'Zbiórki', emoji:'🙌', count:4},
  {id:'cooldown', name:'Schłodzenie', emoji:'🧘', count:4},
];
// Każdy rekord: nazwa|instrukcja|poziom|osoby minimum|typ pomiaru|sprzęt (oddzielony przecinkami)
const DATA = {
  dribbling: [
    'Niskie kozłowanie prawą ręką|Utrzymuj biodra nisko i kozłuj obok stopy, nie patrząc na piłkę.|1|1|time|piłka',
    'Niskie kozłowanie lewą ręką|Pracuj słabszą ręką w stabilnej pozycji i kontroluj odbicie poniżej kolana.|1|1|time|piłka',
    'Kozłowanie wysokie w miejscu|Odbijaj piłkę na wysokość biodra i zachowaj wzrok skierowany przed siebie.|1|1|time|piłka',
    'Zmiana ręki przed sobą|Przenieś piłkę niskim odbiciem przed sobą, zachowując równowagę i osłaniając ją barkiem.|1|1|repetitions|piłka',
    'Kozłowanie między nogami|Wykonuj zmianę ręki pod wykroczną nogą, najpierw powoli, potem płynnie.|2|1|repetitions|piłka',
    'Kozłowanie za plecami|Przenieś piłkę za plecami do drugiej ręki bez prostowania sylwetki.|3|1|repetitions|piłka',
    'Slalom między pachołkami|Pokonaj wyznaczoną trasę z kontrolowaną zmianą ręki przy każdym znaczniku.|2|1|time|piłka,pachołki',
    'Slalom na czas|Pokonaj identyczny slalom na czas; zapisuj także straty kontroli.|3|1|time|piłka,pachołki',
    'Zmiana tempa z piłką|Przeplataj wolne kozłowanie z krótkimi przyspieszeniami na sygnał.|2|1|time|piłka',
    'Zatrzymanie po kozłowaniu|Po krótkim biegu zatrzymaj się na dwa tempa i zachowaj kontrolę piłki.|2|1|repetitions|piłka',
    'Kozłowanie dwoma piłkami synchronicznie|Kozłuj dwiema piłkami jednocześnie, utrzymując ten sam rytm.|3|1|time|2 piłki',
    'Kozłowanie dwoma piłkami naprzemiennie|Odbijaj dwie piłki na przemian bez patrzenia w dół.|4|1|time|2 piłki',
    'Kozłowanie z osłoną ciała|Prowadź piłkę ręką dalszą od wyimaginowanego obrońcy, wolnym ramieniem osłaniaj przestrzeń.|2|1|time|piłka',
    'Zmiana kierunku i przyspieszenie|Wykonaj ostrą zmianę kierunku, po czym przyspiesz przez kilka metrów.|3|1|repetitions|piłka,pachołki',
    'Kozłowanie z partnerem — presja|Partner umiarkowanie przeszkadza; zadaniem jest ochrona piłki i utrzymanie pozycji.|3|2|time|piłka',
    'Kozłowanie przy ograniczonej przestrzeni|Pozostań w małym kwadracie, zmieniaj rękę i tempo bez utraty piłki.|2|1|errors|piłka,pachołki'
  ],
  shooting: [
    'Rzuty spod kosza|Oddawaj spokojne rzuty z bliska, utrzymując łokieć pod piłką i pełny wyprost.|1|1|shooting|piłka,kosz',
    'Rzuty jedną ręką z bliska|Skup się na torze lotu piłki i wykończeniu nadgarstka bez odpychania drugą ręką.|1|1|shooting|piłka,kosz',
    'Rzuty z pięciu pozycji|Wybierz pięć stałych punktów wokół kosza i wykonaj po tyle samo prób z każdego.|2|1|shooting|piłka,kosz',
    'Rzuty wolne w seriach|Oddawaj serie rzutów wolnych z tą samą rutyną przed każdym rzutem.|1|1|shooting|piłka,kosz',
    'Rzuty po podaniu|Przyjmij podanie, ustaw stopy do kosza i oddaj rzut bez zbędnej zwłoki.|2|2|shooting|piłka,kosz',
    'Rzuty po jednym koźle|Wykonaj jeden mocny kozioł w wybranym kierunku, zatrzymaj się i rzuć.|2|1|shooting|piłka,kosz',
    'Rzuty po dwóch kozłach|Stwórz miejsce dwoma kozłami, zatrzymaj się w równowadze i oddaj rzut.|3|1|shooting|piłka,kosz',
    'Rzuty z rogów boiska|Wykonaj serię rzutów z obu rogów z odległości odpowiedniej do możliwości.|3|1|shooting|piłka,kosz',
    'Rzuty ze skrzydeł|Oddawaj rzuty z prawego i lewego skrzydła, zapisując wyniki oddzielnie.|2|1|shooting|piłka,kosz',
    'Rzuty z półdystansu|Wybierz stałą odległość i ćwicz identyczny rytm ustawienia oraz wypuszczenia piłki.|2|1|shooting|piłka,kosz',
    'Rzuty po wyjściu zza zasłony|Odbiegnij od znacznika symbolizującego zasłonę, złap podanie i rzuć.|3|2|shooting|piłka,kosz,pachołki',
    'Rzuty z obrońcą na dobiegu|Rzuć przed kontrolowanym dobiegiem partnera, bez wymuszania kontaktu.|4|2|shooting|piłka,kosz',
    'Rzuty po zwodzie|Wykonaj wiarygodny zwód rzutowy, przemieść się i zakończ akcję rzutem.|3|1|shooting|piłka,kosz',
    'Rzuty po zmianie kierunku|Po zmianie ręki przy pachołku wykonaj dynamiczne zatrzymanie i rzut.|3|1|shooting|piłka,kosz,pachołki',
    'Seria rzutów pod presją czasu|Ustaw limit czasu, wykonuj rzuty z ustalonych miejsc i zapisuj liczbę prób.|3|1|shooting|piłka,kosz',
    'Rzuty kończące serię zmęczenia|Po krótkim, bezpiecznym ćwiczeniu ruchowym skup się na utrzymaniu techniki rzutu.|3|1|shooting|piłka,kosz'
  ],
  finishing: [
    'Dwutakt prawą stroną|Wykonaj rytm kroków prawą stroną i zakończ rzutem prawą ręką od tablicy.|1|1|shooting|piłka,kosz',
    'Dwutakt lewą stroną|Wykonaj dwutakt z lewej strony, wykańczając lewą ręką.|1|1|shooting|piłka,kosz',
    'Dwutakt po kozłowaniu|Rozpocznij z obwodu, prowadź piłkę i zakończ dwutaktem bez zbędnych kroków.|2|1|shooting|piłka,kosz',
    'Rzut spod kosza po obrocie|Odbierz piłkę tyłem do kosza, obróć się stabilnie i zakończ rzutem.|2|1|shooting|piłka,kosz',
    'Wykończenie lewą i prawą ręką|Naprzemiennie kończ wejście na kosz każdą ręką z tej samej odległości.|2|1|shooting|piłka,kosz',
    'Rzut hakiem z bliska|Ustaw się bokiem do kosza, unieś piłkę z boku tułowia i wykonaj kontrolowany hak.|3|1|shooting|piłka,kosz',
    'Floater po wejściu|Wejdź w pole trzech sekund i wypuść miękki rzut ponad wyobrażonym obrońcą.|3|1|shooting|piłka,kosz',
    'Wykończenie po zmianie ręki|Wykonaj zmianę ręki w ruchu i zakończ wejściem na kosz.|3|1|shooting|piłka,kosz',
    'Dwutakt pod presją obrońcy|Partner kontrolowanie broni przestrzeni; szukaj właściwego kąta wykończenia.|3|2|shooting|piłka,kosz',
    'Wykończenie po kontakcie z poduszką|Trener używa miękkiej poduszki kontaktowej; zawodnik kończy rzut w równowadze.|4|2|shooting|piłka,kosz,poduszka'
  ],
  warmup: [
    'Trucht i zmiany kierunku|Truchtaj po boisku, na sygnał płynnie zmieniaj kierunek bez gwałtownych skrętów.|1|1|time|boisko',
    'Mobilizacja stawów skokowych|Wykonuj kontrolowane przenoszenie kolana nad stopą bez odrywania pięty.|1|1|time|brak',
    'Krążenia ramion i barków|Płynnie wykonuj krążenia ramion w obu kierunkach, zwiększając zakres stopniowo.|1|1|time|brak',
    'Przeskoki boczne o małej amplitudzie|Wykonuj krótkie przeniesienia ciężaru z nogi na nogę, lądując miękko.|1|1|time|brak',
    'Rozgrzewka z piłką w parach|Podawajcie piłkę w spokojnym ruchu, zwiększając stopniowo dystans i tempo.|1|2|time|piłka',
    'Bieg tyłem i przodem|Na oznaczonym odcinku zmieniaj kierunek biegu, kontrolując tor poruszania.|2|1|time|pachołki',
    'Ruchy obronne w rozgrzewce|W krótkich odcinkach wykonuj spokojne przesunięcia boczne w pozycji obronnej.|1|1|time|boisko',
    'Aktywacja bioder i przysiad|Wykonaj niewielkie przysiady i kontrolowane otwieranie bioder przed grą.|1|1|time|brak'
  ],
  passing: [
    'Podania oburącz z klatki|Zwróć dłonie na zewnątrz przy wypuszczeniu piłki, kierując ją na wysokość klatki partnera.|1|2|repetitions|piłka',
    'Podania kozłem|Podawaj tak, aby piłka odbiła się około dwóch trzecich drogi do partnera.|1|2|repetitions|piłka',
    'Podania znad głowy|Trzymaj piłkę nad głową i podawaj celnie bez zbędnego odchylenia.|2|2|repetitions|piłka',
    'Podania jednorącz z boku|Wykonuj mocne, kontrolowane podania jedną ręką naprzemiennie.|2|2|repetitions|piłka',
    'Podania w ruchu dwójkami|Biegnijcie równolegle i wymieniajcie podania bez zatrzymywania.|2|2|errors|piłka',
    'Podania po koźle|Wykonaj kozioł i szybkie podanie do partnera w ruchu.|2|2|repetitions|piłka',
    'Podania z obrońcą|Próbuj znaleźć korytarz podania przy kontrolowanym nacisku obrońcy.|3|3|errors|piłka',
    'Podania w trójkach z rotacją|Trójka zawodników podaje i zmienia miejsca, pilnując komunikacji i celu podania.|3|3|errors|piłka'
  ],
  defense: [
    'Podstawowa postawa obronna|Utrzymuj obniżony środek ciężkości, ręce aktywne i ciężar ciała na śródstopiu.|1|1|time|brak',
    'Przesuwanie obronne w bok|Przemieszczaj się krokami odstawno-dostawnymi, unikając krzyżowania nóg.|1|1|time|pachołki',
    'Zatrzymanie przed atakującym|Dobiegnij do znacznika, zwolnij przed nim i przyjmij stabilną pozycję.|2|1|repetitions|pachołki',
    'Closeout na skrzydło|Dobiegnij do partnera z piłką, skróć ostatnie kroki i zachowaj kontrolę.|3|2|repetitions|piłka',
    'Obrona 1 na 1 bez kozłowania|Atakujący porusza się bez kozłowania; obrońca pracuje ustawieniem i dystansem.|2|2|time|piłka',
    'Obrona 1 na 1 z piłką|Pracuj nad ustawieniem między rywalem a koszem przy ograniczonej liczbie kozłów.|3|2|coach_rating|piłka,kosz',
    'Pomoc i powrót w obronie|Zrób krok pomocy do środka, a następnie wróć do własnego zawodnika.|3|3|repetitions|piłka',
    'Rotacje defensywne trzech zawodników|Na sygnał trzech obrońców płynnie zmienia zadania pomocy i krycia.|4|3|coach_rating|piłka,kosz'
  ],
  footwork: [
    'Podskoki w miejscu i miękkie lądowanie|Wykonaj niskie podskoki, lądując cicho i stabilnie na obu stopach.|1|1|repetitions|brak',
    'Kroki odstawno-dostawne|Poruszaj się w bok między znacznikami bez krzyżowania nóg.|1|1|time|pachołki',
    'Praca nóg na drabince|Przechodź przez pola drabinki rytmicznie, zaczynając od prostego układu kroków.|2|1|time|drabinka',
    'Sprint 5 metrów i zatrzymanie|Przyspiesz na krótkim odcinku i hamuj kilkoma kontrolowanymi krokami.|2|1|repetitions|pachołki',
    'Reakcja na sygnał trenera|Na pokazany kierunek wykonaj szybkie przestawienie i wróć do pozycji startowej.|2|2|repetitions|pachołki',
    'Pivot na nodze wykrocznej|Zatrzymaj stopę obrotu i wykonuj skręt tułowia bez przesuwania osi obrotu.|1|1|repetitions|piłka',
    'Zmiana kierunku pod kątem 45 stopni|Wybiegaj do znacznika i zmieniaj kierunek z odpowiednim obniżeniem bioder.|3|1|time|pachołki',
    'Lustro w parach|Jedna osoba wyznacza kierunki, druga naśladuje jej ruchy bez kontaktu.|2|2|time|brak'
  ],
  games: [
    'Gra 1 na 1 od skrzydła|Rozpoczynaj akcję ze skrzydła i podejmij decyzję: rzut lub wejście.|2|2|coach_rating|piłka,kosz',
    'Gra 1 na 1 z ograniczeniem kozłów|Atakujący ma maksymalnie trzy kozły, więc musi szybciej rozpoznawać przewagę.|3|2|coach_rating|piłka,kosz',
    'Gra 2 na 1 w kontrataku|Dwóch atakujących stara się stworzyć dogodną sytuację przeciw jednemu obrońcy.|2|3|points|piłka,kosz',
    'Gra 2 na 2 z podaniem przed rzutem|Przed każdym rzutem zespół musi wykonać co najmniej jedno celne podanie.|2|4|points|piłka,kosz',
    'Gra 3 na 3 na połowie boiska|Rozgrywaj krótkie akcje, ćwicząc spacing i współpracę.|3|6|points|piłka,kosz',
    'Gra 3 na 3 z limitem kozłów|Każdy zawodnik może kozłować maksymalnie dwa razy, co wymusza ruch bez piłki.|3|6|points|piłka,kosz',
    'Przewaga 3 na 2|Trzech atakujących rozpoznaje wolnego gracza przeciw dwóm obrońcom.|3|5|coach_rating|piłka,kosz',
    'Decyzja: rzut, podanie czy wejście|Trener pokazuje sygnał lub zmienia ustawienie obrońcy; zawodnik reaguje wyborem zagrania.|4|3|coach_rating|piłka,kosz'
  ],
  rebounding: [
    'Zbiórka po rzucie o tablicę|Rzuć piłkę o tablicę, wyskocz w kontrolowany sposób i zbierz ją oburącz.|1|1|repetitions|piłka,kosz',
    'Zastawianie rywala|Po rzucie obróć się, zajmij pozycję przed rywalem i dopiero szukaj piłki.|2|2|coach_rating|piłka,kosz',
    'Zbiórka w parach|Wykonaj rzuty na zmianę i walcz o poprawną pozycję pod koszem bez agresywnego kontaktu.|2|2|repetitions|piłka,kosz',
    'Zbiórka i pierwsze podanie|Po zbiórce szybko znajdź partnera na obwodzie i wykonaj mocne podanie.|3|2|repetitions|piłka,kosz'
  ],
  cooldown: [
    'Spokojny marsz i oddech|Przejdź do wolnego marszu i uspokój oddech po wysiłku.|1|1|time|brak',
    'Mobilność obręczy barkowej|Wykonuj powolne ruchy ramion w komfortowym zakresie bez dociskania.|1|1|time|brak',
    'Rozluźnienie bioder|Wykonaj spokojne przejścia w lekkim wykroku, bez bólu i szarpania.|1|1|time|brak',
    'Podsumowanie i spokojne podania|Zakończ sesję lekkimi podaniami i krótkim omówieniem techniki oraz samopoczucia.|1|2|completion|piłka'
  ]
};
const DURATIONS={dribbling:240, shooting:600, finishing:480, warmup:180, passing:300, defense:300, footwork:240, games:480, rebounding:240, cooldown:180};
const PHASE={warmup:'warmup', cooldown:'cooldown',games:'game'};
export const EXERCISES = Object.entries(DATA).flatMap(([category,rows])=>rows.map((row,i)=>{
  const [name,instructions,level,participants,metric,equipment] = row.split('|');
  return {id:`b-${category}-${String(i+1).padStart(2,'0')}`,version:1,source:'built_in',name,shortDescription:instructions,instructions:[instructions],category,level:Number(level),participantsMin:Number(participants),equipment:equipment.split(','),durationSec:DURATIONS[category],restSec:30,metric,phase:PHASE[category] || 'skills',notes:'Zachowaj poprawną technikę i dostosuj tempo do możliwości uczestników.'};
}));
export const getCategory = (id)=>CATEGORIES.find(x=>x.id===id);
export const DEFAULT_PLAN=[
  {exerciseId:'b-warmup-01',durationSec:300},
  {exerciseId:'b-dribbling-01',durationSec:300},
  {exerciseId:'b-dribbling-07',durationSec:420},
  {exerciseId:'b-finishing-01',durationSec:600},
  {exerciseId:'b-shooting-03',durationSec:600},
  {exerciseId:'b-shooting-04',durationSec:300},
  {exerciseId:'b-cooldown-01',durationSec:180}
];
