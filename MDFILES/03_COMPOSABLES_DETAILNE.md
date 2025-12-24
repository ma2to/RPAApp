# Composables - Detailná Dokumentácia

## Prehľad

Composables sú reusable Vue 3 composition API funkcie, ktoré zapuzdrujú logiku a state. RPA-WEB-UI knižnica poskytuje 12 composables pre rôzne funkcionality.

## Zoznam Composables

1. **useValidation** - Validačný systém
2. **useAutoRowHeight** - Automatické výšky riadkov
3. **useCopyPaste** - Copy/Paste funkcionalita
4. **useFiltering** - Filtrovanie dát
5. **useSearch** - Vyhľadávanie
6. **useSelection** - Správa výberu buniek
7. **useSorting** - Radenie dát
8. **useImportExport** - Import/Export
9. **useShortcuts** - Klávesové skratky
10. **useTheme** - Správa tém
11. **useLogger** - Logovanie
12. **useConditionalLogging** - Podmienené logovanie

---

## 1. useValidation

### Účel

**[KONTEXT BUDE PRIDANÝ]**

**Primárna funkcia:** Kompletný validačný systém pre DataGrid bunky s podporou 4 typov pravidiel (Required, Regex, Range, Custom), batch processing a real-time validácie.

**Prečo existuje:**
- **Flexibilný validačný systém** - podporuje rôzne typy validácie (email, telefón, čísla v rozsahu, custom business logic)
- **Výkonová optimalizácia** - batch processing s `skipErrorCountUpdate` parametrom pre hromadnú validáciu tisícov buniek
- **Real-time feedback** - throttled validácia počas editácie (300ms debounce) pre plynulú UX
- **Multiple severity levels** - Info, Warning, Error, Critical - rôzne vizuálne indikátory

**Kľúčové features:**
- **4 typy pravidiel:** Required (povinné pole), Regex (pattern matching), Range (min/max hodnoty), Custom (vlastná funkcia)
- **Batch validation:** `validateAll()` s dynamic batch size (25-200 cells) a UI yielding cez `await nextTick()`
- **Empty row handling:** Prázdne riadky sa ignorujú (nevalidujú sa) - iba riadky s aspoň jednou vyplnenou bunkou
- **Error tracking:** Reactive `validationErrors` object + `errorCount` ref pre watch triggering
- **Direct vs Throttled:** `validateCellDirect()` pre bulk operácie, `validateCellThrottled()` pre user input

**Použitie:** Pridáva sa cez `const validation = useValidation()` v DataGrid.vue a poskytuje sa cez `provide('validation')` pre child komponenty.

### Import

**Kontext:**
- **Čo robí:** Import useValidation composable a TypeScript type definícií
- **Vstup:** Cesta k composable súboru v src/ štruktúre
- **Výstup:**
  - `useValidation` - funkcia pre vytvorenie validation instance
  - `ValidationRule` - type pre definíciu validačného pravidla
  - `ValidationError` - type pre validation error objekt
- **Prečo:**
  - Separátny import types cez `type` keyword (TypeScript optimalizácia - compile-time only)
  - Named imports pre tree-shaking (nepoužité exports sa nevložia do bundle)
- **Poznámky:** V production build sú `type` importy odstránené (nevytvoria runtime overhead)

```typescript
import { useValidation, type ValidationRule, type ValidationError } from '@/composables/useValidation'
```

### Interface Definície

#### ValidationRule

**Kontext:**
- **Čo robí:** Definuje štruktúru validačného pravidla pre stĺpec
- **Použitie:** Používa sa v `addValidationRule()` pre konfiguráciu validácie
- **Properties:**
  - `columnName` - Názov stĺpca na ktorý sa pravidlo aplikuje
  - `ruleType` - Typ validácie: Required (povinné pole), Regex (pattern matching), Range (min/max), Custom (vlastná funkcia)
  - `errorMessage` - Text chyby zobrazený používateľovi pri nevalidnej hodnote
  - `regexPattern` - Regular expression string (iba pre Regex typ)
  - `minValue/maxValue` - Hraničné hodnoty (iba pre Range typ)
  - `severity` - Úroveň závažnosti (Info=modrá, Warning=žltá, Error=červená, Critical=tmavo červená)
  - `customValidator` - Vlastná validation funkcia (iba pre Custom typ)
- **Poznámky:**
  - Jedno pravidlo = jedna validačná podmienka
  - Stĺpec môže mať viacero pravidiel (napr. Required + Regex)
  - Severity určuje farbu a vizuálny feedback v UI

```typescript
interface ValidationRule {
  columnName: string
  ruleType: 'Required' | 'Regex' | 'Range' | 'Custom'
  errorMessage: string
  regexPattern?: string      // Pre Regex validation
  minValue?: any             // Pre Range validation
  maxValue?: any             // Pre Range validation
  severity: 'Info' | 'Warning' | 'Error' | 'Critical'
  customValidator?: (value: any) => boolean  // Pre Custom validation
}
```

#### ValidationError

**Kontext:**
- **Čo robí:** Definuje štruktúru validation error objektu uloženého v store
- **Použitie:** Vráti sa z `getValidationErrors(rowId)`, uložené v `validationErrors` reactive object
- **Properties:**
  - `rowId` - ID riadku s chybou
  - `columnName` - Názov stĺpca s chybou
  - `message` - Text chybovej správy (z ValidationRule.errorMessage)
  - `severity` - Úroveň závažnosti (Info/Warning/Error/Critical)
- **Prečo:**
  - Umožňuje viazanie chýb k špecifickej bunke (rowId + columnName)
  - Severity určuje vizuálny štýl (farba pozadia bunky)
  - Message sa zobrazuje v tooltip alebo ValidationAlerts stĺpci
- **Poznámky:** Errors sú zoskupené po riadkoch v `validationErrors` objekte: `{ [rowId]: ValidationError[] }`

```typescript
interface ValidationError {
  rowId: string
  columnName: string
  message: string
  severity: string
}
```

#### ValidationResult

**Kontext:**
- **Čo robí:** Definuje návratový typ synchronnej validácie `validateCell()`
- **Použitie:** Immediate feedback o validite hodnoty bez ukladania do store
- **Properties:**
  - `isValid` - Boolean flag či je hodnota validná
  - `error` - Text chyby (undefined ak je valid)
  - `severity` - Úroveň závažnosti (undefined ak je valid)
- **Prečo:**
  - Rýchla synchronná kontrola bez side-effects
  - Lightweight - nemodifikuje store state
  - Používa sa v helper funkciách a computed properties
- **Poznámky:** Pre uloženie do store použite `validateCellDirect()` namiesto `validateCell()`

```typescript
interface ValidationResult {
  isValid: boolean
  error?: string
  severity?: string
}
```

### Return Values

**Kontext:**
- **Čo robí:** Definuje kompletné API useValidation composable
- **Vstup:** Žiadne parametre pri volaní `useValidation()`
- **Výstup:** Objekt s reactive refs, metódami a validation state
- **Hlavné komponenty:**
  - **State refs:**
    - `validationRules` - Map stĺpec → array pravidiel (reactive)
    - `validationErrors` - Object rowId → array chýb (reactive)
    - `errorCount/ruleCount` - Counters pre watch triggering
  - **Metódy:**
    - `addValidationRule()` - Pridá nové pravidlo
    - `validateCell()` - Sync validácia bez uloženia
    - `validateCellDirect()` - Async validácia s uložením do store
    - `validateCellThrottled()` - Debounced validácia pre user input (300ms)
    - `validateAll()` - Bulk validácia všetkých buniek
    - `getValidationErrors()` - Získa chyby pre riadok
    - `clearValidationErrors()` - Vymaže všetky chyby
    - `updateErrorCount()` - Manuálny refresh error count
- **Prečo:**
  - Poskytuje kompletné validation API pre DataGrid
  - Reactive state automaticky triggeruje UI updates
  - Throttled vs Direct pre rôzne use cases (user typing vs batch operations)
- **Poznámky:**
  - `Map` pre rules namiesto objektu (O(1) lookup, reactive iterovanie)
  - Error count a rule count sú separátne refs kvôli reactivity limitáciám Map

```typescript
{
  validationRules: Ref<Map<string, ValidationRule[]>>,  // Per-column rules
  validationErrors: Reactive<Record<string, ValidationError[]>>, // Per-row errors
  errorCount: Ref<number>,      // Reactive counter for watchers
  ruleCount: Ref<number>,       // Reactive counter for watchers
  addValidationRule: (rule: ValidationRule) => void,
  validateCell: (rowId, columnName, value) => ValidationResult,
  validateCellDirect: (rowId, columnName, value, rowCells?, skipErrorCountUpdate?) => Promise<void>,
  validateCellThrottled: (rowId, columnName, value, rowCells?) => Promise<void>,
  validateAll: (rows) => Promise<{ isValid: boolean; totalErrors: number; errors: ValidationError[] }>,
  getValidationErrors: (rowId: string) => ValidationError[],
  clearValidationErrors: () => void,
  updateErrorCount: () => void  // Manual error count refresh
}
```

