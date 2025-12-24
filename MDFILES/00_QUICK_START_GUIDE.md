# RPA-WEB-UI - Quick Start Guide & Reference

## Obsah Dokumentácie

1. **00_QUICK_START_GUIDE.md** (tento súbor) - Rýchly štart a reference
2. **01_PREHLAD_KNIZNICE.md** - Celkový prehľad knižnice
3. **02_KOMPONENTY_DETAILNE.md** - Detailná dokumentácia komponentov
4. **03_COMPOSABLES_DETAILNE.md** - Detailná dokumentácia composables
5. **04_STORES_A_SERVICES.md** - Detailná dokumentácia stores a services
6. **05_TYPES_A_INTERFACES.md** - Detailná dokumentácia types a interfaces

---

## Rýchla Inštalácia

### 1. Nain štalovať Knižnicu

**Kontext:**
- **Čo robí:** Inštaluje RPA-WEB-UI knižnicu cez npm package manager
- **Vstup:** Názov balíčka `rpa-web-ui` z npm registry
- **Výstup:** Nainštalované závislosti v `node_modules/` a záznam v `package.json`
- **Prečo:** Základný krok pre pridanie knižnice do projektu, stiahne všetky potrebné súbory a závislosti

```bash
npm install rpa-web-ui
```

### 2. Import v Projekte

**Kontext:**
- **Čo robí:** Konfiguruje Vue 3 aplikáciu a registruje RPA-WEB-UI komponenty
- **Vstup:** Vue komponenty (DataGrid, ListBox) a CSS štýly z knižnice
- **Výstup:** Globálne dostupné komponenty v celej aplikácii
- **Prečo:**
  - Umožňuje používať `<DataGrid>` a `<ListBox>` v akejkoľvek Vue template bez opakovaného importovania
  - Načíta potrebné štýly pre správne zobrazenie komponentov
  - Pinia store je potrebná pre state management gridov a listboxov
- **Poznámky:** Globálna registrácia je voliteľná - komponenty môžu byť importované aj lokálne v jednotlivých súboroch

```javascript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import RPA-WEB-UI components and styles
import { DataGrid, ListBox } from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const app = createApp(App)
app.use(createPinia())

// Register components globally (optional)
app.component('DataGrid', DataGrid)
app.component('ListBox', ListBox)

app.mount('#app')
```

---

## DataGrid - Základné Použitie

### Minimálna Konfigurácia

**Kontext:**
- **Čo robí:** Vytvorí základný DataGrid s troma stĺpcami a najpoužívanejšími funkciami
- **Vstup:**
  - `columns`: Array definícií stĺpcov (názov, header text, šírka, možnosti triedenia/filtrovania)
  - `config`: Objekt s konfiguráciou gridu (veľkosť stránky, validácia, číslovanie riadkov)
  - `grid-id`: Unikátny identifikátor gridu pre store management
- **Výstup:** Funkčný dátový grid s možnosťou triedenia, filtrovania a validácie
- **Prečo:**
  - `ref="gridRef"` umožňuje prístup k API metódam gridu (validation, copy/paste, atď.)
  - `isSortable: true` aktivuje možnosť triediť stĺpce kliknutím na header
  - `isFilterable: true` umožňuje filtrovanie hodnôt v stĺpci
  - `pageSize: 50` obmedzuje počet zobrazených riadkov na stránku pre výkon
  - `enableValidation` a `autoValidate` aktivujú automatickú validáciu pri editácii
  - `showRowNumber` a `showCheckbox` pridávajú pomocné stĺpce pre UX
- **Poznámky:** Toto je minimálne nastavenie - grid podporuje oveľa viac možností (lazy loading, custom renderers, atď.)

```vue
<template>
  <DataGrid
    :columns="columns"
    :config="config"
    grid-id="my-grid"
    ref="gridRef"
  />
</template>

<script setup>
import { ref } from 'vue'
import { DataGrid } from 'rpa-web-ui'

const columns = ref([
  { name: 'name', header: 'Name', width: 150, isSortable: true, isFilterable: true },
  { name: 'email', header: 'Email', width: 200, isSortable: true },
  { name: 'age', header: 'Age', width: 80, isSortable: true }
])

const config = ref({
  pageSize: 50,
  enableValidation: true,
  autoValidate: true,
  showRowNumber: true,
  showCheckbox: true
})

const gridRef = ref()
</script>
```

### Načítanie Dát

**Kontext:**
- **Čo robí:** Načíta dátové riadky do DataGrid store a zobrazí ich v gride
- **Vstup:**
  - `gridId` ('my-grid'): Identifikátor gridu pre získanie správneho store
  - Array objektov s dátami, kde kľúče odpovedajú názvom stĺpcov
- **Výstup:** Naplnený grid s dvoma riadkami dát, každý riadok má bunky podľa definície stĺpcov
- **Prečo:**
  - `useDataGridStore('my-grid')()` je factory pattern - vytvorí/získa existujúci store pre daný grid ID
  - `loadRows()` konvertuje plain objekty na internú štruktúru `GridRow` s `GridCell` prvkami
  - Automaticky preskočí prázdne riadky a inicializuje validation state
- **Poznámky:** Dáta môžu byť načítané z API, lokálneho storage alebo staticky. Store je reaktívny (Pinia), takže zmeny sa okamžite prejavia v UI

```javascript
import { useDataGridStore } from 'rpa-web-ui'

const store = useDataGridStore('my-grid')()

// Načítať dáta
store.loadRows([
  { name: 'John Doe', email: 'john@example.com', age: 30 },
  { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
])
```

### Validácia

**Kontext:**
- **Čo robí:** Pridáva validačné pravidlá na stĺpce a validuje všetky bunky v gride
- **Vstup:**
  - Validačné pravidlá s typom (Regex, Range, Required, atď.)
  - Špecifické parametre pre každý typ pravidla (regex pattern, min/max hodnoty)
  - Chybová správa a severity level (Error, Warning, Info)
- **Výstup:**
  - Vizuálne označenie nevalidných buniek (červené/žlté pozadie podľa severity)
  - Validation result s flagom `isValid` a počtom chýb
