# RPA-WEB-UI - Kompletný Prehľad Knižnice

## Základné Informácie

**Názov:** rpa-web-ui
**Verzia:** 1.0.0
**Popis:** Advanced data grid and listbox components for Vue 3 with TypeScript support
**Licencia:** MIT
**Framework:** Vue 3 + TypeScript + Pinia

## Účel Knižnice

RPA-WEB-UI je pokročilá Vue 3 komponentová knižnica poskytujúca:
- **DataGrid** - Komplexný dátový grid s editáciou, validáciou, filtrovaním, radením
- **ListBox** - Zoznamový komponent s jednoduchým a viacnásobným výberom
- **Validačný systém** - Komplexná validácia dát s rôznymi pravidlami
- **Copy/Paste** - Excel-kompatibilná funkcionalita kopírovania/vkladania
- **Automatická výška riadkov** - Inteligentné prispôsobenie výšky podľa obsahu
- **Témovanie** - Plne prispôsobiteľné témy pre DataGrid aj ListBox

## Štruktúra Projektu

**Kontext:**
- **Čo robí:** Zobrazuje organizáciu súborov a priečinkov v RPA-WEB-UI knižnici
- **Účel:** Poskytuje prehľad o štruktúre kódbázy pre lepšiu orientáciu
- **Hlavné sekcie:**
  - **src/components/** - Vue 3 komponenty (DataGrid, ListBox a podporné UI komponenty)
  - **src/composables/** - Reusable composition functions pre business logiku (validation, search, copy/paste, atď.)
  - **src/stores/** - Pinia state management (centralizovaný store pre grid dáta)
  - **src/services/** - Služby pre backend komunikáciu (API volania)
  - **src/types/** - TypeScript type definitions a interfaces
  - **src/utils/** - Utility funkcie (theme helpers, formatters, atď.)
  - **src/index.ts** - Hlavný entry point knižnice (exportuje public API)
  - **dist/** - Kompilované build výstupy (ES modules, UMD, TypeScript declarations)
- **Poznámky:**
  - Štruktúra sleduje best practices Vue 3 Composition API
  - Separácia concerns - components, logic (composables), state (stores), types
  - Build system: Vite pre rýchly development a optimalizovaný production build

```
rpa-web-ui/
├── src/
│   ├── components/          # Vue komponenty
│   │   ├── DataGrid.vue           # Hlavný grid komponent
│   │   ├── DataGridHeader.vue     # Header gridu
│   │   ├── DataGridRow.vue        # Riadok gridu
│   │   ├── DataGridCell.vue       # Bunka gridu
│   │   ├── SpecialColumnCell.vue  # Špeciálne stĺpce (checkbox, delete, etc.)
│   │   ├── LazyRow.vue            # Lazy rendering pre riadky
│   │   ├── ListBox.vue            # ListBox komponent
│   │   ├── FilterFlyout.vue       # Filter dialóg
│   │   ├── FilterRow.vue          # Filter riadok
│   │   ├── PaginationControl.vue  # Pagination
│   │   └── SearchPanel.vue        # Vyhľadávací panel
│   ├── composables/         # Vue composables
│   │   ├── useValidation.ts       # Validačný systém
│   │   ├── useAutoRowHeight.ts    # Automatická výška riadkov
│   │   ├── useCopyPaste.ts        # Copy/Paste funkcionalita
│   │   ├── useFiltering.ts        # Filtrovanie dát
│   │   ├── useSearch.ts           # Vyhľadávanie
│   │   ├── useSelection.ts        # Správa výberu buniek
│   │   ├── useSorting.ts          # Radenie
│   │   ├── useImportExport.ts     # Import/Export
│   │   ├── useShortcuts.ts        # Klávesové skratky
│   │   ├── useTheme.ts            # Témovanie
│   │   └── useLogger.ts           # Logovanie
│   ├── stores/              # Pinia stores
│   │   └── dataGridStore.ts       # Hlavný state management pre grid
│   ├── services/            # Services
│   │   └── gridApi.ts             # API komunikácia s backendom
│   ├── types/               # TypeScript typy
│   │   ├── grid.ts                # Grid typy
│   │   └── theme.ts               # Theme typy
│   ├── utils/               # Utility funkcie
│   │   └── themeUtils.ts          # Theme utilities
│   └── index.ts             # Hlavný export súbor
├── dist/                    # Build výstupy
├── node_modules/            # Dependencies
├── package.json             # NPM package config
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite build config
```

## Hlavné Komponenty

### 1. DataGrid
Hlavný grid komponent s podporou:
- **Editácia** - Inline editácia buniek s podporou Shift+Enter pre nové riadky
- **Validácia** - Real-time validácia s viacerými pravidlami (Required, Regex, Range, Custom)
- **Filtrovanie** - Checkbox aj regex filtre na stĺpce
- **Radenie** - Multi-column sorting s vizuálnymi indikátormi
- **Pagination** - Konfigurovateľný počet riadkov na stránku
- **Copy/Paste** - Excel-kompatibilné kopírovanie/vkladanie s TSV formátom
- **Drag Selection** - Výber buniek ťahaním myši
- **Špeciálne stĺpce** - RowNumber, Checkbox, ValidationAlerts, Delete, Insert
- **Auto Row Height** - Automatické prispôsobenie výšky riadkov podľa obsahu
- **Lazy Rendering** - IntersectionObserver pre výkon pri veľkých datasetoch
- **Horizontal/Vertical Scroll** - Plne funkčný scrolling v oboch smeroch
- **Keyboard Shortcuts** - Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Delete
- **Context Menu** - Pravý klik na header a bunky
- **Hidden Columns** - Skrývanie/zobrazovanie stĺpcov
- **Auto-fit Column** - Automatické prispôsobenie šírky stĺpca podľa obsahu
- **Column Resizing** - Manuálne zmena šírky stĺpcov
- **Checkbox State** - Tri-state checkbox v headeri (none/some/all)
- **Backend Integration** - API komunikácia pre load/save dát

### 2. ListBox
Zoznamový komponent s:
- **Single/Multi Select** - Jednoduchý alebo viacnásobný výber
- **Pre-selected Items** - Inicializácia s vybratými položkami
- **Reset Button** - Tlačidlo na vyčistenie výberu
- **Thémy** - Plne prispôsobiteľné farby a štýly
- **Programmatický prístup** - API pre manipuláciu s výberom
- **Deselect on Click** - Možnosť zrušenia výberu v single-select móde

## Technológie

### Core Technologies
- **Vue 3.5.13** - Progressive JavaScript framework
- **TypeScript 5.3.3** - Statické typovanie
- **Pinia 3.0.4** - State management
- **Vite 7.3.0** - Build tool a dev server

### Dependencies
- **@vueuse/core** (10.7.0) - Vue composition utilities
- **@imengyu/vue3-context-menu** (1.5.2) - Context menu komponent

### Dev Dependencies
- **vue-tsc** (3.1.8) - TypeScript compiler pre Vue
- **vite-plugin-dts** (4.5.4) - Generovanie TypeScript deklarácií
- **terser** (5.44.1) - Minifikácia kódu
- **eslint** (9.39.2) - Code linting

## Build & Export

### Build Outputs
Knižnica sa builduje do troch formátov:
1. **ESM** (`rpa-web-ui.es.js`) - ES modules pre moderné bundlery
2. **UMD** (`rpa-web-ui.umd.js`) - Universal module pre compatibility
3. **TypeScript Declarations** (`index.d.ts`) - Typy pre TypeScript

### Exportované Komponenty

**Kontext:**
- **Čo robí:** Definuje public API knižnice - všetko, čo je dostupné pre používateľov
- **Vstup:** Interné implementácie komponentov, composables, stores a types
- **Výstup:** Named exports dostupné cez `import { ... } from 'rpa-web-ui'`
- **Prečo:**
  - **Komponenty** - DataGrid, ListBox, SearchPanel, FilterRow sú hlavné UI komponenty
  - **AdvancedTable alias** - Backwards compatibility pre starý názov DataGrid
  - **Composables** - Reusable Vue composition functions pre validation, search, atď.
  - **Stores** - useDataGridStore factory pre state management
  - **Services** - gridApi pre backend komunikáciu
  - **Pinia re-export** - Convenience export pre Pinia core functions
  - **Type exports** - TypeScript typy pre type safety a IntelliSense
- **Poznámky:**
  - Tree-shakeable - unused exports nie sú zahrnuté v bundle
  - `export type` pre types (compile-time only, no runtime overhead)

```typescript
// Hlavné komponenty
export { DataGrid, ListBox, SearchPanel, FilterRow }
export { DataGrid as AdvancedTable } // Backwards compatibility

// Composables
export {
  useValidation,
  useAutoRowHeight,
  useFiltering,
  useSearch,
  useShortcuts
}

// Stores
export { useDataGridStore }

// Services
export { gridApi }

// Pinia export
export { createPinia, setActivePinia, getActivePinia }

// Types
export type {
  GridCell, GridRow, GridColumn, GridConfig,
  ValidationRule, ValidationError, ValidationResult,
  AutoRowHeightConfig, RowHeightResult,
  FilterExpression, SimpleFilter, CompositeFilter, FilterOperator,
  ListBoxItem
}
```

### Použitie v Projekte

**Kontext:**
- **Čo robí:** Ukazuje dva spôsoby importu a použitia knižnice v Vue 3 projekte
- **Vstup:** Knižnica nainštalovaná cez npm
- **Výstup:**
  - Spôsob 1: Named imports komponentov + CSS
  - Spôsob 2: Plugin install (registruje všetky komponenty globálne)
- **Prečo:**
  - **Named imports** - Tree-shakeable, importujete iba to čo používate (menší bundle)
  - **CSS import** - Načíta base štýly potrebné pre správne zobrazenie komponentov
  - **Plugin install** - Convenience metóda, registruje všetky komponenty naraz
  - `app.use(RpaWebUI)` automaticky registruje DataGrid, ListBox a ostatné komponenty globálne
- **Poznámky:**
  - Named imports sú preferované pre optimálny bundle size
  - Plugin install je vhodný ak používate väčšinu komponentov v celej aplikácii

```javascript
import { DataGrid, ListBox } from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

// Alebo plný plugin install
import RpaWebUI from 'rpa-web-ui'
app.use(RpaWebUI)
```

## Kľúčové Vlastnosti

### 1. State Management (Pinia)
- **Izolované inštancie** - Každý DataGrid má vlastný store pomocou dynamických storeId
- **Map-based storage** - O(1) lookup pre riadky a sort info pomocou Map namiesto Array
- **Reaktivita** - Plne reaktívny state s Vue 3 reactivity
- **Validation tracking** - Sledovanie validovaných buniek pre optimalizáciu
- **Filter/Search/Sort** - Komplexný computed state pre viditeľné riadky

### 2. Validačný Systém
- **4 typy pravidiel** - Required, Regex, Range, Custom
- **4 severity úrovne** - Info, Warning, Error, Critical
- **Batch validation** - Asynchrónna validácia po dávkach s progress bar
- **Throttled validation** - 300ms debounce pre user input
- **Empty row detection** - Automatické vynechanie prázdnych riadkov
- **Error tracking** - Reactive error count a per-row error counters

### 3. Copy/Paste
- **Excel-compatible TSV** - Tab-separated values s podporou multiline
- **Position preservation** - Zachovanie pozície prázdnych buniek
- **Quote escaping** - Správne escapovanie quoted values ("" pre ")
- **Multi-cell selection** - Kopírovanie vybraných buniek, nie celých riadkov

### 4. Auto Row Height
- **Canvas measurement** - Presné meranie textu pomocou Canvas API
- **Multi-line support** - Rešpektovanie \n (Shift+Enter)
- **Word wrapping** - Automatické zalamovanie dlhých slov
- **Dynamic maxHeight** - 70% výšky containera
- **Batch processing** - Spracovanie po 50 riadkoch pre výkon

### 5. Lazy Rendering
- **IntersectionObserver** - Shared observer pre všetky riadky
- **Scoped instances** - Každý DataGrid má vlastný observer
- **100px rootMargin** - Predčasné načítanie riadkov
- **Visibility tracking** - Map-based tracking viditeľných riadkov

### 6. Filtrovanie
- **Declarative filters** - Strom FilterExpression s AND/OR operátormi
- **Per-column filters** - Kombinovanie filtrov z rôznych stĺpcov
- **Checkbox mode** - Výber z unikátnych hodnôt
- **Regex mode** - Text contains pattern matching
- **Special column support** - Filtrovanie Checkbox stĺpca (true/false)

## Performance Optimalizácie

### 1. Map-based Storage

**Kontext:**
- **Čo robí:** Porovnáva výkonnosť Map-based lookup vs Array.find() pre vyhľadávanie riadkov
- **Vstup:** `rowId` - unikátny identifikátor riadku
- **Výstup:** `GridRow` objekt
- **Prečo:**
  - **Map.get()** - O(1) časová zložitosť (konštantný čas), hash-based lookup
  - **Array.find()** - O(n) časová zložitosť (lineárne vyhľadávanie), musí iterovať cez všetky prvky
  - Pri 1000 riadkoch: Map = 1 operácia, Array = priemerne 500 operácií
  - Pri 10000 riadkoch: Map = 1 operácia, Array = priemerne 5000 operácií
  - Dramatické zlepšenie performance pri veľkých datasetoch
  - Store používa `rowsMap` internálne pre všetky row lookups
- **Poznámky:**
  - Map má mierne vyššiu memory overhead (~40 bytes per entry)
  - Trade-off: viac memory za rýchlejšie vyhľadávanie (worth it pre 100+ riadkov)

```typescript
// O(1) lookup namiesto O(n) find
const rowsMap = ref<Map<string, GridRow>>(new Map())
const row = rowsMap.value.get(rowId) // O(1)

// vs
const row = rows.value.find(r => r.rowId === rowId) // O(n)
```

### 2. Computed Sort Info

**Kontext:**
- **Čo robí:** Cachuje sort informácie v Map pre rýchly lookup počas renderovania stĺpcov
- **Vstup:** `store.sortColumns` - array sort kritérií (columnName, direction)
- **Výstup:** Map s sort info (direction, order) pre každý sortovaný stĺpec
- **Prečo:**
  - **Problém:** Header každého stĺpca potrebuje zistiť či je sortovaný a v akom poradí
  - **Bez computed:** Pri 6 stĺpcoch = 6× iterácia cez sortColumns array = 6n operácií
  - **S computed Map:** 1× vytvorenie Map + 6× O(1) lookup = n + 6 operácií
  - Pri 3 sort kritériách: 18 operácií → 9 operácií (50% zlepšenie)
  - **Vue computed** - automatický caching, prepočíta sa iba pri zmene `sortColumns`
  - Map lookup je O(1), Array.find() by bolo O(n)
- **Poznámky:**
  - `order` (1, 2, 3...) sa zobrazuje v UI pre multi-column sort indikáciu
  - Computed value sa zdieľa medzi všetkými header cells

```typescript
// Cached sort info - 1× calculation namiesto 6× per column
const sortInfoMap = computed(() => {
  const map = new Map()
  store.sortColumns.forEach((sortCol, index) => {
    map.set(sortCol.columnName, {
      direction: sortCol.direction,
      order: index + 1
    })
  })
  return map
})
```

### 3. Batch Processing

**Kontext:**
- **Čo robí:** Spracováva validáciu buniek po dávkach s yielding-om pre UI thread
- **Vstup:** `cells` - array všetkých buniek na validáciu (môže byť 1000+)
- **Výstup:** Validované bunky s error states, UI zostáva responzívna
- **Prečo:**
  - **Problém:** Validácia 1000 buniek naraz blokuje UI thread (freezing, unresponsive)
  - **Batch processing:** Rozdelenie na dávky po 50 buniek
  - **Promise.all()** - paralelné spracovanie buniek v rámci batch (rýchlejšie)
  - **await nextTick()** - yield kontrolu späť na browser (UI update, user interaction)
  - Používateľ vidí progress bar a UI zostáva klikateľná
  - Browser môže medzi batches processovať user input, scroll events, atď.
- **Poznámky:**
  - BATCH_SIZE = 50 je sweet spot (testované s 10, 50, 100, 200)
  - Príliš malý batch = viac overhead, príliš veľký = UI lag
  - Celková doba je mierne dlhšia, ale percieved performance je lepší (no freezing)

```typescript
// Validácia po dávkach s UI yielding
const BATCH_SIZE = 50
for (let i = 0; i < cells.length; i += BATCH_SIZE) {
  const batch = cells.slice(i, i + BATCH_SIZE)
  await Promise.all(batch.map(validateCell))
  await nextTick() // Yield to UI
}
```

## Známe Problémy a Riešenia

### 1. Horizontal Scroll Column Alignment
**Problém:** Header a rows neboli zarovnané pri horizontal scroll
**Riešenie:** `.table-inner` wrapper pre column grouping

### 2. Validation Deadlock
**Problém:** Concurrent validation runs spôsobovali deadlock
**Riešenie:** `isValidating` guard flag a cancellation token

### 3. AutoRowHeight Not Updating
**Problém:** Výška riadkov sa neaktualizovala po toggle
**Riešenie:** Triple nextTick + 50ms delay pre DOM stabilizáciu

### 4. Copy/Paste Position Loss
**Problém:** Stratenie pozície prázdnych buniek pri copy
**Riešenie:** Rectangular bounds s prázdnymi placeholdermi

### 5. Filter Flyout Empty Values
**Problém:** Filter zobrazoval iba už filtrované hodnoty
**Riešenie:** Extract filters except current column

## Budúce Vylepšenia

1. **Virtual Scrolling** - Pre extrémne veľké datasety (100k+ riadkov)
2. **Column Pinning** - Fixovanie stĺpcov pri horizontal scroll
3. **Cell Merging** - Spájanie buniek
4. **Tree Grid** - Hierarchické dáta s expand/collapse
5. **Excel Export** - Priamy export do .xlsx
6. **Custom Cell Renderers** - Pluggable cell components
7. **Cell Templates** - Slot-based customization
8. **Undo/Redo** - History management pre editácie
9. **Batch Edit** - Editácia viacerých buniek naraz
10. **Column Grouping** - Grouped headers

## Changelog Highlights

### Version 1.0.0
- ✅ Initial release
- ✅ DataGrid component s plnou funkcionalitou
- ✅ ListBox component
- ✅ Validation system
- ✅ Copy/Paste with Excel compatibility
- ✅ Auto Row Height
- ✅ Filtering (checkbox + regex)
- ✅ Multi-column sorting
- ✅ Pagination
- ✅ Lazy rendering
- ✅ Theme system
- ✅ Backend API integration
- ✅ TypeScript support

## Záver

RPA-WEB-UI je komplexná, production-ready knižnica pre prácu s dátovými gridmi a listboxmi vo Vue 3 aplikáciách. Poskytuje všetky potrebné funkcie pre pokročilú editáciu, validáciu a prácu s dátami, s dôrazom na výkon, UX a kompatibilitu s Excel workflow.