### Použitie

#### Pridanie Validation Rules
```typescript
const validation = useValidation()

// Required field
validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Required',
  errorMessage: 'Email is required',
  severity: 'Error'
})

// Regex validation
validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Regex',
  regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
  errorMessage: 'Invalid email format',
  severity: 'Error'
})

// Range validation
validation.addValidationRule({
  columnName: 'age',
  ruleType: 'Range',
  minValue: 18,
  maxValue: 120,
  errorMessage: 'Age must be between 18 and 120',
  severity: 'Warning'
})

// Custom validation
validation.addValidationRule({
  columnName: 'username',
  ruleType: 'Custom',
  customValidator: (value) => {
    return /^[a-zA-Z0-9_]+$/.test(value)
  },
  errorMessage: 'Username can only contain letters, numbers, and underscores',
  severity: 'Error'
})
```

#### Validácia Single Cell
```typescript
// Synchronous validation
const result = validation.validateCell('row-123', 'email', 'test@example.com')
if (!result.isValid) {
  console.error(result.error)
}

// Async throttled validation (300ms debounce) - pre user input
await validation.validateCellThrottled('row-123', 'email', 'test@example.com', rowCells)

// Async direct validation (no debounce) - pre batch operations
await validation.validateCellDirect('row-123', 'email', 'test@example.com', rowCells, true)
// skipErrorCountUpdate=true pre bulk validation (updateErrorCount voláme raz na konci)
```

#### Validácia Všetkých Buniek
```typescript
const result = await validation.validateAll(rows)

console.log(`Valid: ${result.isValid}`)
console.log(`Total Errors: ${result.totalErrors}`)
console.log('Errors:', result.errors)
```

#### Getting Errors
```typescript
// Get errors for specific row
const rowErrors = validation.getValidationErrors('row-123')
rowErrors.forEach(error => {
  console.log(`${error.columnName}: ${error.message} (${error.severity})`)
})

// Watch error count
watch(() => validation.errorCount.value, (count) => {
  console.log(`Total rows with errors: ${count}`)
})

// Watch rule count (triggers when rules are added)
watch(() => validation.ruleCount.value, (count) => {
  console.log(`Total validation rules: ${count}`)
})
```

### Implementačné Detaily

#### Empty Row Detection
```typescript
function isRowCompletelyEmpty(rowCells: Array<{ columnName: string; value: any }>): boolean {
  return rowCells.every(cell => cell.value == null || cell.value === '')
}
```
- Prázdne riadky sa automaticky skipujú
- Validačné errors pre prázdne riadky sa automaticky čistia

#### Batch Processing
```typescript
async function validateAll(rows: any[]) {
  const BATCH_SIZE = 50  // 50 rows per batch

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batch = rows.slice(batchStart, batchEnd)

    for (const row of batch) {
      // Skip empty rows
      if (isRowCompletelyEmpty(row.cells)) continue

      for (const cell of row.cells) {
        const result = validateCell(row.rowId, cell.columnName, cell.value)
        // ... add errors
      }
    }

    await nextTick() // Yield to UI
  }

  updateErrorCount()
}
```

#### Reactive Counters
```typescript
// errorCount - reactive counter for watchers
const errorCount = ref(0)

function updateErrorCount() {
  errorCount.value = Object.keys(validationErrors).length
}

// ruleCount - reactive counter for watchers (Map.set doesn't trigger reactivity)
const ruleCount = ref(0)

function addValidationRule(rule: ValidationRule) {
  const rules = validationRules.value.get(rule.columnName) || []
  rules.push(rule)
  validationRules.value.set(rule.columnName, rules)
  ruleCount.value++  // Trigger watch
}
```

#### Validation Types

##### Required Validation
```typescript
if (rule.ruleType === 'Required') {
  if (value == null || value === '') {
    return { isValid: false, error: rule.errorMessage, severity: rule.severity }
  }
}
```

##### Regex Validation
```typescript
if (rule.ruleType === 'Regex' && rule.regexPattern) {
  const regex = new RegExp(rule.regexPattern)
  if (!regex.test(String(value))) {
    return { isValid: false, error: rule.errorMessage, severity: rule.severity }
  }
}
```

##### Range Validation
```typescript
if (rule.ruleType === 'Range') {
  const numValue = Number(value)
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Value must be a number', severity: rule.severity }
  }

  if (rule.minValue != null && numValue < rule.minValue) {
    return { isValid: false, error: rule.errorMessage, severity: rule.severity }
  }

  if (rule.maxValue != null && numValue > rule.maxValue) {
    return { isValid: false, error: rule.errorMessage, severity: rule.severity }
  }
}
```

##### Custom Validation
```typescript
if (rule.ruleType === 'Custom' && rule.customValidator) {
  if (!rule.customValidator(value)) {
    return { isValid: false, error: rule.errorMessage, severity: rule.severity }
  }
}
```

---

## 2. useAutoRowHeight

### Účel

**[KONTEXT BUDE PRIDANÝ]**

**Primárna funkcia:** Automatické výpočty výšky riadkov na základe obsahu buniek pomocou Canvas API pre presné meranie textu. Podporuje multi-line text, word wrapping a dynamické prispôsobenie výšky.

**Prečo existuje:**
- **Dynamická výška riadkov** - riadky sa automaticky roztiahnu na zobrazenie celého obsahu (ako v Exceli)
- **Canvas API meranie** - pixel-perfect výpočty namiesto DOM rendering (rýchlejšie, presnejšie)
- **Word wrapping support** - text sa zalomí na viacero riadkov podľa šírky stĺpca
- **Real-time resize** - výška sa prepočíta pri editácii, zmene šírky stĺpca alebo validation errors

**Kľúčové features:**
- **On/Off toggle:** `toggleAutoRowHeight()` - zapnutie/vypnutie AutoRowHeight režimu
- **Canvas measurement:** Používa off-screen canvas element pre meranie textu bez DOM manipulácie
- **Fast newline calculation:** `resetAllRowHeights()` - rýchly prepočet na základe počtu `\n` znakov (fallback keď je AutoRowHeight vypnutý)
- **Single row optimization:** `recalculateRowHeightAfterEdit()` - prepočíta iba jeden riadok po editácii (nie všetky)
- **Batch processing:** Prepočet všetkých riadkov v batchoch s `await nextTick()` pre UI yielding

**Použitie:** Voliteľná funkcia - zapína sa cez `autoRowHeightEnabled` prop v DataGrid.vue. Keď je vypnutá, používa sa rýchly newline-based prepočet.

### Import
```typescript
import { useAutoRowHeight, type AutoRowHeightConfig, type RowHeightResult } from '@/composables/useAutoRowHeight'
```

### Interface Definície

#### AutoRowHeightConfig
```typescript
interface AutoRowHeightConfig {
  minHeight: number        // Default: 35px
  maxHeight: number        // Default: 400px (dynamicky sa nastaví na 70% container height)
  fontFamily: string       // Default: 'system-ui, -apple-system, sans-serif'
  fontSize: number         // Default: 14 (MUST match CSS)
  enableWrapping: boolean  // Default: true
  padding: number          // Default: 16 (horizontal padding)
}
```

#### RowHeightResult
```typescript
interface RowHeightResult {
  rowId: string
  calculatedHeight: number
  isSuccess: boolean
}
```

### Default Config
```typescript
export const defaultAutoRowHeightConfig: AutoRowHeightConfig = {
  minHeight: 35,
  maxHeight: 400,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 14,
  enableWrapping: true,
  padding: 16
}
```

### Return Values
```typescript
{
  calculateRowHeight: (row, columns) => RowHeightResult,
  calculateRowHeights: (rows, columns) => RowHeightResult[],
  applyAutoRowHeight: (rows, columns) => Promise<{ totalRowsUpdated: number; averageHeight: number }>,
  recalculateRows: (rows, rowIds, columns) => number,
  measureTextHeight: (text: string, width: number) => number,
  updateMaxHeight: (newMaxHeight: number) => void
}
```

### Použitie

#### Inicializácia
```typescript
const autoRowHeight = useAutoRowHeight({
  minHeight: 35,
  maxHeight: 400,
  fontSize: 14,
  enableWrapping: true
})
```

#### Aplikácia Auto Height na Všetky Riadky
```typescript
const columns = [
  { name: 'name', width: 150 },
  { name: 'description', width: 300 },
  { name: 'notes', width: 200 }
]

const result = await autoRowHeight.applyAutoRowHeight(store.rows, columns)
console.log(`Updated ${result.totalRowsUpdated} rows, avg height: ${result.averageHeight}px`)
```

#### Prepočítanie Špecifických Riadkov
```typescript
// After editing cell - recalculate single row
const updatedCount = autoRowHeight.recalculateRows(
  store.rows,
  ['row-123'],
  columns
)
```