- **Prečo:**
  - **Regex validácia** pre formát emailu zabezpečuje správny formát emailovej adresy
  - **Range validácia** pre vek kontroluje, či je hodnota v rozumnom rozsahu
  - `severity: 'Error'` vs `'Warning'` určuje vizuálny štýl a kritickosť
  - `validateAll()` je async operácia, ktorá prejde všetky bunky a aplikuje príslušné pravidlá
- **Poznámky:**
  - Validácia môže byť automatická (pri každej zmene bunky ak `autoValidate: true`)
  - Podporované typy: Regex, Range, Required, Custom, Email, UniqueInColumn
  - Validation errors sú uložené v store a viazané na konkrétne bunky

```javascript
// Pridať validation rules
gridRef.value.validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Regex',
  regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
  errorMessage: 'Invalid email format',
  severity: 'Error'
})

gridRef.value.validation.addValidationRule({
  columnName: 'age',
  ruleType: 'Range',
  minValue: 18,
  maxValue: 120,
  errorMessage: 'Age must be between 18 and 120',
  severity: 'Warning'
})

// Validovať všetky bunky
const result = await gridRef.value.validation.validateAll(store.rows)
console.log(`Valid: ${result.isValid}, Errors: ${result.totalErrors}`)
```

### Copy/Paste

**Kontext:**
- **Čo robí:** Kopíruje/vkladá dáta medzi gridmi alebo s Excelom pomocou clipboard API
- **Vstup:**
  - Pre copy: Aktuálne vybraté bunky v gride
  - Pre paste: Dáta v clipboard (tab-separated values pre stĺpce, newline pre riadky)
- **Výstup:**
  - Copy: TSV formátovaný text v clipboard (kompatibilný s Excel)
  - Paste: Aktualizované bunky v gride s dátami zo clipboard
- **Prečo:**
  - Umožňuje rýchlu výmenu dát medzi RPA gridmi a Excel/Google Sheets
  - `handleCopy()` automaticky detekuje vybraté bunky a formatuje ich do TSV
  - `handlePaste()` parsuje TSV dáta a distribuuje ich do buniek od aktuálne aktívnej bunky
  - Zachováva formátovanie (čísla, dátumy) pri prenose
- **Poznámky:**
  - Vyžaduje clipboard permissions v prehliadači
  - Podporuje multi-cell selection a paste cez viacero riadkov/stĺpcov
  - Automaticky triggeruje validáciu po paste (ak je `autoValidate: true`)

```javascript
// Copy selected cells (Ctrl+C)
await gridRef.value.handleCopy()

// Paste from clipboard (Ctrl+V)
await gridRef.value.handlePaste()
```

### Auto Row Height

**Kontext:**
- **Čo robí:** Zapína/vypína automatickú výšku riadkov podľa obsahu buniek
- **Vstup:** Aktuálny stav `isAutoRowHeightEnabled` zo store
- **Výstup:**
  - Pri zapnutí: Riadky sa prispôsobia výške najvyššej bunky v riadku
  - Pri vypnutí: Všetky riadky sa vrátia na default výšku
- **Prečo:**
  - Užitočné pre bunky s dlhým textom alebo multiline obsahom
  - `applyAutoRowHeightToAll()` meria skutočnú výšku DOM elementov a nastavuje inline style
  - `resetAllRowHeights()` odstráni custom výšky a vráti default hodnotu
  - Je async kvôli čakaniu na DOM updates (nextTick)
- **Poznámky:**
  - Môže ovplyvniť výkon pri veľkom počte riadkov
  - Výška sa prepočítava pri zmene obsahu bunky
  - Funguje s virtuálnym scrollingom

```javascript
// Toggle auto row height
const toggleAutoHeight = async () => {
  const newValue = !store.isAutoRowHeightEnabled
  store.setAutoRowHeightEnabled(newValue)

  if (newValue) {
    await gridRef.value.applyAutoRowHeightToAll()
  } else {
    await gridRef.value.resetAllRowHeights()
  }
}
```

### Backend Integration

**Kontext:**
- **Čo robí:** Komunikuje s backend API pre načítanie a uloženie dát gridu
- **Vstup:**
  - Pre load: API endpoint vracia dáta v formáte `{ success: boolean, data: Array }`
  - Pre save: Transformované dáta z grid store do plain objektov
- **Výstup:**
  - Load: Naplnený store s dátami z backendu
  - Save: Potvrdenie o uložení dát na server
- **Prečo:**
  - `gridApi` je centralizovaný service pre všetky backend operácie gridu
  - `getData()` volá GET endpoint a vracia štandardizovanú odpoveď
  - `importData()` volá POST endpoint s payload obsahujúcim grid dáta
  - Transformácia z `GridRow[]` na plain objekty je nutná pre backend kompatibilitu
  - `.find()` s `?.value` bezpečne extrahuje hodnoty buniek (handling null/undefined)
- **Poznámky:**
  - API endpointy sú konfigurovateľné v gridApi service
  - Podporuje error handling a loading states
  - Môže byť rozšírené o authentication headers

```javascript
import { gridApi } from 'rpa-web-ui'

// Load data from backend
const response = await gridApi.getData()
if (response.success) {
  store.loadRows(response.data)
}

// Save data to backend
const data = store.rows.map(row => ({
  name: row.cells.find(c => c.columnName === 'name')?.value,
  email: row.cells.find(c => c.columnName === 'email')?.value,
  age: row.cells.find(c => c.columnName === 'age')?.value
}))

const saveResponse = await gridApi.importData(data)
```

---

## ListBox - Základné Použitie

### Single Select Mode

**Kontext:**
- **Čo robí:** Vytvorí ListBox komponent s možnosťou vybrať jednu položku zo zoznamu
- **Vstup:**
  - `items`: Array objektov s `value` (unikátny ID) a `label` (zobrazený text)
  - `config`: Konfigurácia s `allowMultiple: false` pre single select režim
  - Optional `disabled: true` na item deaktivuje možnosť výberu
- **Výstup:**
  - Vizuálny listbox s možnosťou filtrovania a resetovania výberu
  - Event `selectionChange` s array obsahujúcim vybraté hodnoty (v single mode max 1 prvok)
