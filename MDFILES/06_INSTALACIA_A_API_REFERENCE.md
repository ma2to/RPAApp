# RPA-WEB-UI - Inštalácia a API Reference

## Úvod

**RPA-WEB-UI** je pokročilá Vue 3 knižnica poskytujúca DataGrid a ListBox komponenty s plnou TypeScript podporou. Knižnica je optimalizovaná pre RPA (Robotic Process Automation) scenáre a poskytuje rozsiahle API pre manipuláciu s dátami, validáciu, filtrovanie a backend integráciu.

**Verzia:** 1.0.0
**License:** MIT
**Peer Dependencies:** Vue 3.3+, Pinia 3.0+

---

## Inštalácia

### 1. Inštalácia NPM balíčka

```bash
npm install rpa-web-ui
```

**Čo sa nainštaluje:**
- Knižnica `rpa-web-ui` vo `node_modules/`
- TypeScript type definitions (`.d.ts` súbory)
- CSS štýly v `dist/style.css`

**Peer dependencies** (musia byť nainštalované v projekte):
```bash
npm install vue@^3.3.0 pinia@^3.0.0
```

---

### 2. Import do projektu

#### Metóda A: Named Imports (Odporúčané - Tree-shakeable)

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import komponentov a CSS
import { DataGrid, ListBox } from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Voliteľná globálna registrácia komponentov
app.component('DataGrid', DataGrid)
app.component('ListBox', ListBox)

app.mount('#app')
```

**Výhody:**
- Tree-shaking - nepoužité komponenty sa neincludujú do bundle
- Menší výsledný bundle size
- TypeScript autocomplete pre importy

#### Metóda B: Plugin Install (Všetky komponenty naraz)

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import celej knižnice ako plugin
import RpaWebUI from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(RpaWebUI)  // Registruje DataGrid, ListBox, SearchPanel, FilterRow

app.mount('#app')
```

**Výhody:**
- Jednoduchý setup
- Všetky komponenty sú automaticky globálne registrované

---

### 3. TypeScript konfigurácia

Ak používate TypeScript, pridajte do `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vite/client"],
    "skipLibCheck": true
  }
}
```

---

## Exportované Komponenty

### 1. DataGrid

**Popis:** Hlavný komponent knižnice - pokročilý dátový grid s editáciou, validáciou, filtering, sorting a Excel-kompatibilným copy/paste.

**Import:**
```typescript
import { DataGrid } from 'rpa-web-ui'
```

**Props:**

| Prop | Typ | Default | Popis |
|------|-----|---------|-------|
| `config` | `GridConfig` | `undefined` | Konfigurácia gridu (validácia, pagination, atď.) |
| `columns` | `GridColumn[]` | `undefined` | Definícia stĺpcov (názvy, šírky, typy) |
| `gridId` | `string` | auto-generated | Unikátne ID gridu pre multi-grid scenáre |
| `theme` | `Partial<DataGridTheme>` | `undefined` | Custom farebná schéma |
| `minTableWidth` | `number` | `undefined` | Min. šírka tabuľky pre horizontal scroll |
| `width` | `string` | `"100%"` | Šírka grid containeru |
| `height` | `string` | `"800px"` | Výška grid containeru |
| `autoRowHeightEnabled` | `boolean` | `false` | Zapína auto-výšku riadkov pri inicializácii |
| `minRows` | `number` | `5` | Minimálny počet prázdnych riadkov |
| `showHiddenColumnsPanel` | `boolean` | `true` | Zobrazuje panel pre unhide skrytých stĺpcov |
| `enableHideColumn` | `boolean` | `true` | Povoľuje skrývanie stĺpcov cez context menu |
| `enableAutoFit` | `boolean` | `true` | Povoľuje auto-fit šírky stĺpcov |

**Exposed API (prístup cez template ref):**