#### Dynamic MaxHeight Update
```typescript
// Update maxHeight based on container height (70% of viewport)
const containerHeight = document.querySelector('.grid-container')?.clientHeight || 600
const newMaxHeight = Math.floor(containerHeight * 0.7)
autoRowHeight.updateMaxHeight(newMaxHeight)
```

### Implementačné Detaily

#### Canvas Measurement
```typescript
let canvas: HTMLCanvasElement | null = null
let context: CanvasRenderingContext2D | null = null

function getContext(): CanvasRenderingContext2D {
  if (!canvas) {
    canvas = document.createElement('canvas')
    context = canvas.getContext('2d')
  }

  context.font = `${config.fontSize}px ${config.fontFamily}`
  return context
}
```
- Canvas sa vytvorí raz a reusuje pre všetky merania
- Font MUSÍ byť synchronizovaný s CSS `.grid-cell`

#### Text Height Measurement s Multi-line Support
```typescript
function measureTextHeight(text: string, width: number): number {
  if (!text) return config.minHeight

  const ctx = getContext()

  // Split by newline characters FIRST (Shift+Enter support)
  const explicitLines = text.toString().split('\n')

  let lineHeight = config.fontSize * 1.5  // Line height = 1.5× font size
  let totalLines = 0

  for (const line of explicitLines) {
    if (!line || line.trim() === '') {
      totalLines++  // Empty line still counts
      continue
    }

    // Split line into words and calculate wrapping
    const words = line.split(' ')
    let currentLine = ''
    let linesInThisSegment = 1

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > width - config.padding) {
        // Line too long - wrap to next line
        if (currentLine) {
          linesInThisSegment++
          currentLine = word
        } else {
          // Single word too long - force on one line
          currentLine = word
        }
      } else {
        currentLine = testLine
      }
    }

    totalLines += linesInThisSegment
  }

  // Calculate total height
  const verticalPadding = 10  // 5px top + 5px bottom
  const totalHeight = totalLines * lineHeight + verticalPadding

  // Apply min/max constraints
  return Math.max(config.minHeight, Math.min(config.maxHeight, Math.ceil(totalHeight)))
}
```

**Kľúčové vlastnosti:**
- Rešpektuje explicitné `\n` (Shift+Enter)
- Word wrapping na základe skutočnej šírky stĺpca
- Canvas API pre presné meranie (nie aproximácia)

#### Batch Processing s UI Yielding
```typescript
async function applyAutoRowHeight(
  rows: Array<{ rowId: string; height: number; [key: string]: any }>,
  columns: Array<{ name: string; width: number; specialType?: string }>
): Promise<{ totalRowsUpdated: number; averageHeight: number }> {
  const BATCH_SIZE = 50

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batch = rows.slice(batchStart, batchEnd)

    for (const row of batch) {
      const result = calculateRowHeight(row, columns)
      if (result.isSuccess) {
        row.height = result.calculatedHeight
        totalHeight += result.calculatedHeight
        updatedCount++
      }
    }

    // Yield to UI thread
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  return {
    totalRowsUpdated: updatedCount,
    averageHeight: updatedCount > 0 ? totalHeight / updatedCount : config.minHeight
  }
}
```

#### Row Height Calculation
```typescript
function calculateRowHeight(
  row: Record<string, any>,
  columns: Array<{ name: string; width: number; specialType?: string }>
): RowHeightResult {
  try {
    let maxHeight = config.minHeight

    for (const column of columns) {
      // Skip special columns EXCEPT ValidationAlerts
      if (column.specialType && column.specialType !== 'ValidationAlerts') {
        continue
      }

      let cellValue = null
      if (row.cells && Array.isArray(row.cells)) {
        const cell = row.cells.find((c: any) => c.columnName === column.name)
        cellValue = cell?.value
      } else {
        cellValue = row[column.name]
      }

      if (cellValue == null) continue

      const textValue = String(cellValue)
      const cellHeight = measureTextHeight(textValue, column.width)

      maxHeight = Math.max(maxHeight, cellHeight)
    }

    return {
      rowId: row.__rowId || row.rowId,
      calculatedHeight: maxHeight,
      isSuccess: true
    }
  } catch (error) {
    console.error('Row height calculation failed:', error)
    return {
      rowId: row.__rowId || row.rowId,
      calculatedHeight: config.minHeight,
      isSuccess: false
    }
  }
}
```

---

## 3. useCopyPaste

### Účel

**[KONTEXT BUDE PRIDANÝ]**

**Primárna funkcia:** Excel-compatible copy/paste funkcionalita s podporou multi-line textu, TAB-separated values (TSV) formátu, a position preservation.

**Prečo existuje:**
- **Excel interoperabilita** - kopírovanie/vkladanie medzi DataGrid a Excel/Google Sheets funguje seamlessly
- **TSV formát** - tab-separated values - štandardný formát pre tabulkové dáta, kompatibilný s clipboard API
- **Position preservation** - pri paste sa zachováva relatívna pozícia buniek (paste 3x2 block na správne miesto)
- **Multi-line support** - správne spracováva newlines v bunkách (\n sa nezamieňa s tab delimiter)

**Kľúčové features:**
- `handleCopySelectedCells()` - konvertuje selected cells na TSV a kopíruje do clipboard
- `handlePasteSelectedCells()` - parsuje TSV z clipboardu a vkladá do gridu
- **Smart paste** - detekuje rozmery paste bloku a vkladá od aktuálne vybranej bunky
- **Keyboard shortcuts** - Ctrl+C / Ctrl+V (alebo Cmd+C/V na macOS) cez `handleKeyboardShortcuts()` v DataGrid.vue

**Použitie:** Automaticky dostupné v DataGrid - užívateľ iba označí bunky a stlačí Ctrl+C/V.

### Import
```typescript
import { useCopyPaste, type CopyPasteOptions, type CopyPasteResult } from '@/composables/useCopyPaste'
```

### Interface Definície

#### CopyPasteOptions
```typescript
interface CopyPasteOptions {
  includeHeaders?: boolean
}
```

#### CopyPasteResult
```typescript
interface CopyPasteResult {
  success: boolean
  message?: string
  processedRows?: number
  rows?: Record<string, any>[]  // Parsed data (paste only)
  headers?: string[]             // Column headers (paste only)
}
```

### Return Values
```typescript
{
  copyToClipboard: (rows, columnNames, options?) => Promise<CopyPasteResult>,
  copySelectedCells: (selectedCells, allRows, allColumns) => Promise<CopyPasteResult>,
  pasteFromClipboard: () => Promise<CopyPasteResult>,
  canPaste: () => boolean,
  clearClipboard: () => void
}
```

### Použitie

#### Copy Selected Cells (s Position Preservation)
```typescript
const copyPaste = useCopyPaste()

// Copy selected cells (non-contiguous)
const result = await copyPaste.copySelectedCells(
  store.selectedCells,  // Set<string> ("rowId:columnName")
  store.rows,
  allColumns
)

if (result.success) {
  console.log(result.message)  // "Copied 15 cells to clipboard"
}
```

#### Copy Full Rows
```typescript
const selectedRows = store.rows.filter(r => store.isRowChecked(r.rowId))
const columnNames = dataColumns.map(c => c.name)

const result = await copyPaste.copyToClipboard(selectedRows, columnNames, {
  includeHeaders: true
})
```

#### Paste from Clipboard
```typescript
const result = await copyPaste.pasteFromClipboard()

if (result.success && result.rows) {
  console.log(`Pasted ${result.rows.length} rows`)

  // Apply data to grid
  result.rows.forEach((rowData, rowOffset) => {
    const targetRow = store.rows[targetRowIndex + rowOffset]
    result.headers.forEach((columnKey, colOffset) => {
      const targetColumn = dataColumns[targetColIndex + colOffset]
      const value = rowData[columnKey] ?? null
      store.updateCell(targetRow.rowId, targetColumn.name, value)
    })
  })
}
```

### Excel TSV Format

#### Escapovanie Hodnôt (PRED kopírovaním)
```typescript
function escapeTsvValue(value: string): string {
  if (!value) return value

  // Check if quoting needed
  const needsQuoting = value.includes('\t') ||
                      value.includes('\n') ||
                      value.includes('\r') ||
                      value.includes('"')

  if (!needsQuoting) {
    return value  // Normal value - no escaping
  }

  // Escape quotes by doubling them, then wrap in quotes
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}
```

**Príklady:**
- `"NormalText"` → `NormalText` (no special chars)
- `"Multi\nLine"` → `"Multi\nLine"` (newline → quoted)
- `"Cell\tWith\tTab"` → `"Cell\tWith\tTab"` (tabs → quoted)
- `'Cell with "quote"'` → `"Cell with ""quote"""` (quote → doubled AND quoted)