- **Prečo:**
  - `allowMultiple: false` zabezpečuje, že iba jedna položka môže byť vybraná naraz
  - `showSearchBar: true` pridáva vyhľadávacie pole pre filtrovanie položiek
  - `showResetButton: true` zobrazuje tlačidlo na vymazanie výberu
  - `disabled: true` na item zabráni jeho výberu (napr. pre neaktívne možnosti)
  - Event handler `handleSelectionChange` reaguje na zmenu výberu
- **Poznámky:**
  - Single select je ideálny pre dropdown-like výber (napr. výber kategórie, štátu)
  - Selected values je vždy array aj v single mode (konzistentné API)

```vue
<template>
  <ListBox
    :items="items"
    :config="config"
    @selectionChange="handleSelectionChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ListBox } from 'rpa-web-ui'

const items = ref([
  { value: '1', label: 'Item 1' },
  { value: '2', label: 'Item 2' },
  { value: '3', label: 'Item 3', disabled: true }
])

const config = ref({
  allowMultiple: false,  // Single select
  showSearchBar: true,
  showResetButton: true
})

function handleSelectionChange(selectedValues) {
  console.log('Selected:', selectedValues)
}
</script>
```

### Multi Select Mode

**Kontext:**
- **Čo robí:** Nastaví ListBox do režimu viacnásobného výberu
- **Vstup:**
  - `config` s `allowMultiple: true` pre multi-select
  - `preselectedValues`: Array hodnôt pre pred-vybrané položky
- **Výstup:** ListBox, kde používateľ môže vybrať viacero položiek naraz (checkboxy)
- **Prečo:**
  - `allowMultiple: true` mení správanie z radio buttons na checkboxy
  - `preselectedValues` nastaví východzí stav výberu (napr. po načítaní uložených nastavení)
  - Užitočné pre výber viacerých kategórií, tagov, permissions, atď.
- **Poznámky:**
  - V multi-mode event `selectionChange` emituje array s viacerými hodnotami
  - Podržanie Ctrl/Cmd umožňuje výber viacerých položiek v UI

```vue
<script setup>
const config = ref({
  allowMultiple: true,  // Multi select
  showSearchBar: true,
  showResetButton: true
})

const preselectedValues = ref(['1', '3'])  // Pre-select items
</script>
```

---

## Témovanie

### Custom DataGrid Theme

**Kontext:**
- **Čo robí:** Prispôsobuje farebné schémy a vizuálny štýl DataGrid komponentu
- **Vstup:** Objekt `customTheme` s partial definíciou `DataGridTheme` (stačí definovať iba požadované farby)
- **Výstup:** Grid s custom farbami pre bunky, header a validation states
- **Prečo:**
  - **cellColors** - ovláda vizuál bežných buniek (default, hover, selected states)
  - **headerColors** - štýluje header row (background, text color, sort indicators)
  - **validationColors** - definuje farby pre error/warning/info stavy buniek
  - Umožňuje prispôsobiť grid firemnej farebnej schéme alebo dark mode
  - Theme je reactive - zmena `customTheme` sa okamžite prejaví v UI
- **Poznámky:**
  - Je to `Partial<DataGridTheme>` - stačí definovať iba farby, ktoré chcete zmeniť
  - Ostatné farby sa použijú z default theme
  - Podporuje HEX, RGB, HSL formáty farieb

```vue
<template>
  <DataGrid
    :columns="columns"
    :theme="customTheme"
  />
</template>

<script setup>
const customTheme = {
  cellColors: {
    defaultBackground: '#ffffff',
    hoverBackground: '#f0f0f0',
    selectedBackground: '#e3f2fd'
  },
  headerColors: {
    background: '#263238',
    foreground: '#ffffff',
    sortIndicatorColor: '#00bcd4'
  },
  validationColors: {
    errorBackground: '#ffebee',
    errorBorder: '#f44336',
    errorForeground: '#c62828'
  }
}
</script>
```

### Custom ListBox Theme

**Kontext:**
- **Čo robí:** Prispôsobuje farebné schémy ListBox komponentu
- **Vstup:** Objekt `customListBoxTheme` s farbami pre container a položky
- **Výstup:** ListBox s custom farbami pre background, text a selected states
- **Prečo:**
  - **containerBackground** - farba pozadia celého listboxu
  - **itemForeground** - farba textu bežných (nevybraných) položiek
  - **itemSelectedBackground** - farba pozadia vybranej položky
  - **itemSelectedForeground** - farba textu vybranej položky
  - Umožňuje konzistentnú vizuálnu identitu s DataGrid alebo firemnou CI
- **Poznámky:**
  - Theme je `Partial<ListBoxTheme>` - definujte iba požadované farby
  - Podporuje dark/light mode prepínanie zmenou theme objektu

```vue
<template>
  <ListBox
    :items="items"
    :theme="customListBoxTheme"
  />
</template>

<script setup>
const customListBoxTheme = {
  containerBackground: '#263238',
  itemForeground: '#ffffff',
  itemSelectedBackground: '#00bcd4',
  itemSelectedForeground: '#000000'
}
</script>
```

---

## Najčastejšie Úlohy

### 1. Pridať Nový Riadok

**Kontext:**
- **Čo robí:** Vkladá nové prázdne riadky do gridu
- **Vstup:**
  - `insertRow(rowId)`: ID riadku, za ktorý sa vloží nový riadok
  - `insertMultipleRows(rowId, count, position)`: ID, počet riadkov, pozícia ('above'/'below')
- **Výstup:** Nové prázdne riadky v gride s vygenerovanými unikátnymi rowId
- **Prečo:**
  - Umožňuje používateľom pridávať dáta do gridu manuálne
  - `insertRow()` pridá jeden riadok za špecifikovaným riadkom
  - `insertMultipleRows()` efektívne pridá viacero riadkov naraz (lepší výkon ako loop)
  - Nové bunky sú inicializované s `null` hodnotami
- **Poznámky:**
  - Store automaticky aktualizuje UI cez reactivity
  - Nové riadky sú validovateľné (ak sú pravidlá definované)