```typescript
interface DataGridAPI {
  // Backend operations
  loadDataFromBackend: () => Promise<void>

  // Validation API
  validation: {
    validateRequired: () => Promise<boolean>
    isAllValid: () => boolean
    validateAll: (rows?) => Promise<{ isValid: boolean; totalErrors: number }>
    addValidationRule: (rule: ValidationRule) => void
    getValidationErrors: (rowId: string) => ValidationError[]
    clearValidationErrors: () => void
  }

  // Copy/Paste API
  copyPaste: {
    copyToClipboard: (rows, cols, options) => Promise<Result>
    copySelectedCells: (selected, rows, cols) => Promise<Result>
    pasteFromClipboard: () => Promise<Result>
  }

  // Keyboard shortcuts
  shortcuts: ShortcutsAPI

  // Direct handlers
  handleCopy: () => Promise<void>
  handlePaste: () => Promise<void>
  handleCut: () => Promise<void>

  // State
  isGridReady: Ref<boolean>
  store: DataGridStore

  // Column management
  getColumns: () => GridColumn[]
  setColumns: (columns: GridColumn[]) => void
}
```

**Použitie:**

```vue
<template>
  <DataGrid
    ref="gridRef"
    :columns="columns"
    :config="config"
    grid-id="myGrid"
    width="100%"
    height="600px"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataGrid } from 'rpa-web-ui'
import type { GridColumn, GridConfig } from 'rpa-web-ui'

const gridRef = ref()

const columns: GridColumn[] = [
  { name: 'name', header: 'Name', width: 150, isSortable: true },
  { name: 'email', header: 'Email', width: 200, isFilterable: true },
  { name: 'age', header: 'Age', width: 80 }
]

const config: GridConfig = {
  pageSize: 50,
  enableValidation: true,
  autoValidate: true,
  showCheckbox: true
}

onMounted(async () => {
  // Počkať na inicializáciu gridu
  await gridRef.value.isGridReady

  // Pridať validation rule
  gridRef.value.validation.addValidationRule({
    columnName: 'email',
    ruleType: 'Regex',
    regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
    errorMessage: 'Invalid email',
    severity: 'Error'
  })

  // Validovať všetky bunky
  const result = await gridRef.value.validation.validateAll()
  console.log(`Valid: ${result.isValid}`)
})
</script>
```

---

### 2. ListBox

**Popis:** Komponent pre single/multi-select výber položiek s vyhľadávaním a filtrovanaím.

**Import:**
```typescript
import { ListBox } from 'rpa-web-ui'
```

**Props:**

| Prop | Typ | Default | Popis |
|------|-----|---------|-------|
| `items` | `ListBoxItem[]` | **POVINNÉ** | Array položiek (value + label) |
| `config` | `ListBoxConfig` | `undefined` | Konfigurácia správania |
| `theme` | `Partial<ListBoxTheme>` | `undefined` | Custom farebná schéma |
| `preselectedValues` | `string[]` | `undefined` | Pred-vybrané položky |
| `listBoxId` | `string` | `undefined` | ID pre backend integráciu |

**Events:**

| Event | Payload | Popis |
|-------|---------|-------|
| `selectionChange` | `string[]` | Emitované pri zmene výberu |

**Exposed API:**

```typescript
interface ListBoxAPI {
  clearSelection: () => void
  getSelectedValues: () => string[]
  selectValue: (value: string) => void
}
```

**Použitie:**

```vue
<template>
  <ListBox
    ref="listBoxRef"
    :items="items"
    :config="{ allowMultiple: true, showSearchBar: true }"
    @selectionChange="handleSelection"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ListBox } from 'rpa-web-ui'
import type { ListBoxItem } from 'rpa-web-ui'

const listBoxRef = ref()

const items: ListBoxItem[] = [
  { value: '1', label: 'Item 1' },
  { value: '2', label: 'Item 2' },
  { value: '3', label: 'Item 3', disabled: true }
]

function handleSelection(selectedValues: string[]) {
  console.log('Selected:', selectedValues)
}

// Programatické ovládanie
function clearAll() {
  listBoxRef.value.clearSelection()
}
</script>
```