#### Parsing TSV (PO vložení)
```typescript
function parseTabSeparated(clipboardText: string): { headers: string[], rows: Record<string, any>[] } {
  const result: Record<string, any>[] = []
  const currentRow: string[] = []
  let currentCell = ''
  let inQuotes = false
  let headers: string[] = []

  for (let i = 0; i < clipboardText.length; i++) {
    const c = clipboardText[i]
    const next = i + 1 < clipboardText.length ? clipboardText[i + 1] : null

    if (c === '"') {
      if (inQuotes && next === '"') {
        // Escaped quote ("") → append single quote
        currentCell += '"'
        i++  // Skip next quote
      } else {
        // Toggle quote mode (quotes NOT added to cell content)
        inQuotes = !inQuotes
      }
    } else if (c === '\t' && !inQuotes) {
      // Tab outside quotes = end of cell
      currentRow.push(currentCell)
      currentCell = ''
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      // Newline outside quotes = end of row
      if (c === '\r' && next === '\n') {
        i++  // Skip \n after \r (Windows CRLF)
      }

      if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell)
        currentCell = ''

        if (isFirstRow) {
          // Generate Column1, Column2, ... headers
          headers = currentRow.map((_, idx) => `Column${idx + 1}`)

          // Preserve first row as data (NOT header)
          const firstDataRow: Record<string, any> = {}
          for (let j = 0; j < headers.length; j++) {
            firstDataRow[headers[j]] = currentRow[j] ?? null
          }
          result.push(firstDataRow)

          isFirstRow = false
        } else {
          // Data row
          const dataRow: Record<string, any> = {}
          for (let j = 0; j < Math.min(headers.length, currentRow.length); j++) {
            dataRow[headers[j]] = currentRow[j] ?? null
          }
          result.push(dataRow)
        }

        currentRow.length = 0
      }
    } else {
      // Regular character - add to current cell
      currentCell += c
    }
  }

  // Handle last row if no trailing newline
  // ... (similar logic)

  return { headers, rows: result }
}
```

**Kľúčové vlastnosti:**
- Character-by-character parsing (nie Split)
- Rešpektuje embedded delimiters (tab, newline) inside quotes
- Unescapes quotes (`""` → `"`)
- Zachováva prázdne strings (použitím `??` namiesto `||`)

#### Position Preservation (Copy Selected Cells)
```typescript
// Calculate bounds of selected cells
const minRowIndex = Math.min(...cellPositions.map(c => c.rowIndex))
const maxRowIndex = Math.max(...cellPositions.map(c => c.rowIndex))
const minColIndex = Math.min(...cellPositions.map(c => c.columnIndex))
const maxColIndex = Math.max(...cellPositions.map(c => c.columnIndex))

// Build TSV with empty placeholders
const lines: string[] = []

for (let rowIdx = minRowIndex; rowIdx <= maxRowIndex; rowIdx++) {
  const rowCells: string[] = []

  for (let colIdx = minColIndex; colIdx <= maxColIndex; colIdx++) {
    const cellPos = cellPositions.find(c => c.rowIndex === rowIdx && c.columnIndex === colIdx)

    if (cellPos) {
      // Cell is selected - add its value
      const value = cellPos.value?.toString() ?? ''
      rowCells.push(escapeTsvValue(value))
    } else {
      // Cell NOT selected - add empty placeholder
      rowCells.push('')
    }
  }

  lines.push(rowCells.join('\t'))
}

const tsvData = lines.join('\n')
```

**Príklad:**
```
Ak vyberiete bunky (2,3) a (4,5), vytvorí sa 3×3 grid:
Row 2: [empty] [empty] Cell(2,3) [empty] [empty]
Row 3: [empty] [empty] [empty]   [empty] [empty]
Row 4: [empty] [empty] [empty]   [empty] Cell(4,5)
```

---

## 4. useFiltering

### Účel

**[KONTEXT BUDE PRIDANÝ]**

**Primárna funkcia:** Deklaratívny filtrovací systém s podporou composite AND/OR filter expression tree. Umožňuje kombinovať viacero filtrov do komplexných podmienok.

**Prečo existuje:**
- **Komplexné filtre** - možnosť kombinovať viacero podmienok: `(Status = 'Active' OR Status = 'Pending') AND Category = 'Important'`
- **Binary tree štruktúra** - SimpleFilter (leaf nodes) a CompositeFilter (AND/OR nodes) pre efektívne vyhodnotenie
- **Declarative API** - filter expression tree sa builduje deklaratívne, nie imperatívne
- **Backend compatible** - filter tree môže byť serializovaný a poslaný na backend pre server-side filtering

**Kľúčové features:**
- **SimpleFilter** - základný filter: `{ type: 'simple', columnName: 'Status', operator: 'Equals', value: 'Active' }`
- **CompositeFilter** - kombinuje filtre: `{ type: 'composite', left: filter1, right: filter2, operator: 'AND' }`
- **Recursive evaluation** - filter tree sa vyhodnotí rekurzívne pre každý riadok
- **Multiple operators** - Equals, Contains, StartsWith, EndsWith, GreaterThan, LessThan, Regex
- **Column-specific extraction** - `extractFiltersExceptColumn()` pre kombinovanie filtrov medzi stĺpcami

**Použitie:** Používa sa v DataGrid.vue pre aplikáciu filtrov z FilterFlyout a FilterRow komponentov.

### Import
```typescript
import { useFiltering, type FilterExpression, type SimpleFilter, type CompositeFilter } from '@/composables/useFiltering'
```

### Interface Definície

#### FilterOperator
```typescript
type FilterOperator =
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

#### FilterExpression
```typescript
interface FilterExpression {
  type: 'simple' | 'composite'
}

interface SimpleFilter extends FilterExpression {
  type: 'simple'
  columnName: string
  operator: FilterOperator
  value: any
}

interface CompositeFilter extends FilterExpression {
  type: 'composite'
  left: FilterExpression
  right: FilterExpression
  operator: 'AND' | 'OR'
}
```

### Return Values
```typescript
{
  currentFilter: Ref<FilterExpression | null>,
  filterRows: (rows, filter, store?) => GridRow[],
  setFilter: (filter: FilterExpression | null) => void,
  clearFilter: () => void,
  evaluateFilter: (row, filter, store?) => boolean
}
```

### Použitie

#### Simple Filter
```typescript
const filtering = useFiltering()

// Filter: Status = "Active"
const filter: SimpleFilter = {
  type: 'simple',
  columnName: 'status',
  operator: 'Equals',
  value: 'Active'
}

const filteredRows = filtering.filterRows(rows, filter)
```

#### Composite Filter (AND)
```typescript
// Filter: Status = "Active" AND Age > 18
const filter: CompositeFilter = {
  type: 'composite',
  left: {
    type: 'simple',
    columnName: 'status',
    operator: 'Equals',
    value: 'Active'
  },
  right: {
    type: 'simple',
    columnName: 'age',
    operator: 'GreaterThan',
    value: 18
  },
  operator: 'AND'
}

const filteredRows = filtering.filterRows(rows, filter)
```

#### Composite Filter (OR)
```typescript
// Filter: Status = "Active" OR Status = "Pending"
const filter: CompositeFilter = {
  type: 'composite',
  left: {
    type: 'simple',
    columnName: 'status',
    operator: 'Equals',
    value: 'Active'
  },
  right: {
    type: 'simple',
    columnName: 'status',
    operator: 'Equals',
    value: 'Pending'
  },
  operator: 'OR'
}
```

#### Complex Filter (Nested AND/OR)
```typescript
// Filter: (Status = "Active" OR Status = "Pending") AND Age > 18
const filter: CompositeFilter = {
  type: 'composite',
  left: {
    type: 'composite',
    left: { type: 'simple', columnName: 'status', operator: 'Equals', value: 'Active' },
    right: { type: 'simple', columnName: 'status', operator: 'Equals', value: 'Pending' },
    operator: 'OR'
  },
  right: {
    type: 'simple',
    columnName: 'age',
    operator: 'GreaterThan',
    value: 18
  },
  operator: 'AND'
}
```

#### Checkbox Column Filter
```typescript
// Special handling for __checkbox column
// Checkbox values are in store.checkedRows, NOT row.cells
const filter: SimpleFilter = {
  type: 'simple',
  columnName: '__checkbox',
  operator: 'Equals',
  value: true  // Filter checked rows
}

// Must pass store interface for checkbox access
const storeInterface = {
  checkedRows: store.checkedRows.value,
  isRowChecked: (rowId: string) => store.checkedRows.value.includes(rowId)
}