```javascript
store.insertRow('last-row-id')  // Insert after specific row
store.insertMultipleRows('row-id', 5, 'below')  // Insert 5 rows
```

### 2. Vymazať Riadok

**Kontext:**
- **Čo robí:** Odstráni riadok z gridu na základe jeho ID
- **Vstup:** `rowId` - unikátny identifikátor riadku na vymazanie
- **Výstup:** Riadok je odstránený zo store a UI sa aktualizuje
- **Prečo:**
  - Umožňuje používateľom odstrániť nechcené záznamy
  - Aktualizuje row numbering ostatných riadkov
  - Vyčistí asociované validation errors pre vymazaný riadok
- **Poznámky:**
  - Operácia je okamžitá - pre undo funkcionalitu je potrebné uchovať kópiu
  - Po vymazaní sa aktualizujú indexy virtuálneho scrollingu

```javascript
store.deleteRow('row-id')
```

### 3. Aktualizovať Hodnotu Bunky

**Kontext:**
- **Čo robí:** Zmení hodnotu konkrétnej bunky v gride
- **Vstup:**
  - `rowId`: ID riadku
  - `columnName`: Názov stĺpca
  - `newValue`: Nová hodnota (akýkoľvek typ)
- **Výstup:** Bunka s aktualizovanou hodnotou, automatická validácia (ak je `autoValidate: true`)
- **Prečo:**
  - Programatické aktualizovanie hodnôt (napr. po API call, kalkulácia)
  - Trigger automatickú validáciu na bunke
  - Označí riadok ako "modified" pre tracking zmien
- **Poznámky:**
  - Aktualizácia je reactive - UI sa okamžite updatne
  - Podporuje všetky dátové typy (string, number, boolean, object)

```javascript
store.updateCell('row-id', 'email', 'newemail@example.com')
```

### 4. Radenie

**Kontext:**
- **Čo robí:** Aplikuje triedenie riadkov podľa hodnôt v stĺpcoch
- **Vstup:**
  - `columnName`: Názov stĺpca na triedenie
  - `direction`: 'asc' (vzostupne) alebo 'desc' (zostupne)
  - `multiSort`: `false` pre single sort (nahradí existujúce), `true` pre multi-column sort (pridá ďalší level)
- **Výstup:** Preusporiadané riadky v gride podľa sort kritérií
- **Prečo:**
  - **Single sort** - triedi iba podľa jedného stĺpca (najbežnejší prípad)
  - **Multi sort** - umožňuje hierarchické triedenie (napr. najprv podľa mena, potom podľa veku)
  - `clearSort()` odstráni všetky sort kritériá a vráti pôvodné poradie
  - Sorting je optimalizovaný pre veľké datasety
- **Poznámky:**
  - Multi-sort sa aplikuje v poradí volania (prvý `addSort` je primárny, druhý sekundárny, atď.)
  - Sort pracuje na filtered dátach (ak je filter aktívny)
  - Podporuje custom comparator functions pre špecifické sort logiky

```javascript
// Single column sort
store.addSort('name', 'asc', false)

// Multi column sort
store.addSort('name', 'asc', true)
store.addSort('age', 'desc', true)

// Clear sort
store.clearSort()
```

### 5. Filtrovanie

**Kontext:**
- **Čo robí:** Filtruje riadky gridu na základe podmienok aplikovaných na stĺpce
- **Vstup:**
  - **Simple filter**: Jednoduchá podmienka (stĺpec, operátor, hodnota)
  - **Composite filter**: Komplexná podmienka kombinujúca viacero simple filters cez AND/OR operátory
- **Výstup:** Grid zobrazuje iba riadky spĺňajúce filter kritériá
- **Prečo:**
  - **Simple filter** - rýchle filtrovanie podľa jednej podmienky (napr. vek > 25)
  - **Composite filter** - pokročilé filtrovanie s logickými operátormi (napr. vek > 25 AND meno obsahuje "John")
  - Podporované operátory: Equals, NotEquals, Contains, StartsWith, EndsWith, GreaterThan, LessThan, atď.
  - `clearFilter()` odstráni filter a zobrazí všetky riadky
  - Filter je kombinovateľný so sorting
- **Poznámky:**
  - Composite filter môže byť ľubovoľne vnorený (left/right môžu byť tiež composite)
  - Filter nemaže dáta, iba skrýva riadky z view
  - Filtering je case-insensitive pre string operátory (konfigurovateľné)

```javascript
// Simple filter
const filter = {
  type: 'simple',
  columnName: 'age',
  operator: 'GreaterThan',
  value: 25
}
store.setFilter(filter)

// Composite filter (AND)
const filter = {
  type: 'composite',
  left: {
    type: 'simple',
    columnName: 'age',
    operator: 'GreaterThan',
    value: 25
  },
  right: {
    type: 'simple',
    columnName: 'name',
    operator: 'Contains',
    value: 'John'
  },
  operator: 'AND'
}
store.setFilter(filter)

// Clear filter
store.clearFilter()
```

### 6. Vyhľadávanie

**Kontext:**
- **Čo robí:** Vyhľadáva text v bunkách gridu a umožňuje navigáciu medzi výsledkami
- **Vstup:**
  - `useSearch(rowsRef)`: Composable prijíma reactive ref na riadky gridu
  - `searchInRows(query, mode, options)`: Vyhľadávací text, režim, nastavenia
- **Výstup:**
  - Označené bunky obsahujúce hľadaný text
  - Navigácia medzi nájdenými výsledkami
  - Počítadlo výsledkov (napr. "3 of 15 results")
- **Prečo:**
  - **useSearch composable** poskytuje reusable search funkcionalitu
  - `searchInRows()` prehľadáva všetky bunky a označí matches
  - `mode: 'Contains'` umožňuje partial match (podporuje aj 'Equals', 'StartsWith', 'EndsWith')
  - `caseSensitive: false` ignoruje veľké/malé písmená
  - `goToNextResult()/goToPreviousResult()` scrolluje grid na ďalší/predošlý výsledok
  - `clearSearch()` odstráni highlighting a resetuje stav
