# Types a Interfaces - Detailná Dokumentácia

## Prehľad

**Primárna funkcia:** RPA-WEB-UI knižnica používa TypeScript pre statické typovanie. Definuje rozsiahle types a interfaces pre grid, témy, validáciu, filtering, search a ďalšie funkcionality.

**Prečo existujú typy:**
- **Type Safety** - chyby sa zachytia počas kompillácie, nie runtime
- **IntelliSense** - IDE autocomplete a dokumentácia priamo v kóde
- **Refactoring** - bezpečnejšie refaktory s TypeScript compiler kontrolou
- **Self-documenting code** - interfaces sú živá dokumentácia API

**Kľúčové type kategórie:**
1. **Grid Types** (GridCell, GridRow, GridColumn) - základné building blocks DataGrid
2. **Theme Types** (Theme, ColorScheme, ThemeConfig) - dynamické theming system
3. **Validation Types** (ValidationRule, ValidationError) - validačný systém
4. **Filter Types** (FilterExpression, SimpleFilter, CompositeFilter) - filter expression tree
5. **Search Types** (SearchMatch, SearchMode, SearchOptions) - vyhľadávací systém
6. **Config Types** (DataGridConfig, PaginationConfig) - konfigurácia funkcionalít

**Štruktúra dokumentácie:** Každý typ obsahuje TypeScript definíciu + **Popis** s vysvetlením jednotlivých properties a použitia.

## Súbory s Type Definíciami

1. **src/types/grid.ts** - Core grid types
2. **src/types/theme.ts** - Theme system types
3. **src/stores/dataGridStore.ts** - Grid cell, row, column types
4. **src/composables/useValidation.ts** - Validation types
5. **src/composables/useAutoRowHeight.ts** - Row height types
6. **src/composables/useCopyPaste.ts** - Copy/paste types
7. **src/composables/useFiltering.ts** - Filter expression types
8. **src/composables/useSearch.ts** - Search types

---

## Grid Types (types/grid.ts)

### GridCell
```typescript
export interface GridCell {
  rowId: string
  columnName: string
  value: any
  isSelected: boolean
  isValidationError: boolean
  validationMessage?: string
}
```

**Popis:**
- `rowId` - Unikátny identifikátor riadku (ULID formát)
- `columnName` - Názov stĺpca
- `value` - Hodnota bunky (any type - string, number, boolean, date, null)
- `isSelected` - Či je bunka vybraná (pre drag selection)
- `isValidationError` - Či bunka má validačnú chybu
- `validationMessage` - Text validačnej chyby (ak existuje)

### GridRow
```typescript
export interface GridRow {
  rowId: string
  rowIndex: number
  height: number
  cells: GridCell[]
  validationErrorCount?: number  // For DynamicScroller size-dependencies
}
```

**Popis:**
- `rowId` - Unikátny identifikátor (ULID)
- `rowIndex` - Pozícia v gridu (0-based)
- `height` - Výška riadku v pixeloch (default: 35px)
- `cells` - Pole všetkých buniek riadku
- `validationErrorCount` - Počet validačných chýb (pre watch v DataGrid)

### GridColumn
```typescript
export interface GridColumn {
  name: string
  header: string
  width: number
  minWidth: number
  maxWidth: number
  isVisible: boolean
  isReadOnly: boolean
  isSortable: boolean
  isFilterable: boolean
  autoWidth?: boolean  // Star sizing - column expands to fill remaining space
  specialType?: 'RowNumber' | 'Checkbox' | 'ValidationAlerts' | 'DeleteRow' | 'InsertRow'
  dataType?: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time'
  visibleForGrid?: boolean  // Default: true. If false, column holds data but not shown
}
```

**Popis:**
- `name` - Unikátne meno stĺpca (použité v data binding)
- `header` - Zobrazený text v hlavičke
- `width` - Aktuálna šírka v pixeloch
- `minWidth` - Minimálna šírka (pre resizing)
- `maxWidth` - Maximálna šírka (pre resizing a auto-fit)
- `isVisible` - Či je stĺpec viditeľný (hide/show funkcionalita)
- `isReadOnly` - Či je stĺpec read-only (disable edit)
- `isSortable` - Povoliť radenie na tomto stĺpci
- `isFilterable` - Povoliť filter na tomto stĺpci
- `autoWidth` - Star sizing (1fr) - stĺpec sa roztiah human na zvyšný priestor
- `specialType` - Typ špeciálneho stĺpca (null pre normálne stĺpce)
- `dataType` - Typ dát pre validáciu a formátovanie
- `visibleForGrid` - False = stĺpec drží dáta ale nie je zobrazený v UI