const filteredRows = filtering.filterRows(rows, filter, storeInterface)
```

### Implementačné Detaily

#### evaluateSimpleFilter
```typescript
function evaluateSimpleFilter(row: GridRow, filter: SimpleFilter, store?: DataGridStoreInterface): boolean {
  // Special handling for checkbox column
  let cellValue: any
  if (filter.columnName === '__checkbox' && store) {
    cellValue = store.isRowChecked(row.rowId)
  } else {
    const cell = row.cells.find(c => c.columnName === filter.columnName)
    cellValue = cell?.value
  }

  const filterValue = filter.value

  switch (filter.operator) {
    case 'Equals':
      return cellValue === filterValue

    case 'NotEquals':
      return cellValue !== filterValue

    case 'GreaterThan':
      return Number(cellValue) > Number(filterValue)

    case 'LessThan':
      return Number(cellValue) < Number(filterValue)

    case 'Contains':
      return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())

    case 'StartsWith':
      return String(cellValue).toLowerCase().startsWith(String(filterValue).toLowerCase())

    case 'EndsWith':
      return String(cellValue).toLowerCase().endsWith(String(filterValue).toLowerCase())

    case 'IsEmpty':
      return cellValue == null || String(cellValue).trim() === ''

    case 'IsNotEmpty':
      return cellValue != null && String(cellValue).trim() !== ''

    default:
      return true
  }
}
```

#### evaluateCompositeFilter s Short-circuit Evaluation
```typescript
function evaluateCompositeFilter(row: GridRow, filter: CompositeFilter, store?: DataGridStoreInterface): boolean {
  const leftResult = evaluateFilter(row, filter.left, store)

  // Short-circuit: AND - ak ľavá strana je false, netreba hodnotiť pravú
  if (filter.operator === 'AND' && !leftResult) {
    return false
  }

  // Short-circuit: OR - ak ľavá strana je true, netreba hodnotiť pravú
  if (filter.operator === 'OR' && leftResult) {
    return true
  }

  const rightResult = evaluateFilter(row, filter.right, store)

  return filter.operator === 'AND' ? leftResult && rightResult : leftResult || rightResult
}
```

---

## 5. useSearch

### Účel

**[KONTEXT BUDE PRIDANÝ]**

**Primárna funkcia:** Pokročilé vyhľadávanie v celom gridu s podporou rôznych módov (Exact, Contains, Regex, StartsWith, EndsWith, Fuzzy) a navigáciou cez výsledky.

**Prečo existuje:**
- **Rýchle vyhľadávanie** - nájdenie hodnoty v tisícoch buniek v ms
- **Multiple search modes** - flexibilné vyhľadávanie podľa potreby (presná zhoda, obsahuje, regex pattern)
- **Highlight results** - vizuálne zvýraznenie nájdených buniek (žltá background)
- **Result navigation** - Previous/Next buttons pre prechádzanie výsledkov
- **Case sensitivity** - voliteľne case-sensitive/insensitive search

**Kľúčové features:**
- `performSearch(pattern, mode)` - vyhľadá všetky matches v gridu
- `navigateToResult(index)` - presunie sa na konkrétny výsledok
- **Fuzzy matching** - tolerantné vyhľadávanie s podobnými textami (Levenshtein distance)
- **Regex support** - pokročilé pattern matching pre power users

**Použitie:** Integrované v SearchPanel komponent, dostupné cez toolbar.

### Import
```typescript
import { useSearch, type SearchMode, type SearchMatch, type SearchOptions } from '@/composables/useSearch'
```

### Interface Definície

#### SearchMode
```typescript
type SearchMode = 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith' | 'Regex' | 'Fuzzy'
```

#### SearchMatch
```typescript
interface SearchMatch {
  rowId: string
  columnName: string
  value: string
}
```

#### SearchOptions
```typescript
interface SearchOptions {
  caseSensitive?: boolean
  fuzzyThreshold?: number  // Pre Fuzzy mode (default: 3)
}
```

### Return Values
```typescript
{
  searchTerm: Ref<string>,
  searchMode: Ref<SearchMode>,
  searchResults: Ref<SearchMatch[]>,
  currentResultIndex: Ref<number>,
  searchInRows: (term: string, mode: SearchMode, options?: SearchOptions) => void,
  goToNextResult: () => void,
  goToPreviousResult: () => void,
  clearSearch: () => void,
  isSearchMatch: (rowId: string, columnName: string) => boolean
}
```

### Použitie

#### Basic Search
```typescript
const search = useSearch(toRef(store, 'rows'))

// Search with Contains mode
search.searchInRows('john', 'Contains', { caseSensitive: false })

console.log(`Found ${search.searchResults.value.length} matches`)
```

#### Fuzzy Search
```typescript
// Fuzzy search with Levenshtein distance
search.searchInRows('johm', 'Fuzzy', {
  caseSensitive: false,
  fuzzyThreshold: 2  // Max 2 character differences
})

// Matches: "john", "johm", "jonn", "johna"
```

#### Regex Search
```typescript
// Search with regex pattern
search.searchInRows('^[A-Z].*@.*\\.com$', 'Regex', { caseSensitive: false })

// Matches: emails starting with uppercase letter
```

#### Navigation
```typescript
// Navigate through results
search.goToNextResult()
console.log(`Current: ${search.currentResultIndex.value + 1} / ${search.searchResults.value.length}`)

search.goToPreviousResult()
```

#### Check Match
```typescript
// Check if specific cell matches
if (search.isSearchMatch('row-123', 'email')) {
  console.log('This cell matches search query')
}
```

### Implementačné Detaily

#### Search Modes

##### Exact Match
```typescript
case 'Exact':
  isMatch = caseSensitive ? cellValue === term : cellValue.toLowerCase() === term.toLowerCase()
  break
```

##### Contains
```typescript
case 'Contains':
  isMatch = searchValue.includes(searchTerm)
  break
```

##### StartsWith
```typescript
case 'StartsWith':
  isMatch = searchValue.startsWith(searchTerm)
  break
```

##### EndsWith
```typescript
case 'EndsWith':
  isMatch = searchValue.endsWith(searchTerm)
  break
```

##### Regex
```typescript
case 'Regex':
  try {
    const flags = caseSensitive ? '' : 'i'
    const regex = new RegExp(term, flags)
    isMatch = regex.test(cellValue)
  } catch {
    isMatch = false  // Invalid regex
  }
  break
```

##### Fuzzy Match (Levenshtein Distance)
```typescript
case 'Fuzzy':
  isMatch = fuzzyMatch(cellValue, term, fuzzyThreshold)
  break

function fuzzyMatch(text: string, pattern: string, threshold: number): boolean {
  const distance = levenshteinDistance(text.toLowerCase(), pattern.toLowerCase())
  return distance <= threshold
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Calculate distances
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]  // No operation
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,  // Substitution
          matrix[i][j - 1] + 1,      // Insertion
          matrix[i - 1][j] + 1       // Deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}
```

#### Search in Rows
```typescript
function searchInRows(term: string, mode: SearchMode, options: SearchOptions = {}) {
  if (!term) {
    searchResults.value = []
    currentResultIndex.value = -1
    return
  }

  const matches: SearchMatch[] = []
  const caseSensitive = options.caseSensitive ?? false
  const fuzzyThreshold = options.fuzzyThreshold ?? 3

  for (const row of rows.value) {
    for (const cell of row.cells) {
      const cellValue = String(cell.value || '')
      let isMatch = false

      const searchValue = caseSensitive ? cellValue : cellValue.toLowerCase()
      const searchTerm = caseSensitive ? term : term.toLowerCase()

      // ... (apply mode-specific logic)

      if (isMatch) {
        matches.push({
          rowId: row.rowId,
          columnName: cell.columnName,
          value: cellValue
        })
      }
    }
  }

  searchResults.value = matches
  currentResultIndex.value = matches.length > 0 ? 0 : -1
}
```

---

## 6. useSelection

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Správa výberu buniek v gridu s podporou single select, multi select a rectangular range selection.

### Import
```typescript
import { useSelection, type CellAddress } from '@/composables/useSelection'
```

### Interface Definície

#### CellAddress
```typescript
export interface CellAddress {
  rowId: string
  columnName: string
}
```

### Return Values
```typescript
{
  selectCell: (rowId: string, columnName: string, mode: 'replace' | 'add' | 'toggle') => void
  selectRange: (startCell: CellAddress, endCell: CellAddress, rows: GridRow[], columns: GridColumn[]) => void
  selectRow: (rowId: string, columns: GridColumn[]) => void
  selectColumn: (columnName: string, rows: GridRow[]) => void
  selectAll: (rows: GridRow[], columns: GridColumn[]) => void
  clearSelection: () => void
  getSelectedCells: () => CellAddress[]
  isCellSelected: (rowId: string, columnName: string) => boolean
}
```

### Použitie

#### Select Single Cell
```typescript
const selection = useSelection()

// Replace selection with new cell
selection.selectCell('row-123', 'email', 'replace')

// Add cell to selection (Ctrl+Click)
selection.selectCell('row-123', 'email', 'add')

// Toggle cell selection
selection.selectCell('row-123', 'email', 'toggle')
```

#### Select Range (Rectangular)
```typescript
// Select rectangular range from (row1, col1) to (row2, col2)
const startCell = { rowId: 'row-1', columnName: 'name' }
const endCell = { rowId: 'row-5', columnName: 'age' }

selection.selectRange(startCell, endCell, store.rows, store.columns)