- **Poznámky:**
  - Search funguje na aktuálne zobrazených riadkoch (rešpektuje filter)
  - Podporuje keyboard shortcuts (Ctrl+F, Enter pre next, Shift+Enter pre previous)
  - Search results sú reactive - aktualizujú sa pri zmene dát

```javascript
import { useSearch } from 'rpa-web-ui'

const search = useSearch(toRef(store, 'rows'))

// Search with contains mode
search.searchInRows('john', 'Contains', { caseSensitive: false })

// Navigate results
search.goToNextResult()
search.goToPreviousResult()

// Clear search
search.clearSearch()
```

### 7. Exportovať Dáta

**Kontext:**
- **Čo robí:** Exportuje dáta z gridu do plain JavaScript objektov (vhodné pre JSON, CSV, API call)
- **Vstup:** `store.rows` - všetky riadky v gride
- **Výstup:** Array plain objektov kde kľúče sú názvy stĺpcov a hodnoty sú cell values
- **Prečo:**
  - **filter()** - odstráni úplne prázdne riadky (aspoň jedna bunka musí mať hodnotu)
  - `.some(c => c.value !== null && c.value !== '')` kontroluje, či má riadok nejakú hodnotu
  - **map()** - transformuje z `GridRow` štruktúry na plain objekt
  - `forEach` iteruje cez bunky a extrahuje hodnoty podľa column name
  - Výstup je kompatibilný s `JSON.stringify()` pre uloženie/prenos
- **Poznámky:**
  - Zachováva iba visible columns (môže byť rozšírené na všetky columns)
  - Ignoruje metadata ako rowId, validation errors, atď.
  - Výstup môže byť použitý pre backend API, Excel export, CSV generovanie

```javascript
// Get all data (excluding empty rows)
const exportData = store.rows
  .filter(row => row.cells.some(c => c.value !== null && c.value !== ''))
  .map(row => {
    const rowData = {}
    row.cells.forEach(cell => {
      rowData[cell.columnName] = cell.value
    })
    return rowData
  })

console.log(JSON.stringify(exportData, null, 2))
```

### 8. Checkbox Selection

**Kontext:**
- **Čo robí:** Spravuje stav checkboxov pri riadkoch gridu pre bulk operations
- **Vstup:**
  - `toggleCheckbox(rowId, state)`: ID riadku a desired stav (true/false)
  - `toggleAllCheckboxes()`: Toggle všetkých checkboxov (check all ak nie sú všetky checked, inak uncheck all)
- **Výstup:**
  - Vizuálne zaškrtnuté/odškrtnuté checkboxy v gride
  - Set checked row IDs dostupné cez `store.checkedRows`
- **Prečo:**
  - Umožňuje bulk operácie (delete multiple rows, export selected, atď.)
  - `toggleCheckbox()` nastaví checkbox state konkrétneho riadku
  - `toggleAllCheckboxes()` efektívne zaškrtne/odškrtne všetky riadky naraz
  - `store.checkedRows` je Set<string> obsahujúci IDs zaškrtnutých riadkov
  - `isRowChecked()` helper metóda kontroluje, či je riadok zaškrtnutý
  - `filter()` s `isRowChecked()` extrahuje kompletné row objekty pre ďalšie spracovanie
- **Poznámky:**
  - Checkbox state je perzistentný cez filter/sort operácie
  - Checkbox column sa zobrazuje iba ak `config.showCheckbox: true`

```javascript
// Check specific row
store.toggleCheckbox('row-id', true)

// Check all rows
store.toggleAllCheckboxes()

// Get checked rows
const checkedRowIds = store.checkedRows
const checkedRows = store.rows.filter(r => store.isRowChecked(r.rowId))
```

### 9. Hide/Show Columns

**Kontext:**
- **Čo robí:** Dynamicky skrýva/zobrazuje stĺpce a prispôsobuje ich šírku
- **Vstup:**
  - `updateColumn(columnName, updates)`: Názov stĺpca a partial update objekt
  - `handleAutoFitColumn(columnName)`: Názov stĺpca pre auto-fit
- **Výstup:**
  - Skryté/zobrazené stĺpce v gride
  - Automaticky prispôsobená šírka stĺpca podľa obsahu
- **Prečo:**
  - `isVisible: false/true` ovláda viditeľnosť stĺpca bez odstránenia dát
  - Užitočné pre customizáciu view (napr. skryť menej dôležité stĺpce)
  - Hidden columns panel umožňuje používateľovi znovu zobraziť skryté stĺpce
  - `handleAutoFitColumn()` meria šírku obsahu všetkých buniek v stĺpci a nastaví optimálnu šírku
  - Auto-fit berie do úvahy header text aj cell content
- **Poznámky:**
  - Hidden columns sú stále v dátach, iba nie sú renderované
  - Auto-fit je async operácia (meria DOM elementy)
  - `updateColumn()` môže aktualizovať aj iné vlastnosti (width, isSortable, atď.)

```javascript
// Hide column
store.updateColumn('email', { isVisible: false })

// Show column
store.updateColumn('email', { isVisible: true })

// Auto-fit column width
gridRef.value.handleAutoFitColumn('name')
```

### 10. Get Validation Errors

**Kontext:**
- **Čo robí:** Získava validation errors pre konkrétny riadok alebo kontroluje validitu celého gridu
- **Vstup:**
  - `getValidationErrors(rowId)`: ID riadku pre získanie jeho validation errors
  - `areNonEmptyRowsValid()`: Žiadne vstupy - kontroluje všetky neprázdne riadky
- **Výstup:**
  - Array `ValidationError` objektov s detailmi o chybách
  - Boolean flag či sú všetky neprázdne riadky validné
- **Prečo:**
  - `getValidationErrors()` vracia všetky validation errors pre daný riadok
  - Každý error obsahuje `columnName`, `message`, `severity` (Error/Warning/Info)
  - Užitočné pre zobrazenie error summary alebo custom error handling
  - `areNonEmptyRowsValid()` kontroluje, či grid môže byť uložený/odoslaný
  - Ignoruje prázdne riadky (iba validuje riadky s nejakými dátami)
- **Poznámky:**
  - Errors sú uložené v store a automaticky aktualizované pri validácii
  - Severity level určuje vizuálny feedback (Error = červená, Warning = žltá, Info = modrá)
  - Môže byť použité pre blocking save operations (ak existujú Error level chyby)