**Special Column Types:**
- `RowNumber` - Automatické číslovanie riadkov (#)
- `Checkbox` - Checkbox pre výber riadkov (☑)
- `ValidationAlerts` - Zobrazenie validačných chýb (⚠)
- `DeleteRow` - Tlačidlo na vymazanie riadku
- `InsertRow` - Tlačidlo na vloženie riadku

### GridConfig
```typescript
export interface GridConfig {
  pageSize: number
  pageSizeOptions?: number[]
  enableSort: boolean
  enableFilter: boolean
  enableSearch: boolean
  enableValidation: boolean
  autoValidate: boolean  // true = validate on every change, false = validate only on manual request
  showRowNumber: boolean
  showCheckbox: boolean
  showValidationAlerts: boolean
  showDeleteButton: boolean
  showInsertButton: boolean
  minRowHeight?: number  // Minimum row height in pixels (default: 35)
}
```

**Popis:**
- `pageSize` - Počet riadkov na stránku (default: 100)
- `pageSizeOptions` - Možnosti pre page size dropdown (default: [50, 100, 200, 500])
- `enableSort` - Povoliť radenie
- `enableFilter` - Povoliť filtrovanie
- `enableSearch` - Povoliť vyhľadávanie
- `enableValidation` - Povoliť validáciu
- `autoValidate` - True = validovať pri každej zmene, False = manuálne
- `showRowNumber` - Zobraziť stĺpec s číslom riadku
- `showCheckbox` - Zobraziť checkbox stĺpec
- `showValidationAlerts` - Zobraziť ValidationAlerts stĺpec
- `showDeleteButton` - Zobraziť Delete tlačidlo
- `showInsertButton` - Zobraziť Insert tlačidlo
- `minRowHeight` - Minimálna výška riadku (default: 35px)

---

## Theme Types (types/theme.ts)

### DataGridTheme
```typescript
export interface DataGridTheme {
  // Cell colors
  cellColors: {
    defaultBackground: string
    hoverBackground: string
    selectedBackground: string
    selectedHoverBackground: string
    focusedBorderColor: string
    editingBackground: string
    readOnlyBackground: string
    disabledBackground: string
    disabledForeground: string
  }

  // Row colors
  rowColors: {
    defaultBackground: string
    alternateBackground: string
    hoverBackground: string
  }

  // Header colors
  headerColors: {
    background: string
    foreground: string
    borderColor: string
    sortIndicatorColor: string
    hoverBackground: string
  }

  // Border colors
  borderColors: {
    gridBorder: string
    cellBorder: string
    focusedCell: string
  }

  // Validation colors
  validationColors: {
    errorBackground: string
    errorBorder: string
    errorForeground: string
    warningBackground: string
    warningBorder: string
    warningForeground: string
    infoBackground: string
    infoBorder: string
    infoForeground: string
    criticalBackground: string
    criticalBorder: string
    criticalForeground: string
  }

  // UI element colors
  uiColors: {
    paginationBackground: string
    paginationForeground: string
    paginationBorder: string
    paginationButtonHoverBackground: string
    resizeGripColor: string
    menuBackground: string
    menuForeground: string
    menuHoverBackground: string
    dialogBackground: string
    dialogForeground: string
    dialogBorder: string
    filterBackground: string
    filterForeground: string
    filterBorder: string
    placeholderColor: string
  }

  // Font settings
  fontSettings: {
    fontFamily: string
    fontSize: string
    headerFontWeight: string
  }
}
```

### ListBoxTheme
```typescript
export interface ListBoxTheme {
  // Container colors
  containerBackground: string
  containerBorder: string

  // Item colors
  itemBackground: string
  itemForeground: string
  itemHoverBackground: string
  itemHoverForeground: string
  itemSelectedBackground: string
  itemSelectedForeground: string
  itemSelectedHoverBackground: string
  itemSelectedHoverForeground: string
  itemDisabledBackground: string
  itemDisabledForeground: string

  // Search bar colors
  searchBarBackground: string
  searchBarForeground: string
  searchBarBorder: string
  searchBarPlaceholder: string

  // Reset button colors
  resetButtonBackground: string
  resetButtonForeground: string
  resetButtonBorder: string
  resetButtonHoverBackground: string
  resetButtonHoverForeground: string

  // Scrollbar colors
  scrollbarTrackBackground: string
  scrollbarThumbBackground: string
  scrollbarThumbHoverBackground: string

  // Border settings
  borderRadius: string
  borderWidth: string

  // Font settings
  fontFamily: string
  fontSize: string
  fontWeight: string
}
```

### Default Themes

#### defaultDataGridTheme

**Kontext:**
- **Čo robí:** Definuje predvolené farebné schémy pre DataGrid komponent
- **Účel:** Poskytuje štandardný vzhľad gridu bez nutnosti custom konfigurácie
- **Farebná paleta:**
  - **Svetlé farby** - Základný light theme s bielym pozadím
  - **Hover states** - Jemné sivé tóny pre interaktívne elementy
  - **Selection** - Modrá paleta (#e3f2fd, #bbdefb) pre selected bunky
  - **Validation** - Červená (error), žltá (warning), modrá (info), tmavo červená (critical)
  - **Borders** - Svetlo sivé (#dee2e6, #e0e0e0) pre jemné oddelenie
- **Prečo:**
  - Professional look out-of-the-box
  - WCAG accessible kontrast ratios
  - Konzistentné s Material Design a Bootstrap štýlmi
  - Ľahko prepísateľné cez `Partial<DataGridTheme>` prop
- **Použitie:**
  - Automaticky aplikované ak nie je poskytnutý custom theme
  - Môže byť mergované s user overrides v `mergedTheme` computed
- **Poznámky:**
  - Hex color values pre kompatibilitu s CSS
  - Font family používa system fonts (performance)

```typescript
export const defaultDataGridTheme: DataGridTheme = {
  cellColors: {
    defaultBackground: '#ffffff',
    hoverBackground: '#f0f0f0',
    selectedBackground: '#e3f2fd',
    selectedHoverBackground: '#bbdefb',
    focusedBorderColor: '#2196f3',
    editingBackground: '#fff9c4',
    readOnlyBackground: '#f5f5f5',
    disabledBackground: '#e0e0e0',
    disabledForeground: '#9e9e9e'
  },
  rowColors: {
    defaultBackground: '#ffffff',
    alternateBackground: '#f9f9f9',
    hoverBackground: '#f5f5f5'
  },
  headerColors: {
    background: '#f5f5f5',
    foreground: '#212529',
    borderColor: '#dee2e6',
    sortIndicatorColor: '#2196f3',
    hoverBackground: '#e9ecef'
  },
  borderColors: {
    gridBorder: '#dee2e6',
    cellBorder: '#e0e0e0',
    focusedCell: '#2196f3'
  },
  validationColors: {
    errorBackground: '#ffebee',
    errorBorder: '#f44336',
    errorForeground: '#c62828',
    warningBackground: '#fff3cd',
    warningBorder: '#ffc107',
    warningForeground: '#856404',
    infoBackground: '#e3f2fd',
    infoBorder: '#2196f3',
    infoForeground: '#0d47a1',
    criticalBackground: '#ffcdd2',
    criticalBorder: '#d32f2f',
    criticalForeground: '#b71c1c'
  },
  uiColors: {
    paginationBackground: '#f8f9fa',
    paginationForeground: '#212529',
    paginationBorder: '#dee2e6',
    paginationButtonHoverBackground: '#e9ecef',
    resizeGripColor: '#dee2e6',
    menuBackground: '#ffffff',
    menuForeground: '#212529',
    menuHoverBackground: '#f8f9fa',
    dialogBackground: '#ffffff',
    dialogForeground: '#212529',
    dialogBorder: '#dee2e6',
    filterBackground: '#ffffff',
    filterForeground: '#212529',
    filterBorder: '#dee2e6',
    placeholderColor: '#6c757d'
  },
  fontSettings: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    headerFontWeight: '600'
  }
}
```

#### defaultListBoxTheme

**Kontext:**
- **Čo robí:** Definuje predvolené farebné schémy pre ListBox komponent
- **Účel:** Poskytuje štandardný vzhľad listboxu konzistentný s DataGrid
- **Farebná paleta:**
  - **Container** - Biele pozadie s jemným sivým borderom
  - **Items** - Transparent background, hover sivá (#f8f9fa)
  - **Selected state** - Modrá paleta (#e3f2fd) zhodná s DataGrid
  - **Disabled items** - Sivé tóny (#f5f5f5, #9e9e9e)
  - **Search bar** - Biely input s placeholder farbou (#6c757d)
  - **Reset button** - Sivé pozadie (#f8f9fa) s darker hover
  - **Scrollbar** - Custom styled scrollbar (sivé tóny)
- **Prečo:**
  - Vizuálna konzistencia s DataGrid komponentom
  - Jasný selected vs hover vs default state feedback
  - Custom scrollbar styling pre konzistentný cross-browser vzhľad
  - Border radius a spacing pre moderný UI
- **Použitie:**
  - Automaticky aplikované na ListBox bez custom theme
  - Možnosť override cez `Partial<ListBoxTheme>` prop
- **Poznámky:**
  - Font settings (14px, 400 weight) sú zhodné s DataGrid
  - Border radius 4px pre zaoblené rohy
  - Všetky farby sú hex pre jednoduché CSS variables mapping

```typescript
export const defaultListBoxTheme: ListBoxTheme = {
  containerBackground: '#ffffff',
  containerBorder: '#dee2e6',
  itemBackground: 'transparent',
  itemForeground: '#212529',
  itemHoverBackground: '#f8f9fa',
  itemHoverForeground: '#212529',
  itemSelectedBackground: '#e3f2fd',
  itemSelectedForeground: '#0d47a1',
  itemSelectedHoverBackground: '#bbdefb',
  itemSelectedHoverForeground: '#0d47a1',
  itemDisabledBackground: '#f5f5f5',
  itemDisabledForeground: '#9e9e9e',
  searchBarBackground: '#ffffff',
  searchBarForeground: '#212529',
  searchBarBorder: '#ced4da',
  searchBarPlaceholder: '#6c757d',
  resetButtonBackground: '#f8f9fa',
  resetButtonForeground: '#495057',
  resetButtonBorder: '#ced4da',
  resetButtonHoverBackground: '#e9ecef',
  resetButtonHoverForeground: '#212529',
  scrollbarTrackBackground: '#f1f1f1',
  scrollbarThumbBackground: '#c1c1c1',
  scrollbarThumbHoverBackground: '#a8a8a8',
  borderRadius: '4px',
  borderWidth: '1px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  fontWeight: '400'
}
```

### Theme Utility Functions

#### generateDataGridCSSVariables

**Kontext:**
- **Čo robí:** Konvertuje DataGridTheme objekt na CSS custom properties (CSS variables)
- **Vstup:** `theme: DataGridTheme` - objekt s farebnou schémou
- **Výstup:** `Record<string, string>` - objekt s CSS variable názvami a hodnotami
- **Prečo:**
  - CSS variables umožňujú dynamické theming bez regenerácie CSS
  - Prefix `--dg-` (DataGrid) zabraňuje konfliktom s inými knižnicami
  - Všetky theme properties sú namapované na CSS variables
  - Vue môže použiť tento objekt v `:style` binding pre inline styles
- **Použitie:**
  ```vue
  <div :style="cssVariables">
    <!-- Všetky child elementy majú prístup k --dg-* variables -->
  </div>
  ```
- **Mapovanie:**
  - `theme.cellColors.defaultBackground` → `'--dg-cell-bg'`
  - `theme.headerColors.background` → `'--dg-header-bg'`
  - `theme.validationColors.errorBackground` → `'--dg-validation-error-bg'`
  - atď. pre všetky theme properties
- **Poznámky:**
  - Vráti ~60+ CSS variables
  - CSS variables sú scope-ované na komponent (cascade down)
  - Hodnoty sú string (hex colors, px values)

```typescript
export function generateDataGridCSSVariables(theme: DataGridTheme): Record<string, string> {
  return {
    // Cell colors
    '--dg-cell-bg': theme.cellColors.defaultBackground,
    '--dg-cell-hover-bg': theme.cellColors.hoverBackground,
    '--dg-cell-selected-bg': theme.cellColors.selectedBackground,
    '--dg-cell-selected-hover-bg': theme.cellColors.selectedHoverBackground,
    '--dg-border-focused-cell': theme.cellColors.focusedBorderColor,
    '--dg-cell-editing-bg': theme.cellColors.editingBackground,
    '--dg-cell-readonly-bg': theme.cellColors.readOnlyBackground,
    '--dg-cell-disabled-bg': theme.cellColors.disabledBackground,
    '--dg-cell-disabled-fg': theme.cellColors.disabledForeground,

    // Row colors
    '--dg-row-default-bg': theme.rowColors.defaultBackground,
    '--dg-row-alternate-bg': theme.rowColors.alternateBackground,
    '--dg-row-hover-bg': theme.rowColors.hoverBackground,

    // Header colors
    '--dg-header-bg': theme.headerColors.background,
    '--dg-header-fg': theme.headerColors.foreground,
    '--dg-header-border': theme.headerColors.borderColor,
    '--dg-header-sort-indicator': theme.headerColors.sortIndicatorColor,
    '--dg-header-hover-bg': theme.headerColors.hoverBackground,

    // Border colors
    '--dg-border-grid': theme.borderColors.gridBorder,
    '--dg-border-cell': theme.borderColors.cellBorder,

    // Validation colors
    '--dg-validation-error-bg': theme.validationColors.errorBackground,
    '--dg-validation-error-border': theme.validationColors.errorBorder,
    '--dg-validation-error-fg': theme.validationColors.errorForeground,
    '--dg-validation-warning-bg': theme.validationColors.warningBackground,
    '--dg-validation-warning-border': theme.validationColors.warningBorder,
    '--dg-validation-warning-fg': theme.validationColors.warningForeground,
    '--dg-validation-info-bg': theme.validationColors.infoBackground,
    '--dg-validation-info-border': theme.validationColors.infoBorder,
    '--dg-validation-info-fg': theme.validationColors.infoForeground,
    '--dg-validation-critical-bg': theme.validationColors.criticalBackground,
    '--dg-validation-critical-border': theme.validationColors.criticalBorder,
    '--dg-validation-critical-fg': theme.validationColors.criticalForeground,

    // UI colors
    '--dg-ui-pagination-bg': theme.uiColors.paginationBackground,
    '--dg-ui-pagination-fg': theme.uiColors.paginationForeground,
    '--dg-ui-pagination-border': theme.uiColors.paginationBorder,
    '--dg-ui-pagination-button-hover-bg': theme.uiColors.paginationButtonHoverBackground,
    '--dg-ui-resize-grip': theme.uiColors.resizeGripColor,
    '--dg-ui-menu-bg': theme.uiColors.menuBackground,
    '--dg-ui-menu-fg': theme.uiColors.menuForeground,
    '--dg-ui-menu-hover-bg': theme.uiColors.menuHoverBackground,
    '--dg-ui-dialog-bg': theme.uiColors.dialogBackground,
    '--dg-ui-dialog-fg': theme.uiColors.dialogForeground,
    '--dg-ui-dialog-border': theme.uiColors.dialogBorder,
    '--dg-ui-filter-bg': theme.uiColors.filterBackground,
    '--dg-ui-filter-fg': theme.uiColors.filterForeground,
    '--dg-ui-filter-border': theme.uiColors.filterBorder,
    '--dg-ui-placeholder': theme.uiColors.placeholderColor,

    // Font settings
    '--dg-font-family': theme.fontSettings.fontFamily,
    '--dg-font-size': theme.fontSettings.fontSize,
    '--dg-header-font-weight': theme.fontSettings.headerFontWeight
  }
}
```

#### generateListBoxCSSVariables

**Kontext:**
- **Čo robí:** Konvertuje ListBoxTheme objekt na CSS custom properties pre ListBox styling
- **Vstup:** `theme: ListBoxTheme` - objekt s farebnou schémou listboxu
- **Výstup:** `Record<string, string>` - objekt s CSS variable názvami a hodnotami
- **Prečo:**
  - Prefix `--lb-` (ListBox) odlišuje od DataGrid variables (`--dg-`)
  - Umožňuje dynamické theming ListBox bez CSS regenerácie
  - Jednoduchá integrácia s Vue :style binding
  - Konzistentné s DataGrid theming prístupom
- **Použitie:**
  ```vue
  <div class="listbox" :style="cssVariables">
    <!-- ListBox komponenty používajú --lb-* variables v CSS -->
  </div>
  ```
- **Mapovanie:**
  - `theme.containerBackground` → `'--lb-container-bg'`
  - `theme.itemSelectedBackground` → `'--lb-item-selected-bg'`
  - `theme.searchBarBackground` → `'--lb-search-bg'`
  - `theme.scrollbarThumbBackground` → `'--lb-scrollbar-thumb-bg'`
  - atď. pre všetky ListBoxTheme properties
- **Poznámky:**
  - Vráti ~25+ CSS variables
  - Zahŕňa aj non-color properties (borderRadius, fontSize, fontWeight)
  - Variables sú použité v ListBox.vue scoped styles

```typescript
export function generateListBoxCSSVariables(theme: ListBoxTheme): Record<string, string> {
  return {
    '--lb-container-bg': theme.containerBackground,
    '--lb-container-border': theme.containerBorder,
    '--lb-item-bg': theme.itemBackground,
    '--lb-item-fg': theme.itemForeground,
    '--lb-item-hover-bg': theme.itemHoverBackground,
    '--lb-item-hover-fg': theme.itemHoverForeground,
    '--lb-item-selected-bg': theme.itemSelectedBackground,
    '--lb-item-selected-fg': theme.itemSelectedForeground,
    '--lb-item-selected-hover-bg': theme.itemSelectedHoverBackground,
    '--lb-item-selected-hover-fg': theme.itemSelectedHoverForeground,
    '--lb-item-disabled-bg': theme.itemDisabledBackground,
    '--lb-item-disabled-fg': theme.itemDisabledForeground,
    '--lb-search-bg': theme.searchBarBackground,
    '--lb-search-fg': theme.searchBarForeground,
    '--lb-search-border': theme.searchBarBorder,
    '--lb-search-placeholder': theme.searchBarPlaceholder,
    '--lb-reset-btn-bg': theme.resetButtonBackground,
    '--lb-reset-btn-fg': theme.resetButtonForeground,
    '--lb-reset-btn-border': theme.resetButtonBorder,
    '--lb-reset-btn-hover-bg': theme.resetButtonHoverBackground,
    '--lb-reset-btn-hover-fg': theme.resetButtonHoverForeground,
    '--lb-scrollbar-track-bg': theme.scrollbarTrackBackground,
    '--lb-scrollbar-thumb-bg': theme.scrollbarThumbBackground,
    '--lb-scrollbar-thumb-hover-bg': theme.scrollbarThumbHoverBackground,
    '--lb-border-radius': theme.borderRadius,
    '--lb-border-width': theme.borderWidth,
    '--lb-font-family': theme.fontFamily,
    '--lb-font-size': theme.fontSize,
    '--lb-font-weight': theme.fontWeight
  }
}
```

---

## Validation Types

### ValidationRule
```typescript
export interface ValidationRule {
  columnName: string
  ruleType: 'Required' | 'Regex' | 'Range' | 'Custom'
  errorMessage: string
  regexPattern?: string      // For Regex
  minValue?: any             // For Range
  maxValue?: any             // For Range
  severity: 'Info' | 'Warning' | 'Error' | 'Critical'
  customValidator?: (value: any) => boolean  // For Custom
}
```

### ValidationError
```typescript
export interface ValidationError {
  rowId: string
  columnName: string
  message: string
  severity: string
}
```

### ValidationResult
```typescript
export interface ValidationResult {
  isValid: boolean
  error?: string
  severity?: string
}
```

---

## Filter Types

### FilterExpression (Union Type)
```typescript
export type FilterExpression = SimpleFilter | CompositeFilter
```

### SimpleFilter
```typescript
export interface SimpleFilter {
  type: 'simple'
  columnName: string
  operator: FilterOperator
  value: any
}
```

### CompositeFilter (Recursive Tree)
```typescript
export interface CompositeFilter {
  type: 'composite'
  left: FilterExpression  // Can be SimpleFilter or CompositeFilter
  right: FilterExpression
  operator: 'AND' | 'OR'
}
```

### FilterOperator
```typescript
export type FilterOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'StartsWith'
  | 'EndsWith'
  | 'GreaterThan'
  | 'LessThan'
  | 'GreaterThanOrEquals'
  | 'LessThanOrEquals'
  | 'IsEmpty'
  | 'IsNotEmpty'
```

---

## Search Types

### SearchMode
```typescript
export type SearchMode = 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith' | 'Regex' | 'Fuzzy'
```

### SearchMatch
```typescript
export interface SearchMatch {
  rowId: string
  columnName: string
  value: string
}
```

### SearchOptions
```typescript
export interface SearchOptions {
  caseSensitive?: boolean
  fuzzyThreshold?: number  // For Fuzzy mode (Levenshtein distance)
}
```

---

## Auto Row Height Types

### AutoRowHeightConfig
```typescript
export interface AutoRowHeightConfig {
  minHeight: number        // Default: 35
  maxHeight: number        // Default: 400 (dynamically set to 70% of container)
  fontFamily: string       // Must match CSS
  fontSize: number         // Must match CSS (14px)
  enableWrapping: boolean  // Default: true
  padding: number          // Horizontal padding (16px = 8+8)
}
```

### RowHeightResult
```typescript
export interface RowHeightResult {
  rowId: string
  calculatedHeight: number
  isSuccess: boolean
}
```

---

## Copy/Paste Types

### CopyPasteOptions
```typescript
export interface CopyPasteOptions {
  includeHeaders?: boolean
}
```

### CopyPasteResult
```typescript
export interface CopyPasteResult {
  success: boolean
  message?: string
  processedRows?: number
  rows?: Record<string, any>[]  // Parsed data (paste only)
  headers?: string[]             // Column headers (paste only)
}
```

---

## ListBox Types

### ListBoxItem
```typescript
export interface ListBoxItem {
  value: string       // Unique identifier
  label: string       // Display text
  disabled?: boolean  // Item is disabled and cannot be selected
}
```

### ListBoxConfig
```typescript
export interface ListBoxConfig {
  allowMultiple: boolean     // Single or multi-select mode
  showSearchBar: boolean     // Show search filter input
  showResetButton: boolean   // Show "Clear Selection" button
  enableKeyboardNav: boolean // Arrow keys and Enter/Space
  caseSensitiveSearch: boolean // Search matching mode
}
```

---

## Použitie Types

### Type Import
```typescript
import type {
  GridCell,
  GridRow,
  GridColumn,
  GridConfig
} from '@/types/grid'

import type {
  DataGridTheme,
  ListBoxTheme
} from '@/types/theme'

import type {
  ValidationRule,
  ValidationError,
  ValidationResult
} from '@/composables/useValidation'

import type {
  FilterExpression,
  SimpleFilter,
  CompositeFilter,
  FilterOperator
} from '@/composables/useFiltering'
```

### Type Guards
```typescript
// Check if filter is SimpleFilter
function isSimpleFilter(filter: FilterExpression): filter is SimpleFilter {
  return filter.type === 'simple'
}

// Check if filter is CompositeFilter
function isCompositeFilter(filter: FilterExpression): filter is CompositeFilter {
  return filter.type === 'composite'
}

// Usage
if (isSimpleFilter(filter)) {
  console.log(filter.columnName)  // OK - type narrowed to SimpleFilter
} else {
  console.log(filter.left)  // OK - type narrowed to CompositeFilter
}
```

### Type Assertions
```typescript
// When you know the type
const filter = filterExpression as SimpleFilter
console.log(filter.columnName)

// With validation
if (filter.type === 'simple') {
  const simpleFilter = filter as SimpleFilter
  console.log(simpleFilter.columnName)
}
```

---

## Záver

RPA-WEB-UI poskytuje komplexný typový systém pre type-safe vývoj. Všetky interfaces sú exportované a môžu byť použité v user aplikáciách pre bezpečné typovanie dát.