// This selects all cells in the rectangle:
// row1: name, email, age
// row2: name, email, age
// ...
// row5: name, email, age
```

#### Select Entire Row
```typescript
selection.selectRow('row-123', store.columns)
// Selects all cells in the row
```

#### Select Entire Column
```typescript
selection.selectColumn('email', store.rows)
// Selects all cells in the column
```

#### Select All
```typescript
selection.selectAll(store.rows, store.columns)
// Selects all cells in grid
```

#### Clear Selection
```typescript
selection.clearSelection()
```

#### Get Selected Cells
```typescript
const selectedCells = selection.getSelectedCells()
// Returns: [{ rowId: 'row-123', columnName: 'email' }, ...]
```

#### Check if Cell Selected
```typescript
if (selection.isCellSelected('row-123', 'email')) {
  console.log('This cell is selected')
}
```

### Implementačné Detaily

#### Select Range (Rectangular)
```typescript
function selectRange(
  startCell: CellAddress,
  endCell: CellAddress,
  rows: GridRow[],
  columns: GridColumn[]
) {
  // Find row indices
  const startRowIndex = rows.findIndex(r => r.rowId === startCell.rowId)
  const endRowIndex = rows.findIndex(r => r.rowId === endCell.rowId)

  // Find column indices
  const startColIndex = columns.findIndex(c => c.name === startCell.columnName)
  const endColIndex = columns.findIndex(c => c.name === endCell.columnName)

  // Determine min/max (allow selection in any direction)
  const minRowIndex = Math.min(startRowIndex, endRowIndex)
  const maxRowIndex = Math.max(startRowIndex, endRowIndex)
  const minColIndex = Math.min(startColIndex, endColIndex)
  const maxColIndex = Math.max(startColIndex, endColIndex)

  // Select all cells in rectangle
  selectedCells.value.clear()

  for (let rowIdx = minRowIndex; rowIdx <= maxRowIndex; rowIdx++) {
    const row = rows[rowIdx]

    for (let colIdx = minColIndex; colIdx <= maxColIndex; colIdx++) {
      const column = columns[colIdx]

      // Skip special columns
      if (column.specialType) continue

      const cellKey = `${row.rowId}:${column.name}`
      selectedCells.value.add(cellKey)
    }
  }
}
```

---

## 7. useSorting

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Multi-column sorting s podporou ascending/descending a composite sort.

### Import
```typescript
import { useSorting, type SortColumn } from '@/composables/useSorting'
```

### Interface Definície

#### SortColumn
```typescript
export interface SortColumn {
  columnName: string
  direction: 'asc' | 'desc'
}
```

### Return Values
```typescript
{
  sortRows: (rows: GridRow[], sorts: SortColumn[]) => GridRow[]
  addSort: (columnName: string, direction: 'asc' | 'desc', multiSort: boolean) => void
  removeSort: (columnName: string) => void
  clearSort: () => void
  currentSorts: Ref<SortColumn[]>
}
```

### Použitie

#### Single Column Sort
```typescript
const sorting = useSorting()

// Sort by name ascending
sorting.addSort('name', 'asc', false)

// Sort by name descending (toggles direction)
sorting.addSort('name', 'desc', false)
```

#### Multi-Column Sort
```typescript
// Sort by name ASC, then age DESC (Ctrl+Click)
sorting.addSort('name', 'asc', true)   // multiSort = true
sorting.addSort('age', 'desc', true)

// Result: rows sorted by name first, then by age within same names
```

#### Sort Rows
```typescript
const sorted = sorting.sortRows(store.rows, sorting.currentSorts.value)
```

#### Remove Sort
```typescript
// Remove sort for specific column
sorting.removeSort('name')
```

#### Clear All Sorts
```typescript
sorting.clearSort()
```

### Implementačné Detaily

#### Sort Rows (Multi-column)
```typescript
function sortRows(rows: GridRow[], sorts: SortColumn[]): GridRow[] {
  if (sorts.length === 0) return rows

  return [...rows].sort((a, b) => {
    for (const sortCol of sorts) {
      const aCell = a.cells.find(c => c.columnName === sortCol.columnName)
      const bCell = b.cells.find(c => c.columnName === sortCol.columnName)

      const aValue = aCell?.value
      const bValue = bCell?.value

      const compareResult = compareValues(aValue, bValue)

      if (compareResult !== 0) {
        return sortCol.direction === 'asc' ? compareResult : -compareResult
      }

      // Equal - continue to next sort column
    }

    return 0 // All sort columns equal
  })
}
```

#### Compare Values
```typescript
function compareValues(a: any, b: any): number {
  // Null handling: nulls last
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  // Number comparison
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime()
  }

  // String comparison (case-insensitive)
  const aStr = String(a).toLowerCase()
  const bStr = String(b).toLowerCase()

  return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: 'base' })
}
```

---

## 8. useImportExport

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Import/Export dát do/z JSON súborov s podporou append, replace a merge modes.

### Import
```typescript
import { useImportExport, ImportMode, type ImportOptions, type ExportOptions } from '@/composables/useImportExport'
```

### Enums & Interfaces

#### ImportMode
```typescript
export enum ImportMode {
  Append = 'append',     // Pridať nové riadky na koniec
  Replace = 'replace',   // Nahradiť všetky riadky
  Merge = 'merge'        // Merge podľa __rowId
}
```

#### ImportOptions
```typescript
interface ImportOptions {
  mode: ImportMode
  validateSchema?: boolean  // Default: true
  reindexRows?: boolean    // Default: true
}
```

#### ExportOptions
```typescript
interface ExportOptions {
  includeHiddenColumns?: boolean  // Default: false
  onlyVisibleRows?: boolean       // Default: false (export all)
}
```

### Return Values
```typescript
{
  exportToJson: (rows: GridRow[], columns: GridColumn[], options?: ExportOptions) => Promise<void>
  importFromJson: (file: File, existingRows: GridRow[], columns: GridColumn[], options?: ImportOptions) => Promise<GridRow[]>
  openImportDialog: () => Promise<File | null>
}
```

### Použitie

#### Export to JSON
```typescript
const importExport = useImportExport()

// Export all data
await importExport.exportToJson(store.rows, store.columns)

// Export with hidden columns
await importExport.exportToJson(store.rows, store.columns, {
  includeHiddenColumns: true
})

// Export only visible rows (after filtering)
await importExport.exportToJson(store.visibleRows, store.columns, {
  onlyVisibleRows: true
})
```

#### Import from JSON (Append Mode)
```typescript
const file = await importExport.openImportDialog()
if (file) {
  const newRows = await importExport.importFromJson(
    file,
    store.rows,
    store.columns,
    { mode: ImportMode.Append }
  )

  store.loadRows([...store.rows, ...newRows])
}
```

#### Import from JSON (Replace Mode)
```typescript
const newRows = await importExport.importFromJson(
  file,
  [],
  store.columns,
  { mode: ImportMode.Replace }
)

store.loadRows(newRows)
```

#### Import from JSON (Merge Mode)
```typescript
// Merge by __rowId - updates existing rows, adds new ones
const mergedRows = await importExport.importFromJson(
  file,
  store.rows,
  store.columns,
  { mode: ImportMode.Merge }
)