---

### 3. SearchPanel

**Popis:** Panel pre vyhľadávanie v DataGrid s podporou regex a case-sensitive mode.

**Import:**
```typescript
import { SearchPanel } from 'rpa-web-ui'
```

---

### 4. FilterRow

**Popis:** Komponent pre zobrazenie aktívneho filtra a jeho clear.

**Import:**
```typescript
import { FilterRow } from 'rpa-web-ui'
```

---

## Exportované Composables

### 1. useValidation

**Popis:** Poskytuje kompletný validačný systém pre DataGrid bunky s podporou 4 typov pravidiel (Required, Regex, Range, Custom).

**Import:**
```typescript
import { useValidation } from 'rpa-web-ui'
import type { ValidationRule, ValidationError } from 'rpa-web-ui'
```

**API:**

```typescript
interface ValidationAPI {
  // State
  validationRules: Ref<Map<string, ValidationRule[]>>
  validationErrors: Reactive<Record<string, ValidationError[]>>
  errorCount: Ref<number>
  ruleCount: Ref<number>

  // Metódy
  addValidationRule: (rule: ValidationRule) => void
  validateCell: (rowId: string, columnName: string, value: any) => ValidationResult
  validateCellDirect: (rowId, columnName, value, rowCells?, skipErrorCountUpdate?) => Promise<void>
  validateCellThrottled: (rowId, columnName, value, rowCells?) => Promise<void>
  validateAll: (rows) => Promise<{ isValid: boolean; totalErrors: number; errors: ValidationError[] }>
  getValidationErrors: (rowId: string) => ValidationError[]
  clearValidationErrors: () => void
  updateErrorCount: () => void
}
```

**Vstup:**
- `addValidationRule()` - Prijíma `ValidationRule` objekt
- `validateCell()` - Prijíma `rowId`, `columnName`, `value`
- `validateAll()` - Prijíma array `GridRow` objektov

**Výstup:**
- `validateCell()` - Vráti `ValidationResult` (sync)
- `validateAll()` - Vráti Promise s `{ isValid, totalErrors, errors }`
- `getValidationErrors()` - Vráti array `ValidationError[]`

**Čo sa deje:**
1. **addValidationRule()** - Pridá pravidlo do `validationRules` Map pod key `columnName`
2. **validateCell()** - Aplikuje všetky pravidlá na hodnotu bunky, vráti immediate result
3. **validateCellDirect()** - Async validácia s uložením errors do `validationErrors` store
4. **validateAll()** - Batch processing validácia všetkých buniek v gridoch s UI yielding

**Na čo slúži:**
- Validácia dát v reálnom čase počas editácie
- Bulk validácia pred uložením do databázy
- Vizuálny feedback (červené/žlté pozadie buniek)
- Blokovanie save operácií pri chybách

**Príklad použitia:**

```typescript
const validation = useValidation()

// Pridať Required rule
validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Required',
  errorMessage: 'Email je povinný',
  severity: 'Error'
})

// Pridať Regex rule
validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Regex',
  regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
  errorMessage: 'Neplatný email formát',
  severity: 'Error'
})

// Validovať všetky bunky
const result = await validation.validateAll(rows)
if (!result.isValid) {
  console.log(`Chýb: ${result.totalErrors}`)
}
```

---

### 2. useAutoRowHeight

**Popis:** Automatické výpočty výšky riadkov na základe obsahu buniek pomocou Canvas API pre presné meranie textu.

**Import:**
```typescript
import { useAutoRowHeight } from 'rpa-web-ui'
import type { AutoRowHeightConfig, RowHeightResult } from 'rpa-web-ui'
```

**API:**