```javascript
// Get errors for specific row
const errors = gridRef.value.validation.getValidationErrors('row-id')
errors.forEach(err => {
  console.log(`${err.columnName}: ${err.message} (${err.severity})`)
})

// Check if all non-empty rows are valid
const isValid = store.areNonEmptyRowsValid()
```

---

## Props Reference

### DataGrid Props

**Kontext:**
- **Čo robí:** Definuje všetky props (vlastnosti) podporované DataGrid komponentom
- **Vstup:** TypeScript interface pre type-safe konfiguráciu DataGrid
- **Prečo:**
  - **config** - hlavná konfigurácia (validation, pagination, atď.)
  - **columns** - definícia stĺpcov (názvy, šírky, sortovanie)
  - **gridId** - unikátny ID pre multi-grid scenáre (auto-generated ak nie je poskytnutý)
  - **theme** - custom farebná schéma (Partial = voliteľné properties)
  - **minTableWidth** - minimálna šírka tabuľky v px
  - **width/height** - rozmery grid containeru (podporuje px, %, vh, atď.)
  - **autoRowHeightEnabled** - zapína auto-výšku riadkov pri inicializácii
  - **minRows** - minimálny počet prázdnych riadkov na začiatku
  - **showHiddenColumnsPanel** - zobrazuje panel pre un-hide skrytých stĺpcov
  - **enableHideColumn** - povoluje používateľovi skrývať stĺpce cez context menu
  - **enableAutoFit** - povoluje auto-fit šírky stĺpcov
- **Poznámky:** Všetky props sú voliteľné (majú default hodnoty)

```typescript
{
  config?: GridConfig
  columns?: GridColumn[]
  gridId?: string  // Default: auto-generated
  theme?: Partial<DataGridTheme>
  minTableWidth?: number
  width?: string  // Default: "100%"
  height?: string  // Default: "800px"
  autoRowHeightEnabled?: boolean  // Default: false
  minRows?: number  // Default: 5
  showHiddenColumnsPanel?: boolean  // Default: true
  enableHideColumn?: boolean  // Default: true
  enableAutoFit?: boolean  // Default: true
}
```

### ListBox Props

**Kontext:**
- **Čo robí:** Definuje všetky props podporované ListBox komponentom
- **Vstup:** TypeScript interface pre type-safe konfiguráciu ListBox
- **Prečo:**
  - **items** - POVINNÉ: Array položiek na zobrazenie (value + label)
  - **config** - konfigurácia správania (allowMultiple, showSearchBar, atď.)
  - **theme** - custom farebná schéma
  - **preselectedValues** - array hodnôt pre predvýber (napr. ['1', '3'])
  - **listBoxId** - unikátny ID pre backend integráciu (loading/saving selection)
- **Poznámky:**
  - Iba `items` je povinný prop
  - Ostatné props majú rozumné default hodnoty

```typescript
{
  items: ListBoxItem[]
  config?: ListBoxConfig
  theme?: Partial<ListBoxTheme>
  preselectedValues?: string[]
  listBoxId?: string  // For backend integration
}
```

---

## Events Reference

### DataGrid Events
DataGrid neemituje eventy - všetko cez API (defineExpose).

### ListBox Events

**Kontext:**
- **Čo robí:** Event emitovaný ListBox komponentom pri zmene výberu
- **Vstup:**
  - Používateľská interakcia (kliknutie na položku, search, reset)
- **Výstup:**
  - `selectedValues`: Array stringov - hodnoty aktuálne vybraných položiek
  - V single-select mode obsahuje max 1 prvok
  - V multi-select mode môže obsahovať viacero prvkov
- **Prečo:**
  - Umožňuje parent komponentu reagovať na zmeny výberu
  - Synchronizácia s external state (napr. formulár, API)
  - Triggered pri každej zmene (select, deselect, reset)
- **Poznámky:**
  - Event sa emituje aj keď je výber prázdny (empty array)
  - Možno použiť s v-model pattern

```typescript
{
  selectionChange: (selectedValues: string[]) => void
}
```

---

## API Reference (Exposed Methods)

### DataGrid API

**Kontext:**
- **Čo robí:** Definuje public API DataGrid komponentu prístupné cez template ref
- **Vstup:** Prístup cez `gridRef.value` v parent komponente
- **Výstup:** Objekt s metódami a properties pre programatickú kontrolu gridu
- **Prečo:**
  - **Backend metódy** - `loadDataFromBackend()` načíta dáta zo servera
  - **Validation API** - komplexný validačný systém (pridávanie pravidiel, validácia, error handling)
  - **Copy/Paste API** - Excel-kompatibilné operácie pre výmenu dát
  - **Handlers** - priame handlery pre keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+X)
  - **State access** - `isGridReady` flag a `store` pre priamy prístup k Pinia state
  - **Column management** - dynamické získavanie/nastavovanie stĺpcov
- **Použitie:**
  ```vue
  <DataGrid ref="gridRef" />
  <script setup>
  const gridRef = ref()
  // Použitie API: await gridRef.value.validation.validateAll()
  </script>
  ```
- **Poznámky:**
  - API je dostupné len po `isGridReady === true`
  - Validation a copyPaste sú vnorené objekty s vlastnými metódami
  - Store poskytuje priamy prístup k rows, columns, selection, filter state

```typescript
{
  // Backend
  loadDataFromBackend: () => Promise<void>

  // Validation
  validation: {
    validateRequired: () => Promise<boolean>
    isAllValid: () => boolean
    validateAll: (rows?) => Promise<{ isValid: boolean; totalErrors: number }>
    addValidationRule: (rule: ValidationRule) => void
    getValidationErrors: (rowId: string) => ValidationError[]
    clearValidationErrors: () => void
  }

  // Copy/Paste
  copyPaste: {
    copyToClipboard: (rows, cols, options) => Promise<Result>
    copySelectedCells: (selected, rows, cols) => Promise<Result>
    pasteFromClipboard: () => Promise<Result>
  }

  // Handlers
  handleCopy: () => Promise<void>
  handlePaste: () => Promise<void>
  handleCut: () => Promise<void>

  // State
  isGridReady: Ref<boolean>
  store: DataGridStore

  // Columns
  getColumns: () => GridColumn[]
  setColumns: (columns: GridColumn[]) => void
}
```