store.loadRows(mergedRows)
```

### Implementačné Detaily

#### Export to JSON
```typescript
async function exportToJson(
  rows: GridRow[],
  columns: GridColumn[],
  options: ExportOptions = {}
): Promise<void> {
  const dataColumns = columns.filter(col =>
    !col.specialType &&
    (options.includeHiddenColumns || col.isVisible)
  )

  const data = rows.map(row => {
    const rowData: any = {
      __rowId: row.rowId,
      __rowHeight: row.height
    }

    dataColumns.forEach(col => {
      const cell = row.cells.find(c => c.columnName === col.name)
      rowData[col.name] = cell?.value ?? null
    })

    return rowData
  })

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `data-export-${Date.now()}.json`
  a.click()

  URL.revokeObjectURL(url)
}
```

#### Import from JSON
```typescript
async function importFromJson(
  file: File,
  existingRows: GridRow[],
  columns: GridColumn[],
  options: ImportOptions = { mode: ImportMode.Append }
): Promise<GridRow[]> {
  const text = await file.text()
  const data = JSON.parse(text)

  if (!Array.isArray(data)) {
    throw new Error('Invalid JSON format - expected array')
  }

  // Schema validation
  if (options.validateSchema !== false) {
    validateSchema(data, columns)
  }

  // Convert to GridRow format
  const newRows: GridRow[] = data.map((item, index) => ({
    rowId: item.__rowId || `row-${Date.now()}-${index}`,
    rowIndex: index,
    height: item.__rowHeight || 35,
    cells: columns.filter(c => !c.specialType).map(col => ({
      rowId: item.__rowId || `row-${Date.now()}-${index}`,
      columnName: col.name,
      value: item[col.name] ?? null,
      isSelected: false,
      isValidationError: false
    }))
  }))

  // Apply import mode
  switch (options.mode) {
    case ImportMode.Append:
      return [...existingRows, ...newRows]

    case ImportMode.Replace:
      return newRows

    case ImportMode.Merge:
      const merged = [...existingRows]
      const existingMap = new Map(existingRows.map(r => [r.rowId, r]))

      newRows.forEach(newRow => {
        if (existingMap.has(newRow.rowId)) {
          // Update existing row
          const idx = merged.findIndex(r => r.rowId === newRow.rowId)
          merged[idx] = newRow
        } else {
          // Add new row
          merged.push(newRow)
        }
      })

      return merged

    default:
      return newRows
  }

  // Reindex rows if needed
  if (options.reindexRows !== false) {
    result.forEach((row, index) => {
      row.rowIndex = index
    })
  }

  return result
}
```

---

## 9. useShortcuts

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Context-aware klávesové skratky s podporou pre normal, editing a selection modes.

### Import
```typescript
import { useShortcuts, ShortcutContext, Keys, createDefaultShortcuts } from '@/composables/useShortcuts'
```

### Enums & Interfaces

#### ShortcutContext
```typescript
export enum ShortcutContext {
  Normal = 'normal',       // Grid má focus, nie v edit mode
  Editing = 'editing',     // Cell v edit mode
  Selection = 'selection', // Cells sú vybrané
  Any = 'any'             // Vždy aktívne
}
```

#### KeyCombination
```typescript
export interface KeyCombination {
  key: string          // 'c', 'v', 'Enter', 'Escape', 'Delete', 'F2'
  ctrl?: boolean       // Ctrl key
  shift?: boolean      // Shift key
  alt?: boolean        // Alt key
  meta?: boolean       // Meta key (Cmd on Mac)
}
```

#### ShortcutDefinition
```typescript
interface ShortcutDefinition {
  name: string
  keys: KeyCombination | KeyCombination[]
  context: ShortcutContext
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean   // Default: true
  stopPropagation?: boolean  // Default: false
  enabled?: boolean          // Default: true
}
```

### Helper Functions (Keys)
```typescript
export const Keys = {
  ctrl: (key: string) => ({ key, ctrl: true }),
  shift: (key: string) => ({ key, shift: true }),
  alt: (key: string) => ({ key, alt: true }),
  meta: (key: string) => ({ key, meta: true }),
  ctrlShift: (key: string) => ({ key, ctrl: true, shift: true }),
  ctrlAlt: (key: string) => ({ key, ctrl: true, alt: true }),
  plain: (key: string) => ({ key })
}
```

### Return Values
```typescript
{
  registerShortcut: (definition: ShortcutDefinition) => void
  registerShortcuts: (definitions: ShortcutDefinition[]) => void
  unregisterShortcut: (key: string) => void
  unregisterShortcutByName: (name: string) => void
  setShortcutEnabled: (name: string, enabled: boolean) => void
  getShortcuts: () => ShortcutDefinition[]
  getShortcutsByContext: (context: ShortcutContext) => ShortcutDefinition[]
  clearShortcuts: () => void
  handleKeyDown: (event: KeyboardEvent, currentContext: ShortcutContext) => void
}
```

### Použitie

#### Register Single Shortcut
```typescript
const shortcuts = useShortcuts()

shortcuts.registerShortcut({
  name: 'copy',
  keys: Keys.ctrl('c'),
  context: ShortcutContext.Selection,
  handler: (event) => {
    console.log('Copy selected cells')
    // ... copy logic
  }
})
```

#### Register Multiple Shortcuts
```typescript
shortcuts.registerShortcuts([
  {
    name: 'copy',
    keys: Keys.ctrl('c'),
    context: ShortcutContext.Selection,
    handler: handleCopy
  },
  {
    name: 'paste',
    keys: Keys.ctrl('v'),
    context: ShortcutContext.Selection,
    handler: handlePaste
  },
  {
    name: 'delete',
    keys: { key: 'Delete' },
    context: ShortcutContext.Selection,
    handler: handleDelete
  }
])
```

#### Use Default Shortcuts
```typescript
const defaultShortcuts = createDefaultShortcuts({
  onCopy: handleCopy,
  onPaste: handlePaste,
  onCut: handleCut,
  onDelete: handleDelete,
  onSelectAll: handleSelectAll,
  onUndo: handleUndo,
  onRedo: handleRedo,
  onEscape: handleEscape,
  onEnter: handleEnter,
  onTab: handleTab
})

shortcuts.registerShortcuts(defaultShortcuts)
```

#### Handle KeyDown Event
```typescript
// In component
const currentContext = computed(() => {
  if (isEditing.value) return ShortcutContext.Editing
  if (hasSelection.value) return ShortcutContext.Selection
  return ShortcutContext.Normal
})

function onKeyDown(event: KeyboardEvent) {
  shortcuts.handleKeyDown(event, currentContext.value)
}
```

#### Enable/Disable Shortcuts
```typescript
// Disable specific shortcut
shortcuts.setShortcutEnabled('copy', false)

// Re-enable
shortcuts.setShortcutEnabled('copy', true)
```

### Implementačné Detaily

#### Match Key Combination
```typescript
function matchesKeyCombination(event: KeyboardEvent, combo: KeyCombination): boolean {
  return (
    event.key.toLowerCase() === combo.key.toLowerCase() &&
    !!event.ctrlKey === !!combo.ctrl &&
    !!event.shiftKey === !!combo.shift &&
    !!event.altKey === !!combo.alt &&
    !!event.metaKey === !!combo.meta
  )
}
```

#### Handle KeyDown
```typescript
function handleKeyDown(event: KeyboardEvent, currentContext: ShortcutContext) {
  for (const shortcut of shortcuts.value) {
    // Skip if disabled
    if (shortcut.enabled === false) continue

    // Check context
    if (shortcut.context !== ShortcutContext.Any && shortcut.context !== currentContext) {
      continue
    }

    // Check key combination
    const keys = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys]
    const matched = keys.some(combo => matchesKeyCombination(event, combo))

    if (matched) {
      if (shortcut.preventDefault !== false) {
        event.preventDefault()
      }

      if (shortcut.stopPropagation) {
        event.stopPropagation()
      }

      shortcut.handler(event)
      break // Stop after first match
    }
  }
}
```

#### Default Shortcuts
```typescript
export function createDefaultShortcuts(handlers: any): ShortcutDefinition[] {
  return [
    {
      name: 'copy',
      keys: [Keys.ctrl('c'), Keys.meta('c')],
      context: ShortcutContext.Selection,
      handler: handlers.onCopy
    },
    {
      name: 'paste',
      keys: [Keys.ctrl('v'), Keys.meta('v')],
      context: ShortcutContext.Selection,
      handler: handlers.onPaste
    },
    {
      name: 'cut',
      keys: [Keys.ctrl('x'), Keys.meta('x')],
      context: ShortcutContext.Selection,
      handler: handlers.onCut
    },
    {
      name: 'delete',
      keys: { key: 'Delete' },
      context: ShortcutContext.Selection,
      handler: handlers.onDelete
    },
    {
      name: 'selectAll',
      keys: [Keys.ctrl('a'), Keys.meta('a')],
      context: ShortcutContext.Normal,
      handler: handlers.onSelectAll
    },
    {
      name: 'undo',
      keys: [Keys.ctrl('z'), Keys.meta('z')],
      context: ShortcutContext.Any,
      handler: handlers.onUndo
    },
    {
      name: 'redo',
      keys: [Keys.ctrlShift('z'), Keys.meta('y')],
      context: ShortcutContext.Any,
      handler: handlers.onRedo
    },
    {
      name: 'escape',
      keys: { key: 'Escape' },
      context: ShortcutContext.Editing,
      handler: handlers.onEscape
    },
    {
      name: 'enter',
      keys: { key: 'Enter' },
      context: ShortcutContext.Editing,
      handler: handlers.onEnter
    },
    {
      name: 'tab',
      keys: { key: 'Tab' },
      context: ShortcutContext.Editing,
      handler: handlers.onTab
    }
  ]
}
```

---

## 10. useTheme

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Správa tém pre DataGrid a ListBox s built-in light/dark/high-contrast themes.

### Import
```typescript
import {
  useTheme,
  useThemeProvider,
  defaultDataGridTheme,
  darkDataGridTheme,
  highContrastDataGridTheme,
  defaultListBoxTheme,
  darkListBoxTheme,
  highContrastListBoxTheme,
  generateDataGridCSSVariables,
  generateListBoxCSSVariables
} from '@/composables/useTheme'
```

### Built-in Themes

#### DataGrid Themes
```typescript
// Light Theme (default)
export const defaultDataGridTheme: DataGridTheme = {
  cellColors: {
    defaultBackground: '#ffffff',
    hoverBackground: '#f5f5f5',
    selectedBackground: '#e3f2fd',
    editingBackground: '#fff9c4',
    // ... 14 properties total
  },
  rowColors: {
    oddBackground: '#ffffff',
    evenBackground: '#fafafa',
    hoverBackground: '#f0f0f0',
    // ... 7 properties total
  },
  headerColors: {
    background: '#f5f5f5',
    foreground: '#212121',
    sortIndicatorColor: '#2196f3',
    // ... 5 properties total
  },
  validationColors: {
    errorBackground: '#ffebee',
    errorBorder: '#f44336',
    errorForeground: '#c62828',
    warningBackground: '#fff3cd',
    // ... 9 properties total
  },
  selectionColors: {
    borderColor: '#2196f3',
    background: '#e3f2fd',
    // ... 4 properties total
  },
  borderColors: {
    grid: '#e0e0e0',
    cell: '#e0e0e0',
    // ... 5 properties total
  },
  specialColumnColors: {
    rowNumberBackground: '#fafafa',
    rowNumberForeground: '#757575',
    checkboxBackground: '#ffffff',
    // ... 13 properties total
  },
  uiControlColors: {
    buttonBackground: '#2196f3',
    buttonForeground: '#ffffff',
    buttonHoverBackground: '#1976d2',
    // ... 15 properties total
  }
}