```typescript
interface AutoRowHeightAPI {
  calculateRowHeight: (row: GridRow, columns: GridColumn[]) => RowHeightResult
  calculateRowHeights: (rows: GridRow[], columns: GridColumn[]) => RowHeightResult[]
  applyAutoRowHeight: (rows: GridRow[], columns: GridColumn[]) => Promise<{ totalRowsUpdated: number; averageHeight: number }>
  recalculateRows: (rows: GridRow[], rowIds: string[], columns: GridColumn[]) => number
  measureTextHeight: (text: string, width: number) => number
  updateMaxHeight: (newMaxHeight: number) => void
}
```

**Vstup:**
- `calculateRowHeight()` - Prijíma `GridRow` a `GridColumn[]`
- `applyAutoRowHeight()` - Prijíma všetky rows a columns
- `measureTextHeight()` - Prijíma text string a šírku v pixeloch

**Výstup:**
- `calculateRowHeight()` - Vráti `{ rowId, calculatedHeight, isSuccess }`
- `applyAutoRowHeight()` - Vráti `{ totalRowsUpdated, averageHeight }`
- `measureTextHeight()` - Vráti výšku v pixeloch

**Čo sa deje:**
1. Vytvorí off-screen Canvas element pre meranie textu
2. Nastaví font (14px system-ui) zhodný s CSS
3. Pre každú bunku v riadku zmeria text width a height
4. Podporuje multi-line text (split by `\n`) a word wrapping
5. Vráti max výšku z všetkých buniek v riadku
6. Aplikuje min/max constraints (35px - 400px)

**Na čo slúži:**
- Automatické prispôsobenie výšky riadkov pre dlhý text
- Zobrazenie multi-line obsahu bez scroll
- Dynamická výška pri editácii buniek
- Excel-like správanie

**Príklad:**

```typescript
const autoRowHeight = useAutoRowHeight({
  minHeight: 35,
  maxHeight: 400,
  fontSize: 14,
  enableWrapping: true
})

// Aplikovať na všetky riadky
const result = await autoRowHeight.applyAutoRowHeight(store.rows, columns)
console.log(`Updated ${result.totalRowsUpdated} rows`)
```

---

### 3. useFiltering

**Popis:** Poskytuje filtering systém s podporou simple a composite filters.

**Import:**
```typescript
import { useFiltering } from 'rpa-web-ui'
import type { FilterExpression, SimpleFilter, CompositeFilter } from 'rpa-web-ui'
```

**API:**

```typescript
interface FilteringAPI {
  applyFilter: (rows: GridRow[], filter: FilterExpression) => GridRow[]
  createSimpleFilter: (columnName: string, operator: FilterOperator, value: any) => SimpleFilter
  createCompositeFilter: (left: FilterExpression, right: FilterExpression, operator: 'AND' | 'OR') => CompositeFilter
}
```

**Vstup:**
- `applyFilter()` - Prijíma `GridRow[]` a `FilterExpression`
- Filter expression môže byť SimpleFilter alebo CompositeFilter (recursive tree)

**Výstup:**
- Filtrované pole riadkov

**Čo sa deje:**
1. Prejde všetky riadky
2. Aplikuje filter expression na každý riadok
3. SimpleFilter porovnáva hodnotu bunky s filter value
4. CompositeFilter rekurzívne vyhodnocuje left/right s AND/OR operátorom

**Na čo slúži:**
- Filtrovanie riadkov podľa podmienok
- Komplexné filter queries (napr. vek > 18 AND meno obsahuje "John")
- Real-time filtering pri zmene filter kritérií

---

### 4. useSearch

**Popis:** Vyhľadávací systém s podporou regex, case-sensitive a navigácie medzi výsledkami.

**Import:**
```typescript
import { useSearch } from 'rpa-web-ui'
```

**API:**

