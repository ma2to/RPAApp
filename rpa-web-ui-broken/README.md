# RPA Web UI

Vue 3 TypeScript knižnica komponentov pre pokročilé dátové tabuľky a listboxy.

## 📦 Inštalácia

```bash
npm install rpa-web-ui
```

## 🚀 Použitie

### Základné použitie (TypeScript)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AdvancedTable } from 'rpa-web-ui'
import type { GridColumn } from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const columns = ref<GridColumn[]>([
  { name: 'id', header: 'ID', width: 100, isVisible: true },
  { name: 'name', header: 'Meno', width: 200, isVisible: true },
  { name: 'email', header: 'Email', width: 250, isVisible: true },
  { name: 'age', header: 'Vek', width: 80, isVisible: true }
])

const data = ref([
  { id: 1, name: 'Ján Novák', email: 'jan@example.com', age: 30 },
  { id: 2, name: 'Mária Kováčová', email: 'maria@example.com', age: 25 },
  { id: 3, name: 'Peter Horváth', email: 'peter@example.com', age: 35 }
])
</script>

<template>
  <AdvancedTable
    :columns="columns"
    :data="data"
    :enable-sort="true"
    :enable-filter="true"
    :enable-validation="true"
  />
</template>
```

### Základné použitie (JavaScript)

```vue
<script setup>
import { ref } from 'vue'
import { AdvancedTable } from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const columns = ref([
  { name: 'id', header: 'ID', width: 100, isVisible: true },
  { name: 'name', header: 'Meno', width: 200, isVisible: true }
])

const data = ref([
  { id: 1, name: 'Ján Novák' },
  { id: 2, name: 'Mária Kováčová' }
])
</script>

<template>
  <AdvancedTable
    :columns="columns"
    :data="data"
    :enable-sort="true"
    :enable-filter="true"
  />
</template>
```

## 📋 Komponenty

### AdvancedTable (DataGrid)

Pokročilá tabuľka s množstvom funkcií:

#### Props

| Prop | Typ | Default | Popis |
|------|-----|---------|-------|
| `columns` | `GridColumn[]` | `[]` | Definícia stĺpcov |
| `data` | `Record<string, any>[]` | `[]` | Dáta pre tabuľku |
| `gridId` | `string` | `undefined` | Unikátne ID tabuľky |
| `theme` | `Partial<DataGridTheme>` | `undefined` | Téma pre tabuľku |
| `enableSort` | `boolean` | `true` | Zapnúť sortovanie |
| `enableFilter` | `boolean` | `true` | Zapnúť filtrovanie |
| `enableValidation` | `boolean` | `true` | Zapnúť validáciu |
| `autoRowHeightEnabled` | `boolean` | `false` | Automatická výška riadkov |
| `minTableWidth` | `number` | `undefined` | Minimálna šírka tabuľky |
| `width` | `string` | `'100%'` | Šírka tabuľky |
| `height` | `string` | `'600px'` | Výška tabuľky |

#### Funkcie

**Virtual Scrolling:**
- Efektívne vykreslenie veľkých datasetov
- Plynulý scrolling

**Editovanie buniek:**
- Inline editing (kliknutím na bunku)
- Podpora pre multiline text (Shift+Enter)

**Multi-cell Selection:**
- Ctrl+Click pre výber viacerých buniek
- Drag selection
- Select All (Ctrl+A)

**Copy/Paste:**
- Ctrl+C - kopírovanie
- Ctrl+V - vkladanie
- Ctrl+X - vystrihnúť
- Excel-kompatibilný TSV formát

**Filtrovanie:**
- Checkbox filter (multi-select hodnôt)
- Regex filter (textové vyhľadávanie)
- Composite filters (AND/OR)

**Sortovanie:**
- Single column sort
- Multi-column sort (Ctrl+Click na header)
- Asc/Desc directions

**Validácia:**
- Real-time validácia buniek
- Custom validation rules
- Severity levels (Info, Warning, Error, Critical)

**Search:**
- Global search panel
- Search modes: Exact, Contains, StartsWith, EndsWith, Regex, Fuzzy
- Highlighting matches

**CRUD Operácie:**
- Insert row
- Delete row
- Update cell

### ListBox

Single/Multi-select listbox komponent.

#### Props

| Prop | Typ | Default | Popis |
|------|-----|---------|-------|
| `items` | `ListBoxItem[]` | `[]` | Zoznam položiek |
| `title` | `string` | `undefined` | Názov listboxu |
| `multiSelect` | `boolean` | `false` | Multi-select režim |
| `preSelected` | `string[]` | `[]` | Predvolené vybrané hodnoty |
| `height` | `number` | `400` | Výška v px |
| `width` | `number` | `300` | Šírka v px |
| `theme` | `Partial<ListBoxTheme>` | `undefined` | Téma |

#### Príklad použitia

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ListBox } from 'rpa-web-ui'
import type { ListBoxItem } from 'rpa-web-ui'

const items = ref<ListBoxItem[]>([
  { value: '1', label: 'Možnosť 1' },
  { value: '2', label: 'Možnosť 2' },
  { value: '3', label: 'Možnosť 3' }
])

const selected = ref(['1'])
</script>

<template>
  <ListBox
    :items="items"
    :multi-select="true"
    :pre-selected="selected"
    title="Vyberte možnosti"
  />
</template>
```