### ListBox API

**Kontext:**
- **Čo robí:** Definuje public API ListBox komponentu pre programatickú manipuláciu výberu
- **Vstup:** Prístup cez `listBoxRef.value` v parent komponente
- **Výstup:** Objekt s metódami pre ovládanie výberu položiek
- **Prečo:**
  - **clearSelection()** - Vymaže všetky vybrané položky (reset do initial state)
  - **getSelectedValues()** - Vráti array aktuálne vybraných hodnôt (string[])
  - **selectValue(value)** - Programaticky vyberie položku podľa hodnoty
- **Použitie:**
  ```vue
  <ListBox ref="listBoxRef" :items="items" />
  <script setup>
  const listBoxRef = ref()
  // Programatické ovládanie
  listBoxRef.value.selectValue('item-1')
  const selected = listBoxRef.value.getSelectedValues()
  listBoxRef.value.clearSelection()
  </script>
  ```
- **Poznámky:**
  - V single-select mode `selectValue()` nahradí existujúci výber
  - V multi-select mode `selectValue()` pridá k existujúcemu výberu
  - `getSelectedValues()` vracia empty array ak nič nie je vybrané

```typescript
{
  clearSelection: () => void
  getSelectedValues: () => string[]
  selectValue: (value: string) => void
}
```

---

## Performance Tips

### 1. Použiť Map-based Lookup

**Kontext:**
- **Čo robí:** Porovnáva výkon array `.find()` vs Map-based lookup pre získanie riadku
- **Vstup:** `rowId` - ID hľadaného riadku
- **Výstup:** `GridRow` objekt
- **Prečo:**
  - **Array.find()** má O(n) zložitosť - musí iterovať cez všetky riadky až kým nenájde match
  - Pri 1000+ riadkoch to znamená potenciálne 1000 iterácií
  - **store.getRow()** používa internú Map štruktúru s O(1) lookup - konštantný čas bez ohľadu na počet riadkov
  - Map má instant access cez hash-based key lookup
  - Pri veľkých datasetoch je rozdiel vo výkone dramatický
- **Poznámky:**
  - Vždy preferujte `store.getRow()` pre single row access
  - Array.find() použite iba ak hľadáte podľa iného kritéria ako rowId

```javascript
// ❌ Pomalé (O(n))
const row = store.rows.find(r => r.rowId === rowId)

// ✅ Rýchle (O(1))
const row = store.getRow(rowId)
```

### 2. Batch Validation

**Kontext:**
- **Čo robí:** Optimalizuje validáciu tým, že validuje iba bunky ktoré to skutočne potrebujú
- **Vstup:**
  - `columnsWithRules`: Set stĺpcov, ktoré majú definované validation rules
  - `getCellsNeedingValidation(skipEmpty, columnSet)`: skipuje prázdne bunky a filtruje podľa stĺpcov
- **Výstup:** Filtrovaný zoznam buniek, ktoré potrebujú validáciu
- **Prečo:**
  - Nevaliduje stĺpce, ktoré nemajú žiadne validation rules (zbytočná práca)
  - `Set` poskytuje O(1) lookup pre kontrolu či stĺpec má pravidlá
  - Skipuje prázdne bunky (nie je dôvod validovať null hodnoty)
  - Redukuje počet validačných operácií o 50-90% v typických scenároch
  - Šetrí CPU cykly a zlepšuje responzívnosť UI
- **Poznámky:**
  - Vždy použite túto techniku pre bulk validation
  - Store má builtin metódy pre efektívnu validáciu

```javascript
// ✅ Validovať iba stĺpce s pravidlami
const columnsWithRules = new Set(['email', 'age'])
const cellsToValidate = store.getCellsNeedingValidation(true, columnsWithRules)
```

### 3. Lazy Rendering
DataGrid používa IntersectionObserver pre lazy rendering - automaticky optimalizované.

### 4. Debounced Operations

**Kontext:**
- **Čo robí:** Odkladá vykonanie search operácie až kým používateľ prestane písať
- **Vstup:**
  - `useDebounceFn()`: VueUse composable pre debouncing
  - Funkcia na debounce a delay v ms (300ms)
- **Výstup:** Debounced funkcia, ktorá sa vykoná iba po 300ms bez ďalšieho volania
- **Prečo:**
  - Bez debounce: search by sa spustil pri každom keystroke (napr. 10x pre slovo "javascript")
  - S debounce: search sa spustí iba raz po dokončení písania
  - Redukuje počet operácií o 90%+ pri rýchlom písaní
  - Zlepšuje performance a responzívnosť UI
  - Šetrí CPU a memory pri vyhľadávaní vo veľkých datasetoch
- **Poznámky:**
  - 300ms je sweet spot - cítiť responsive ale nie príliš agresívne
  - Použite debounce pre search, filter, auto-save operácie

```javascript
// Use debounced search
const debouncedSearch = useDebounceFn(() => {
  search.searchInRows(query, mode, options)
}, 300)
```

### 5. Avoid Empty Rows

**Kontext:**
- **Čo robí:** Automaticky filtruje prázdne riadky pri načítaní dát do gridu
- **Vstup:** Array dátových objektov (môže obsahovať prázdne riadky)
- **Výstup:** Grid iba s riadkami obsahujúcimi nejaké dáta
- **Prečo:**
  - Prázdne riadky zaberajú memory, zhoršujú rendering performance a nemajú žiadnu hodnotu
  - `loadRows()` automaticky filtruje objekty kde všetky hodnoty sú null/empty
  - Redukuje počet DOM elementov, zlepšuje scroll performance
  - Zmenšuje veľkosť store state
- **Poznámky:**
  - Grid stále umožňuje používateľovi pridávať prázdne riadky manuálne (cez insertRow)
  - Filter je aplikovaný automaticky - nemusíte robiť nič

```javascript
// loadRows() automaticky skipuje prázdne riadky
store.loadRows(data)  // Empty rows filtered out
```