```typescript
interface SearchAPI {
  searchInRows: (query: string, mode: SearchMode, options: SearchOptions) => void
  goToNextResult: () => void
  goToPreviousResult: () => void
  clearSearch: () => void
  searchResults: Ref<SearchMatch[]>
  currentResultIndex: Ref<number>
}
```

**Vstup:**
- `searchInRows()` - Prijíma search query, mode ('Contains', 'Equals', 'StartsWith'), options (caseSensitive)

**Výstup:**
- `searchResults` - Array nájdených matches s `{ rowId, columnName, value }`
- `currentResultIndex` - Index aktuálneho výsledku

**Čo sa deje:**
1. Prehľadáva všetky bunky v visible rows
2. Aplikuje search mode (Contains/Equals/StartsWith)
3. Rešpektuje case sensitivity
4. Označuje nájdené bunky (highlighting)
5. Poskytuje next/previous navigáciu

**Na čo slúži:**
- Rýchle vyhľadávanie textu v gridu
- Navigácia medzi výsledkami (Ctrl+F workflow)
- Highlighting nájdených hodnôt

---

### 5. useShortcuts

**Popis:** Správa klávesových skratiek pre grid (Ctrl+C, Ctrl+V, Ctrl+X, atď.).

**Import:**
```typescript
import { useShortcuts } from 'rpa-web-ui'
```

---

## Exportované Stores

### useDataGridStore

**Popis:** Centrálny Pinia store pre state management DataGrid komponentu. Každý grid má vlastný izolovaný store cez dynamický `storeId`.

**Import:**
```typescript
import { useDataGridStore } from 'rpa-web-ui'
```

**API:**

```typescript
interface DataGridStore {
  // State
  rows: ComputedRef<GridRow[]>
  columns: Ref<GridColumn[]>
  config: Ref<GridConfig>
  selectedCells: Ref<Set<string>>
  checkedRows: Ref<string[]>
  sortColumns: ComputedRef<SortColumn[]>
  filterExpression: Ref<FilterExpression | null>

  // Computed
  visibleRows: ComputedRef<GridRow[]>
  totalRows: ComputedRef<number>
  totalPages: ComputedRef<number>

  // Actions - Data Management
  loadRows: (data: Record<string, any>[]) => void
  getRow: (rowId: string) => GridRow | undefined
  updateCell: (rowId: string, columnName: string, value: any) => void
  deleteRow: (rowId: string) => void
  insertRow: (afterRowId: string) => void
  insertMultipleRows: (rowId: string, count: number, position: 'above' | 'below') => void

  // Actions - Selection
  selectCell: (rowId: string, columnName: string, isCtrlPressed: boolean) => void
  clearSelection: () => void
  toggleCheckbox: (rowId: string, state: boolean) => void
  toggleAllCheckboxes: () => void

  // Actions - Sort/Filter
  addSort: (columnName: string, direction: 'asc' | 'desc', multiSort: boolean) => void
  clearSort: () => void
  setFilter: (filter: FilterExpression) => void
  clearFilter: () => void

  // Actions - Columns
  updateColumn: (columnName: string, updates: Partial<GridColumn>) => void
  setColumns: (columns: GridColumn[]) => void
}
```

**Použitie:**

```typescript
import { useDataGridStore } from 'rpa-web-ui'

// Vytvorenie store pre konkrétny grid
const store = useDataGridStore('my-grid-id')()

// Načítanie dát
store.loadRows([
  { name: 'John', email: 'john@example.com', age: 30 },
  { name: 'Jane', email: 'jane@example.com', age: 25 }
])

// Aktualizácia bunky
store.updateCell('row-123', 'email', 'newemail@example.com')

// Pridanie sort
store.addSort('name', 'asc', false)

// Filtrovanie
store.setFilter({
  type: 'simple',
  columnName: 'age',
  operator: 'GreaterThan',
  value: 25
})
```

**Vstup:**
- `loadRows()` - Prijíma array plain objektov
- `updateCell()` - Prijíma rowId, columnName, new value
- `setFilter()` - Prijíma FilterExpression tree