## 🎨 Theming

### Konfigurácia farieb cez Props

```vue
<template>
  <AdvancedTable
    :columns="columns"
    :data="data"
    :theme="{
      table: {
        backgroundColor: '#ffffff',
        headerBackgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
        cellHoverColor: '#f0f0f0',
        cellSelectedColor: '#e3f2fd'
      },
      validation: {
        errorColor: '#f44336',
        warningColor: '#ff9800',
        infoColor: '#2196f3'
      }
    }"
  />
</template>
```

### Predefinované témy

```vue
<script setup lang="ts">
import { AdvancedTable } from 'rpa-web-ui'

// Light theme (default)
const lightTheme = {
  table: {
    backgroundColor: '#ffffff',
    textColor: '#000000'
  }
}

// Dark theme
const darkTheme = {
  table: {
    backgroundColor: '#1e1e1e',
    headerBackgroundColor: '#2d2d2d',
    textColor: '#ffffff',
    borderColor: '#444444'
  }
}
</script>

<template>
  <AdvancedTable :theme="darkTheme" :columns="columns" :data="data" />
</template>
```

### CSS Custom Properties

Knižnica používa CSS custom properties pre jednoduché prispôsobenie:

```css
:root {
  /* Table colors */
  --rpa-table-bg: #ffffff;
  --rpa-table-header-bg: #f5f5f5;
  --rpa-table-border: #e0e0e0;
  --rpa-table-cell-hover: #f0f0f0;
  --rpa-table-cell-selected: #e3f2fd;

  /* Validation colors */
  --rpa-validation-error: #f44336;
  --rpa-validation-warning: #ff9800;
  --rpa-validation-info: #2196f3;

  /* Filter colors */
  --rpa-filter-active: #4caf50;

  /* ListBox colors */
  --rpa-listbox-bg: #ffffff;
  --rpa-listbox-item-hover: #f5f5f5;
  --rpa-listbox-item-selected: #e3f2fd;
}
```

## 🔧 Composables

Knižnica exportuje pokročilé composables pre custom použitie:

### useFiltering

```typescript
import { useFiltering } from 'rpa-web-ui'

const { filterRows, setFilter, clearFilter } = useFiltering()

// Filter rows
const filtered = filterRows(rows, {
  type: 'simple',
  columnName: 'name',
  operator: 'Contains',
  value: 'Ján'
})
```

### useValidation

```typescript
import { useValidation } from 'rpa-web-ui'

const { addValidationRule, validateCell, getValidationErrors } = useValidation()

// Add validation rule
addValidationRule({
  columnName: 'email',
  type: 'Regex',
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Neplatný email formát',
  severity: 'Error'
})
```

### useSorting

```typescript
import { useSorting } from 'rpa-web-ui'

const { sortRows, addSort, clearSort } = useSorting()

// Sort by column
const sorted = sortRows(rows, [
  { columnName: 'name', direction: 'asc', order: 1 }
])
```

### useSearch

```typescript
import { useSearch } from 'rpa-web-ui'

const { searchInRows, goToNextResult } = useSearch()

// Search with fuzzy matching
const matches = searchInRows('john', 'Fuzzy', {
  caseSensitive: false,
  maxDistance: 2
})
```

## 🌐 Globálna Registrácia (Optional)

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import RpaWebUIPlugin from 'rpa-web-ui'
import 'rpa-web-ui/dist/style.css'

const app = createApp(App)
app.use(RpaWebUIPlugin)
app.mount('#app')
```

Po globálnej registrácii môžete používať komponenty bez importu:

```vue
<template>
  <AdvancedTable :columns="columns" :data="data" />
  <ListBox :items="items" />
</template>
```

## 📊 Typy (TypeScript)

Knižnica poskytuje kompletné TypeScript type definitions:

```typescript
import type {
  GridRow,
  GridCell,
  GridColumn,
  GridConfig,
  FilterExpression,
  SimpleFilter,
  CompositeFilter,
  ValidationRule,
  ValidationError,
  SearchMode,
  ListBoxItem,
  DataGridTheme,
  ListBoxTheme
} from 'rpa-web-ui'
```

## 🔌 Dependencies

**Peer Dependencies** (potrebné v projekte):
- `vue`: ^3.4.0
- `pinia`: ^2.1.7

**Runtime Dependencies** (automaticky nainštalované):
- `@imengyu/vue3-context-menu`: ^1.5.2
- `@microsoft/signalr`: ^8.0.0
- `@vueuse/core`: ^10.7.0
- `axios`: ^1.6.2
- `mitt`: ^3.0.1
- `vue-virtual-scroller`: ^2.0.0-beta.8

## 📝 License

MIT

## 👥 Author

RPA Team