---

## Typové Deklarácie

### Import Types

**Kontext:**
- **Čo robí:** Importuje TypeScript type definitions z RPA-WEB-UI knižnice
- **Vstup:** Type importy z npm balíčka
- **Výstup:** Type definitions dostupné v TypeScript súboroch pre type checking a IntelliSense
- **Prečo:**
  - **GridCell, GridRow, GridColumn** - core dátové štruktúry gridu
  - **GridConfig** - konfigurácia gridu (validation, pagination, atď.)
  - **ValidationRule, ValidationError** - typy pre validation system
  - **FilterExpression, SimpleFilter, CompositeFilter** - typy pre filtrovanie
  - **DataGridTheme, ListBoxTheme** - typy pre témovanie
  - `import type` je TypeScript optimalizácia - importuje iba typy (nie runtime kód)
  - Poskytuje autocomplete, type safety a compile-time error detection
- **Poznámky:**
  - Knižnica je plne typovaná - všetky API majú TypeScript definitions
  - Type imports nezväčšujú bundle size (compiled away)

```typescript
import type {
  GridCell,
  GridRow,
  GridColumn,
  GridConfig,
  ValidationRule,
  ValidationError,
  FilterExpression,
  SimpleFilter,
  CompositeFilter,
  DataGridTheme,
  ListBoxTheme
} from 'rpa-web-ui'
```

---

## Troubleshooting

### 1. Grid Neloaduje Dáta

**Kontext:**
- **Čo robí:** Zabezpečuje, že grid je plne inicializovaný pred načítaním dát
- **Problém:** `loadRows()` zavolaný príliš skoro (pred dokončením grid setup) môže zlyhať
- **Riešenie:**
  - `await gridRef.value.isGridReady` počká na dokončenie grid inicializácie
  - `isGridReady` je Promise, ktoré sa resolve-ne keď je grid pripravený
  - Po resolve môžete bezpečne volať `loadRows()`
- **Poznámky:** Toto je relevantné najmä pri loadovaní dát v `onMounted()` hook

```javascript
// Skontrolovať či je grid ready
await gridRef.value.isGridReady
store.loadRows(data)
```

### 2. Validation Nefunguje

**Kontext:**
- **Čo robí:** Debuguje prečo validácia nebeží
- **Problém:** Validácia môže byť vypnutá v config alebo môžu chýbať pravidlá
- **Riešenie:**
  - Skontrolujte `enableValidation: true` - masterswitch pre celú validáciu
  - Skontrolujte `autoValidate: true` - zapína automatickú validáciu pri zmenách
  - Vypíšte `validationRules` - overte, že ste pridali pravidlá cez `addValidationRule()`
- **Poznámky:** Bez pravidiel nebude validácia robiť nič (aj keď je enabled)

```javascript
// Skontrolovať config
store.config.enableValidation  // true?
store.config.autoValidate  // true?

// Skontrolovať rules
console.log(gridRef.value.validation.validationRules.value)
```

### 3. Copy/Paste Nefunguje

**Kontext:**
- **Čo robí:** Diagnostikuje clipboard permissions v prehliadači
- **Problém:** Clipboard API vyžaduje explicit permissions od používateľa
- **Riešenie:**
  - Skontrolujte clipboard-read permission pre paste operácie
  - Skontrolujte clipboard-write permission pre copy operácie
  - Permissions môžu byť denied - prehliadač zobrazí prompt používateľovi
  - HTTPS je vyžadované pre clipboard API (nefunguje na http://)
- **Poznámky:** V development mode použite localhost alebo HTTPS

```javascript
// Skontrolovať permissions
navigator.permissions.query({ name: 'clipboard-read' })
navigator.permissions.query({ name: 'clipboard-write' })
```

### 4. Auto Row Height Neaktualizuje

**Kontext:**
- **Čo robí:** Zabezpečuje, že DOM je plne updatnutý pred meraním výšok
- **Problém:** Auto row height meria DOM elementy - ak DOM nie je ready, výšky budú nesprávne
- **Riešenie:**
  - Multiple `await nextTick()` - Vue potrebuje 2-3 cykly pre kompletný DOM update
  - `setTimeout(50ms)` - extra buffer pre browser reflow/repaint
  - Takto zabezpečíte, že všetky bunky sú renderované a ich obsah je final
- **Poznámky:** Toto je edge case - väčšinou stačí jeden nextTick

```javascript
// Počkať na DOM update
await nextTick()
await nextTick()
await nextTick()
await new Promise(resolve => setTimeout(resolve, 50))
```

### 5. Theme Nefunguje

**Kontext:**
- **Čo robí:** Debuguje prečo custom theme nie je aplikovaná
- **Problém:** Chýbajúci CSS import alebo nesprávny type theme objektu
- **Riešenie:**
  - Importujte `'rpa-web-ui/dist/style.css'` v main.ts - obsahuje base štýly
  - Bez base CSS budú komponenty nefunkčné
  - Použite `Partial<DataGridTheme>` type - umožňuje partial overrides
  - Skontrolujte, že theme objekt má správnu štruktúru (cellColors, headerColors, atď.)
- **Poznámky:** Theme prop je reactive - zmeny sa okamžite prejavia

```javascript
// Importovať CSS
import 'rpa-web-ui/dist/style.css'

// Použiť Partial<DataGridTheme> pre custom theme
const theme: Partial<DataGridTheme> = {
  cellColors: { defaultBackground: '#ffffff' }
}
```

---

## Záver

RPA-WEB-UI je kompletná, production-ready knižnica pre prácu s dátovými gridmi a listboxmi vo Vue 3. Pre podrobnejšie informácie pozri jednotlivé MD súbory v dokumentácii.

**Ďalšie kroky:**
- Prečítať 01_PREHLAD_KNIZNICE.md pre celkový prehľad
- Prečítať 02_KOMPONENTY_DETAILNE.md pre detailnú dokumentáciu komponentov
- Prečítať 03_COMPOSABLES_DETAILNE.md pre composables
- Prečítať 04_STORES_A_SERVICES.md pre state management
- Prečítať 05_TYPES_A_INTERFACES.md pre type reference