**Výstup:**
- `visibleRows` - Computed array riadkov po aplikovaní filter/sort/pagination
- `getRow()` - Vráti GridRow objekt alebo undefined

**Čo sa deje:**
1. **loadRows()** - Konvertuje plain objekty na `GridRow` s `GridCell[]`, skipuje prázdne riadky
2. **updateCell()** - Nájde bunku v Map-based store (O(1)) a updatne hodnotu
3. **visibleRows** - Aplikuje filter → search → sort → pagination pipeline
4. **Reactive updates** - Všetky zmeny automaticky triggerujú UI re-render

**Na čo slúži:**
- Centralizovaný state management pre grid dáta
- Reactive updates (Vue automaticky sleduje zmeny)
- Izolované stores pre multiple grid instances
- O(1) row lookup cez Map

---

## Exportované Services

### gridApi

**Popis:** Service pre komunikáciu s backend API (HTTP mode alebo WebView2 Host Objects mode).

**Import:**
```typescript
import { gridApi } from 'rpa-web-ui'
```

**API:**

```typescript
interface GridApiService {
  // Data operations
  getData: () => Promise<ApiResponse<GridRow[]>>
  importData: (data: GridRow[]) => Promise<ApiResponse<void>>
  exportData: (options?: ExportOptions) => Promise<ApiResponse<GridRow[]>>

  // Configuration
  getConfig: () => Promise<ApiResponse<GridConfig>>
  getColumns: () => Promise<ApiResponse<any[]>>
  getColumnNames: () => Promise<ApiResponse<string[]>>

  // Validation
  setValidationRules: (rules: ValidationRule[]) => Promise<ApiResponse<void>>
  getValidationRules: () => Promise<ApiResponse<ValidationRule[]>>

  // ListBox integration
  registerListBox: (listBoxId: string, listBoxRef: ListBoxRef) => void
  unregisterListBox: (listBoxId: string) => void
  clearListBoxSelection: (listBoxId: string) => ApiResponse<void>
  getListBoxSelection: (listBoxId: string) => ApiResponse<string[]>
  getListBoxConfig: (listBoxId: string) => Promise<ApiResponse<any>>

  // Theme
  getThemeConfig: () => Promise<ApiResponse<any>>

  // Health check
  healthCheck: () => Promise<boolean>
}
```

**Použitie:**

```typescript
import { gridApi } from 'rpa-web-ui'

// Načítať dáta z backendu
const response = await gridApi.getData()
if (response.success) {
  store.loadRows(response.data)
}

// Uložiť dáta na backend
const saveResponse = await gridApi.importData(store.rows)

// Nastaviť validation rules
await gridApi.setValidationRules([
  {
    columnName: 'email',
    ruleType: 'Regex',
    parameters: { pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    errorMessage: 'Invalid email'
  }
])
```

**Vstup:**
- `getData()` - Žiadne parametre
- `importData()` - Array GridRow objektov
- `setValidationRules()` - Array ValidationRule objektov

**Výstup:**
- Všetky metódy vracajú `Promise<ApiResponse<T>>`
- `ApiResponse` má `{ success: boolean, data?: T, error?: string }`

**Čo sa deje:**
1. **Detekcia mode** - Kontroluje či existuje `window.gridApi` (WebView2) alebo používa HTTP
2. **HTTP mode** - Fetch requests na `http://localhost:5000/api/grid/*`
3. **WebView2 mode** - Volá C# bridge metódy cez Host Objects
4. **Response parsing** - Parsuje JSON odpovede z backendu
5. **Error handling** - Zachytáva chyby a vracia v štandardnom formáte

**Na čo slúži:**
- Backend integrácia pre RPA scenáre
- Načítanie/uloženie dát z/do databázy
- Synchronizácia konfigurácie medzi frontend/backend
- Dual-mode support (development HTTP + production WebView2)