// Dark Theme
export const darkDataGridTheme: DataGridTheme = {
  // ... dark color palette
}

// High Contrast Theme
export const highContrastDataGridTheme: DataGridTheme = {
  // ... high contrast colors for accessibility
}
```

#### ListBox Themes
```typescript
export const defaultListBoxTheme: ListBoxTheme = {
  containerBackground: '#ffffff',
  containerBorder: '#e0e0e0',
  itemForeground: '#212121',
  itemBackground: '#ffffff',
  itemHoverBackground: '#f5f5f5',
  itemSelectedBackground: '#e3f2fd',
  itemSelectedForeground: '#1976d2',
  itemDisabledForeground: '#bdbdbd',
  // ... and more
}
```

### Použitie

#### Use Theme Provider (Parent Component)
```typescript
<template>
  <ThemeProvider :theme="myTheme">
    <DataGrid ... />
    <ListBox ... />
  </ThemeProvider>
</template>

<script setup>
import { useThemeProvider, darkDataGridTheme } from '@/composables/useTheme'

const myTheme = darkDataGridTheme
useThemeProvider(myTheme)
</script>
```

#### Use Theme (Child Component)
```typescript
<script setup>
import { useTheme } from '@/composables/useTheme'

const theme = useTheme()  // Injects theme from parent provider
const cssVariables = generateDataGridCSSVariables(theme)
</script>
```

#### Custom Theme
```typescript
const customTheme: Partial<DataGridTheme> = {
  cellColors: {
    defaultBackground: '#1a1a1a',
    hoverBackground: '#2a2a2a',
    selectedBackground: '#3a3a3a'
  },
  headerColors: {
    background: '#0d47a1',
    foreground: '#ffffff'
  }
}

// Merge with default theme
const mergedTheme = mergeDeep(defaultDataGridTheme, customTheme)
```

### Utility Functions

#### generateDataGridCSSVariables
```typescript
function generateDataGridCSSVariables(theme: DataGridTheme): Record<string, string> {
  return {
    // Cell colors
    '--dg-cell-bg': theme.cellColors.defaultBackground,
    '--dg-cell-hover-bg': theme.cellColors.hoverBackground,
    '--dg-cell-selected-bg': theme.cellColors.selectedBackground,
    // ... all theme properties mapped to CSS variables
  }
}
```

#### mergeDeep (Deep Merge Utility)
```typescript
function mergeDeep<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[key] = mergeDeep(targetValue, sourceValue)
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue
    }
  }

  return output
}
```

---

## 11. useLogger

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Asynchrónny FIFO queue logger pre non-blocking logging s batch processing.

### Import
```typescript
import { useLogger, setupGlobalErrorHandlers, vueErrorHandler } from '@/composables/useLogger'
```

### Log Levels
```typescript
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'
```

### Interface Definície

#### LogEntry
```typescript
export interface LogEntry {
  timestamp: string    // ISO 8601 format
  level: LogLevel
  category: string     // Logger category (e.g., 'DataGrid', 'Validation')
  message: string
  data?: any          // Optional additional data
}
```

### Return Values
```typescript
{
  debug: (message: string, data?: any) => void
  info: (message: string, data?: any) => void
  warn: (message: string, data?: any) => void
  error: (message: string, data?: any) => void
  fatal: (message: string, data?: any) => void
  flush: () => void                    // Synchronous flush
  getQueueSize: () => number
}
```

### Použitie

#### Create Logger
```typescript
const logger = useLogger('DataGrid')

logger.debug('Grid initialized', { rowCount: 100 })
logger.info('Data loaded successfully')
logger.warn('Validation took longer than expected', { duration: 5000 })
logger.error('Failed to load data', { error: errorMessage })
logger.fatal('Critical error - grid crashed', { stackTrace: error.stack })
```

#### Flush Queue
```typescript
// Force synchronous flush (e.g., before page unload)
logger.flush()
```

#### Check Queue Size
```typescript
const queueSize = logger.getQueueSize()
console.log(`Pending logs: ${queueSize}`)
```

#### Global Error Handlers
```typescript
// In main.ts
import { setupGlobalErrorHandlers, vueErrorHandler } from '@/composables/useLogger'

// Setup global window error handlers
setupGlobalErrorHandlers()

// Setup Vue error handler
app.config.errorHandler = vueErrorHandler
```

### Implementačné Detaily

#### FIFO Queue with Batch Processing
```typescript
const logQueue: LogEntry[] = []
const BATCH_SIZE = 50
const BATCH_INTERVAL_MS = 100
let processingInterval: number | null = null

function enqueueLog(level: LogLevel, message: string, data?: any) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    category: loggerCategory,
    message,
    data
  }

  logQueue.push(entry)

  // Auto-start processing if not running
  if (!processingInterval) {
    startProcessing()
  }
}

function startProcessing() {
  processingInterval = setInterval(() => {
    processBatch()
  }, BATCH_INTERVAL_MS)
}

function processBatch() {
  if (logQueue.length === 0) {
    // Stop processing when queue empty
    if (processingInterval) {
      clearInterval(processingInterval)
      processingInterval = null
    }
    return
  }

  const batch = logQueue.splice(0, BATCH_SIZE)

  // Output batch to console
  batch.forEach(entry => {
    const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.category}]`

    switch (entry.level) {
      case 'DEBUG':
        console.debug(prefix, entry.message, entry.data)
        break
      case 'INFO':
        console.info(prefix, entry.message, entry.data)
        break
      case 'WARN':
        console.warn(prefix, entry.message, entry.data)
        break
      case 'ERROR':
      case 'FATAL':
        console.error(prefix, entry.message, entry.data)
        break
    }
  })
}

function flush() {
  while (logQueue.length > 0) {
    processBatch()
  }
}
```

#### Global Error Handlers
```typescript
export function setupGlobalErrorHandlers() {
  const logger = useLogger('Global')

  // Window error handler
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    })
  })

  // Unhandled promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason
    })
  })
}

export function vueErrorHandler(err: Error, instance: any, info: string) {
  const logger = useLogger('Vue')
  logger.error('Vue error', {
    error: err.message,
    stack: err.stack,
    component: instance?.$options?.name,
    info
  })
}
```

---

## 12. useConditionalLogging

### Účel

**[KONTEXT BUDE PRIDANÝ]**
Production-safe logging - disables debug/info/log in production, keeps warn/error always enabled.

### Import
```typescript
import { useConditionalLogging, clog, cinfo, cdebug, cwarn, cerror } from '@/composables/useConditionalLogging'
```

### Environment Detection
```typescript
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
```

### Return Values
```typescript
{
  log: (...args: any[]) => void     // Disabled in production
  info: (...args: any[]) => void    // Disabled in production
  debug: (...args: any[]) => void   // Disabled in production
  warn: (...args: any[]) => void    // Always enabled
  error: (...args: any[]) => void   // Always enabled
}
```

### Použitie

#### Use Composable
```typescript
const { log, info, debug, warn, error } = useConditionalLogging()

log('Grid rendered')          // Logged in dev, silent in prod
info('Data loaded')           // Logged in dev, silent in prod
debug('Debug info', data)     // Logged in dev, silent in prod
warn('Warning message')       // Always logged
error('Error occurred', err)  // Always logged
```

#### Use Shortcut Functions
```typescript
import { clog, cinfo, cdebug, cwarn, cerror } from '@/composables/useConditionalLogging'

clog('This is logged only in dev')
cinfo('Info message')
cdebug('Debug data:', { x: 1, y: 2 })
cwarn('Warning - always logged')
cerror('Error - always logged')
```

### Implementačné Detaily

```typescript
const noop = () => {}

export function useConditionalLogging() {
  return {
    log: IS_PRODUCTION ? noop : console.log.bind(console),
    info: IS_PRODUCTION ? noop : console.info.bind(console),
    debug: IS_PRODUCTION ? noop : console.debug.bind(console),
    warn: console.warn.bind(console),   // Always enabled
    error: console.error.bind(console)  // Always enabled
  }
}

// Shortcut exports
export const clog = IS_PRODUCTION ? noop : console.log.bind(console)
export const cinfo = IS_PRODUCTION ? noop : console.info.bind(console)
export const cdebug = IS_PRODUCTION ? noop : console.debug.bind(console)
export const cwarn = console.warn.bind(console)
export const cerror = console.error.bind(console)
```

---

**Koniec dokumentácie composables.**