---

## Exportované Types

### GridCell

```typescript
interface GridCell {
  rowId: string
  columnName: string
  value: any
  isSelected: boolean
  isValidationError: boolean
  validationMessage?: string
}
```

**Popis:** Reprezentuje jednu bunku v gridu.

---

### GridRow

```typescript
interface GridRow {
  rowId: string
  rowIndex: number
  height: number
  cells: GridCell[]
  validationErrorCount?: number
}
```

**Popis:** Reprezentuje jeden riadok v gridu s poľom buniek.

---

### GridColumn

```typescript
interface GridColumn {
  name: string
  header: string
  width: number
  minWidth: number
  maxWidth: number
  isVisible: boolean
  isReadOnly: boolean
  isSortable: boolean
  isFilterable: boolean
  autoWidth?: boolean
  specialType?: 'RowNumber' | 'Checkbox' | 'ValidationAlerts' | 'DeleteRow' | 'InsertRow'
  dataType?: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time'
  visibleForGrid?: boolean
}
```

**Popis:** Definuje stĺpec gridu.

---

### GridConfig

```typescript
interface GridConfig {
  pageSize: number
  pageSizeOptions?: number[]
  enableSort: boolean
  enableFilter: boolean
  enableSearch: boolean
  enableValidation: boolean
  autoValidate: boolean
  showRowNumber: boolean
  showCheckbox: boolean
  showValidationAlerts: boolean
  showDeleteButton: boolean
  showInsertButton: boolean
  minRowHeight?: number
}
```

**Popis:** Konfigurácia funkcionalít DataGrid komponentu.

---

### ValidationRule

```typescript
interface ValidationRule {
  columnName: string
  ruleType: 'Required' | 'Regex' | 'Range' | 'Custom'
  errorMessage: string
  regexPattern?: string
  minValue?: any
  maxValue?: any
  severity: 'Info' | 'Warning' | 'Error' | 'Critical'
  customValidator?: (value: any) => boolean
}
```

**Popis:** Definuje validačné pravidlo pre stĺpec.

---

### FilterExpression

```typescript
type FilterExpression = SimpleFilter | CompositeFilter

interface SimpleFilter {
  type: 'simple'
  columnName: string
  operator: FilterOperator
  value: any
}

interface CompositeFilter {
  type: 'composite'
  left: FilterExpression
  right: FilterExpression
  operator: 'AND' | 'OR'
}

type FilterOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'StartsWith'
  | 'EndsWith'
  | 'GreaterThan'
  | 'LessThan'
  | 'GreaterThanOrEqual'
  | 'LessThanOrEqual'
```

**Popis:** Definuje filter expression tree pre filtrovanie riadkov.

---

## Pinia Export

Knižnica re-exportuje Pinia core functions pre convenience:

```typescript
import { createPinia, setActivePinia, getActivePinia } from 'rpa-web-ui'
```

**Použitie:**
```typescript
import { createPinia } from 'rpa-web-ui'

const pinia = createPinia()
app.use(pinia)
```

---

## Backwards Compatibility

### AdvancedTable Alias

Pre spätnú kompatibilitu je DataGrid dostupný aj pod názvom `AdvancedTable`:

```typescript
import { AdvancedTable } from 'rpa-web-ui'
// AdvancedTable === DataGrid
```

---

## Bundle Formáty

Knižnica poskytuje tri výstupné formáty:

1. **ES Modules** (`rpa-web-ui.es.js`) - Pre moderné bundlery (Vite, Webpack 5+)
2. **UMD** (`rpa-web-ui.umd.js`) - Pre legacy projekty a `<script>` tag usage
3. **TypeScript Declarations** (`index.d.ts`) - Type definitions pre TypeScript projekty

**Import CSS:**
```typescript
import 'rpa-web-ui/dist/style.css'
```

---

## Peer Dependencies

Knižnica vyžaduje tieto dependencies v host projekte:

- **Vue 3.3+** - Framework
- **Pinia 3.0+** - State management

**Internal dependencies** (zahrnuté v bundle):
- `@imengyu/vue3-context-menu` - Context menu komponenty
- `@vueuse/core` - Vue composition utilities

---

## Príklady Použitia

### Kompletný Example - DataGrid s Validáciou

```vue
<template>
  <div class="app">
    <DataGrid
      ref="gridRef"
      :columns="columns"
      :config="config"
      grid-id="employeeGrid"
      width="100%"
      height="600px"
    />

    <button @click="saveData">Save Data</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataGrid, useDataGridStore, gridApi } from 'rpa-web-ui'
import type { GridColumn, GridConfig } from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const gridRef = ref()
const store = useDataGridStore('employeeGrid')()

const columns: GridColumn[] = [
  { name: 'name', header: 'Name', width: 150, isSortable: true, isFilterable: true },
  { name: 'email', header: 'Email', width: 200, isSortable: true },
  { name: 'age', header: 'Age', width: 80, dataType: 'number' },
  { name: 'department', header: 'Department', width: 120, isFilterable: true }
]

const config: GridConfig = {
  pageSize: 50,
  enableSort: true,
  enableFilter: true,
  enableValidation: true,
  autoValidate: true,
  showRowNumber: true,
  showCheckbox: true,
  showValidationAlerts: true
}

onMounted(async () => {
  // Počkať na grid ready
  await gridRef.value.isGridReady

  // Pridať validation rules
  gridRef.value.validation.addValidationRule({
    columnName: 'email',
    ruleType: 'Required',
    errorMessage: 'Email je povinný',
    severity: 'Error'
  })

  gridRef.value.validation.addValidationRule({
    columnName: 'email',
    ruleType: 'Regex',
    regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
    errorMessage: 'Neplatný email formát',
    severity: 'Error'
  })

  gridRef.value.validation.addValidationRule({
    columnName: 'age',
    ruleType: 'Range',
    minValue: 18,
    maxValue: 65,
    errorMessage: 'Vek musí byť medzi 18-65',
    severity: 'Warning'
  })

  // Načítať dáta z backendu
  const response = await gridApi.getData()
  if (response.success) {
    store.loadRows(response.data)
  }
})

async function saveData() {
  // Validovať pred uložením
  const result = await gridRef.value.validation.validateAll()

  if (!result.isValid) {
    alert(`Opravte ${result.totalErrors} chýb pred uložením`)
    return
  }

  // Exportovať dáta
  const data = store.rows
    .filter(row => row.cells.some(c => c.value))
    .map(row => {
      const obj: Record<string, any> = {}
      row.cells.forEach(cell => {
        obj[cell.columnName] = cell.value
      })
      return obj
    })

  // Uložiť na backend
  const saveResponse = await gridApi.importData(data)
  if (saveResponse.success) {
    alert('Dáta úspešne uložené')
  }
}
</script>
```

---

## Support a Troubleshooting

### Časté Problémy

1. **Grid neloaduje dáta** - Skontrolujte `await gridRef.value.isGridReady` pred volaním API
2. **Validation nefunguje** - Overte `enableValidation: true` a `autoValidate: true` v config
3. **Copy/Paste nefunguje** - Vyžaduje clipboard permissions v prehliadači (HTTPS)
4. **Theme nefunguje** - Nezabudnite importovať `'rpa-web-ui/dist/style.css'`

---

## Changelog a Verzia

**Verzia:** 1.0.0
**Release Date:** 2024

**Features:**
- DataGrid s editáciou, validáciou, filtering, sorting
- ListBox s single/multi-select
- Excel-kompatibilné copy/paste
- Automatická výška riadkov
- Backend API integrácia (HTTP + WebView2)
- Plná TypeScript podpora
- Theming systém

---

**Koniec dokumentácie**
