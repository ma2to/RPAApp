# Komponenty - Detailná Dokumentácia

## 1. DataGrid.vue

### Prehľad
Hlavný komponent rpa-web-ui knižnice. Pokročilý dátový grid s plnou funkcionalitou pre editáciu, validáciu, filtrovanie a správu dát.

### Veľkosť a Komplexnosť
- **Počet riadkov:** 3103
- **Template:** 1-136 (136 riadkov)
- **Script:** 138-2756 (2618 riadkov)
- **Style:** 2758-3103 (345 riadkov)

### Props

**Účel:** Definuje vstupné vlastnosti DataGrid komponentu, ktoré umožňujú konfiguráciu vzhľadu, správania a funkcionalít gridu.

**Vstup:** Props sú odovzdané z rodičovského komponentu pri vytváraní DataGrid instance.

**Výstup:** Hodnoty props sú dostupné v komponente cez `props` objekt a používajú sa na inicializáciu a konfiguráciu gridu.

```typescript
interface DataGridProps {
  config?: GridConfig           // Konfigurácia gridu
  columns?: GridColumn[]        // Definícia stĺpcov
  gridId?: string              // Unikátne ID (default: auto-generated)
  theme?: Partial<DataGridTheme> // Customizácia témy
  minTableWidth?: number        // Min. šírka pre horizontal scroll
  width?: string               // Šírka gridu (default: "100%")
  height?: string              // Výška gridu (default: "800px")
  autoRowHeightEnabled?: boolean // Auto výška riadkov (default: false)
  minRows?: number             // Min. počet riadkov (default: 5)
  showHiddenColumnsPanel?: boolean // Panel skrytých stĺpcov (default: true)
  enableHideColumn?: boolean    // Povoliť skrývanie stĺpcov (default: true)
  enableAutoFit?: boolean       // Povoliť auto-fit šírky (default: true)
}
```

**Použitie:** Props sa odovzdávajú pri vytváraní DataGrid komponentu v template:
```vue
<DataGrid
  :config="gridConfig"
  :columns="columnDefinitions"
  grid-id="myGrid"
  width="100%"
  height="600px"
  :auto-row-height-enabled="true"
/>
```

**Dôležité informácie:**
- Všetky props sú voliteľné (optional)
- `gridId` je kľúčový pre viacero grid instancií na stránke - každý grid musí mať unikátne ID
- `config` obsahuje rozsiahlu konfiguráciu funkcionalít (sort, filter, validation, atď.)
- `columns` definuje štruktúru dát - názvy, šírky, typy stĺpcov
- `theme` umožňuje čiastočné prepísanie predvolenej témy (farby, štýly)

### Emits

DataGrid neemituje eventy, poskytuje API cez `defineExpose`.

### Exposed API

**Účel:** Definuje verejné API DataGrid komponentu, ktoré je dostupné rodičovskému komponentu cez template ref. Toto API umožňuje programatickú kontrolu gridu z vonku.

**Prístup:** API je dostupné cez Vue 3 template ref mechanizmus:
```vue
<template>
  <DataGrid ref="gridRef" />
</template>

<script setup>
const gridRef = ref(null)

// Použitie API
await gridRef.value.validation.validateAll()
gridRef.value.handleCopy()
</script>
```

**Vstup/Výstup:** Každá metóda má vlastné vstupy a výstupy popísané nižšie.

```typescript
{
  // Backend operations
  loadDataFromBackend: () => Promise<void>
  // Načíta dáta zo servera. Volá backend endpoint a naplní grid dátami.

  // Validation API
  validation: {
    validateRequired: () => Promise<boolean>
    // Validuje len Required polia. Vráti true ak sú všetky povinné polia vyplnené.

    isAllValid: () => boolean
    // Synchronná kontrola - vráti true ak grid neobsahuje žiadne validačné errors.

    validateAll: (rows?) => Promise<{ isValid: boolean; totalErrors: number }>
    // Validuje všetky bunky v gridu. Vracia komplexný výsledok s počtom chýb.
    // ... všetky useValidation metódy
  }

  // Copy/Paste
  copyPaste: {
    copyToClipboard: (rows, cols, options) => Promise<Result>
    // Kopíruje celé riadky do clipboard v TSV formáte (Excel kompatibilný).

    copySelectedCells: (selected, rows, cols) => Promise<Result>
    // Kopíruje len vybrané bunky s zachovaním pozície (prázdne bunky ako medzery).

    pasteFromClipboard: () => Promise<Result>
    // Vloží dáta z clipboard do gridu od aktuálnej pozície kurzora.

    canPaste: () => boolean
    // Kontroluje či sú dáta v clipboard dostupné na paste operáciu.

    clearClipboard: () => void
    // Vymaže interný clipboard cache.
  }

  // Keyboard shortcuts
  shortcuts: ShortcutsAPI
  // Prístup k API klávesových skratiek (registrácia, vypnutie, zmena).

  // Direct handlers
  handleCopy: () => Promise<void>
  // Skopíruje aktuálny výber do clipboard (volané cez Ctrl+C).

  handlePaste: () => Promise<void>
  // Vloží clipboard dáta (volané cez Ctrl+V).

  handleCut: () => Promise<void>
  // Vystrihne výber - kopíruje a vymaže bunky (volané cez Ctrl+X).

  // State
  isGridReady: Ref<boolean>
  // Reaktívny flag - true keď je grid plne inicializovaný a pripravený na používanie.

  store: DataGridStore
  // Prístup k Pinia store - celý state gridu (rows, columns, selection, filter, atď.).

  // Column management
  getColumns: () => GridColumn[]
  // Vráti aktuálnu konfiguráciu všetkých stĺpcov.

  setColumns: (columns: GridColumn[]) => void
  // Nastaví novú konfiguráciu stĺpcov (prepíše existujúce).
}
```

**Prečo sa používa:**
- **Programatická kontrola:** Rodičovský komponent môže ovládať grid bez používateľskej interakcie
- **Validácia pred submit:** Pred odoslaním formulára možno zavolať `validateAll()`
- **Dynamické zmeny:** Možno meniť stĺpce, načítať dáta, atď. za behu
- **Integrácia s workflow:** Copy/Paste API umožňuje integráciu s externými nástrojmi (Excel)

**Príklad použitia:**
```typescript
// Validácia pred uložením
async function saveData() {
  const result = await gridRef.value.validation.validateAll()
  if (!result.isValid) {
    alert(`Opravte ${result.totalErrors} chýb pred uložením`)
    return
  }

  // Uložiť dáta...
  const allData = gridRef.value.store.rows
  await saveToBackend(allData)
}
```

### Template Štruktúra

**Kontext:**
- **Čo robí:** Zobrazuje kompletný DOM layout DataGrid komponentu
- **Účel:** Poskytuje prehľad o štruktúre template a hierarchii komponentov
- **Hlavné sekcie:**
  - **Loading overlays** - Zobrazujú sa počas validácie (`isProcessing`) alebo načítavania dát (`loadingState.isLoading`)
  - **Toolbar** - Obsahuje ovládacie tlačidlá (napr. toggle Auto Height)
  - **Hidden Columns Panel** - Zobrazuje tlačidlá pre skryté stĺpce, umožňuje ich znovu zobraziť
  - **Grid Container** - Hlavná oblasť s header a rows
    - **DataGridHeader** - Komponent pre hlavičku tabuľky (názvy stĺpcov, sort indicators, resize handles)
    - **LazyRow** - Lazy-rendered riadky (používa IntersectionObserver pre performance)
  - **PaginationControl** - Ovládanie stránkovania (page size, current page, navigation)
  - **FilterFlyout** - Dialóg pre nastavenie filtrov na stĺpci (checkbox alebo regex mode)
- **Prečo:**
  - Každá sekcia je podmienená (`v-if`) - zobrazuje sa len keď je potrebná
  - LazyRow používa `v-for` cez `visibleRows` computed (filtered + sorted + paginated)
  - Events sú emitované z child komponentov hore (`@sort`, `@resize`, `@cell-edit-complete`, atď.)
- **Poznámky:**
  - `table-inner` wrapper je kritický pre horizontal scroll alignment (header ↔ rows)
  - `scrollerRef` ref je používaný pre scroll event handling a IntersectionObserver setup

```
<div class="data-grid">
  <!-- Loading Overlay -->
  <div v-if="isProcessing" class="processing-overlay">
    <!-- Spinner + Progress Bar -->
  </div>

  <div v-if="loadingState.isLoading" class="loading-overlay">
    <!-- Loading Spinner + Progress -->
  </div>

  <!-- Toolbar -->
  <div class="grid-toolbar">
    <button @click="toggleAutoRowHeight">📏 Auto Height</button>
  </div>

  <!-- Hidden Columns Panel -->
  <div v-if="hiddenColumns.length > 0" class="hidden-columns-panel">
    <button v-for="col in hiddenColumns" @click="showColumn(col.name)">
      {{ col.header }}
    </button>
    <button @click="showAllColumns">Show All</button>
  </div>

  <!-- Grid Container -->
  <div class="grid-container">
    <div class="table-content">
      <div class="table-inner">
        <!-- Header -->
        <DataGridHeader
          :columns="allColumns"
          :grid-template-columns="gridTemplateColumns"
          @sort="handleSort"
          @resize="handleResize"
          @hideColumn="handleHideColumn"
          @autoFitColumn="handleAutoFitColumn"
        />

        <!-- Rows with Lazy Rendering -->
        <div ref="scrollerRef" class="scroller">
          <LazyRow
            v-for="item in visibleRows"
            :key="item.rowId"
            :row="item"
            @cell-edit-complete="handleCellEditComplete"
            @checkbox-change="handleCheckboxChange"
            @delete-row="handleDeleteRow"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <PaginationControl
    :page-size="store.pageSize"
    :total-rows="store.totalRows"
    @page-change="store.goToPage"
  />

  <!-- Filter Flyout -->
  <FilterFlyout
    :visible="filterFlyout.visible"
    :column-name="filterFlyout.columnName"
    @apply-checkbox="handleApplyCheckboxFilter"
  />
</div>
```

### Lifecycle Hooks

**Účel:** Lifecycle hooks riadia inicializáciu a cleanup DataGrid komponentu. Zabezpečujú správne nastavenie event listenerov, pozorovateľov a validácie.

#### onBeforeMount
**Čo robí:** Vykoná sa pred pripojením komponentu do DOM.
**Výstup:** Logging inicializácie do konzoly pre debug účely.
**Prečo:** Umožňuje sledovať načítavanie komponentu v dev prostredí.

#### onMounted (async, unified)

**Účel:** Hlavný inicializačný lifecycle hook - vykoná sa po pripojení komponentu do DOM. Obsahuje 11-krokový inicializačný proces.

**Vstup:** Žiadne priame parametre, používa props a store state.

**Výstup:** Plne inicializovaný a funkčný DataGrid pripravený na používateľskú interakciu.

**Proces vykonávania:**
```typescript
async onMounted() {
  // 1. Register event listeners
  document.addEventListener('mouseup', handleDocumentMouseUp)
  document.addEventListener('keydown', handleKeyboardShortcuts)
  // Účel: Globálne event listenery pre selection (mouseup) a klávesové skratky (Ctrl+C, Ctrl+V, atď.)

  // 2. Auto-initialize columns if provided
  if (props.columns && store.rows.length === 0) {
    store.setColumns(props.columns)
    store.initializeEmptyRows()
  }
  // Účel: Ak sú stĺpce poskytnuté cez props a grid je prázdny, inicializuj ich a vytvor minimálny počet riadkov

  // 3. Check backend connection
  checkBackendConnection()
  // Účel: Overí či je dostupný backend server (pre backend integration scenáre)

  // 4. Wait for DOM
  await nextTick()
  // Účel: Čaká na Vue render cycle - zabezpečí že DOM elementy sú vytvorené

  // 5. Measure container height
  measureContainerHeight()
  // Účel: Zmeria výšku grid containera pre správny výpočet max row height (70% výšky)

  // 6. Apply AutoRowHeight if enabled
  if (store.isAutoRowHeightEnabled && store.rows.length > 0) {
    await applyAutoRowHeightToAll()
  }
  // Účel: Vypočíta a aplikuje automatické výšky riadkov podľa obsahu (ak je zapnuté)

  // 7. Create IntersectionObserver
  sharedObserver.value = new IntersectionObserver(...)
  // Účel: Vytvorí observer pre lazy rendering - renderuje len viditeľné riadky (výkon!)

  // 8. Register resize listener
  window.addEventListener('resize', measureContainerHeight)
  // Účel: Sleduje zmeny veľkosti okna a preráta max row height

  // 9. Wheel handler for vertical scroll
  scrollerRef.value.addEventListener('wheel', handleWheel)
  // Účel: Umožňuje scrollovanie kolieskom myši v grid oblasti

  // 10. Mark grid as ready
  isGridReady.value = true
  // Účel: Nastaví flag že grid je plne inicializovaný - odblokuje API volania

  // 11. Diagnostic logs
  console.group('HORIZONTAL SCROLL DIAGNOSTIC')
  // ... extensive logging
  // Účel: Debug informácie o horizontal scroll konfigurácii
}
```

**Dôležité:**
- Hook je **async** - niektoré kroky čakajú na DOM updates (`await nextTick()`)
- Poradie krokov je kritické - nesmie sa meniť
- Po dokončení je `isGridReady.value = true` - signalizuje že grid je použiteľný

#### onBeforeUnmount

**Účel:** Vykoná cleanup pred odstránením komponentu z DOM.

**Čo robí:**
- **Cleanup IntersectionObserver:** Odpojí observer aby nepozorovával už neexistujúce elementy
- **Clear validation state:** Vymaže všetky validation errors a tracking state
- **Clear store data:** Vyčistí Pinia store dáta pre tento grid instance
- **Remove event listeners:** Odstráni globálne event listenery (mouseup, keydown, resize, wheel)

**Prečo:** Predchádza memory leaks - odpojenie listenerov a observers je kritické!

#### onUnmounted

**Účel:** Finálny cleanup po odstránení komponentu z DOM.

**Čo robí:**
- **Final cleanup logging:** Zapíše do konzoly že komponent bol úplne odstránený

**Prečo:** Debug - pomáha sledovať lifecycle komponentu v dev prostredí

### Watchers

**Účel:** Watchers sledujú zmeny v reactive properties a automaticky vykonávajú akcie keď sa hodnoty zmenia. Zabezpečujú synchronizáciu medzi props, store a validačným systémom.

#### watch(props.columns)

**Vstup:** Sleduje `props.columns` - pole definícií stĺpcov odovzdané z rodiča.

**Výstup:** Synchronizovaný store.columns - aktualizované podľa zmien v props.

**Prečo sa používa:** Umožňuje dynamické pridávanie/úpravu stĺpcov za behu. Rodičovský komponent môže meniť stĺpce a grid sa automaticky aktualizuje.

```typescript
watch(() => props.columns, (newColumns) => {
  if (!store || !newColumns) return

  // Sync props.columns to store
  newColumns.forEach(propCol => {
    const existing = store.columns.find(c => c.name === propCol.name)
    if (existing) {
      // Aktualizuj existujúci stĺpec (header, dataType)
      store.updateColumn(propCol.name, {
        header: propCol.header,
        dataType: propCol.dataType
      })
    } else {
      // Pridaj nový stĺpec
      store.addColumn(propCol)
    }
  })
}, { deep: true, immediate: true })
// deep: true - sleduje zmeny vo vnútri objektov v poli
// immediate: true - vykoná sa hneď pri vytvorení watchera
```

**Príklad použitia:**
```typescript
// Rodičovský komponent môže dynamicky pridať stĺpec
columns.value.push({ name: 'newColumn', header: 'New Column', ... })
// Watcher to zachytí a aktualizuje grid
```

#### watch(store.config.autoValidate)

**Vstup:** Sleduje `store.config.autoValidate` - boolean flag či je zapnutá automatická validácia.

**Výstup:** Spustenie plnej validácie všetkých buniek ak sa autoValidate zapne.

**Prečo:** Keď používateľ zapne auto-validáciu (napr. cez UI toggle), všetky existujúce dáta sa musia ihneď validovať.

```typescript
watch(() => store.config.autoValidate, async (enabled, wasEnabled) => {
  if (enabled && !wasEnabled && store.config.enableValidation) {
    // Zaplo sa auto-validate -> validuj všetky bunky
    await validateAllCellsInBatches()
  }
})
// Vykoná sa len pri zmene z false na true (enabled && !wasEnabled)
```

**Kedy sa spustí:**
- Používateľ klikne na "Enable Auto-Validation" checkbox
- Programaticky sa nastaví `gridRef.value.store.config.autoValidate = true`

#### watch(validation.ruleCount)

**Vstup:** Sleduje `validation.ruleCount.value` - počet validačných pravidiel (reactive counter).

**Výstup:** Spustenie plnej validácie všetkých buniek keď sa pridajú nové pravidlá.

**Prečo:** Keď sa pridajú nové validation rules za behu, všetky existujúce dáta sa musia validovať proti nim.

```typescript
// Triggers auto-validation when rules are added
watch(() => validation.ruleCount.value, async (newCount) => {
  if (rulesSize === 0 || store.rows.length === 0 || !store.config.autoValidate) {
    return  // Skipni ak nie sú pravidlá, riadky, alebo je vypnuté auto-validate
  }

  store.clearValidationTracking()  // Vymaž tracking - všetko sa musí validovať znova
  await nextTick()  // Počkaj na Vue render
  await nextTick()  // Dvojité čakanie pre istotu (async validácia)
  await validateAllCellsInBatches()  // Validuj všetky bunky v batch-och
})
```

**Príklad použitia:**
```typescript
// Pridanie nového validation rule
validation.addValidationRule({
  columnName: 'email',
  ruleType: 'Regex',
  regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
  errorMessage: 'Invalid email',
  severity: 'Error'
})
// Watcher zachytí zmenu ruleCount a spustí plnú validáciu
```

#### watch(validation.errorCount)

**Vstup:** Sleduje `validation.errorCount.value` - počet riadkov s validačnými chybami.

**Výstup:** Aktualizované výšky riadkov podľa počtu validation errors v každom riadku.

**Prečo:** Keď sa zmení počet validation errors, výška riadku sa musí prepočítať aby sa zmestili všetky error messages (alebo sa resetuje na default ak errors zmiznú).

```typescript
// Updates row heights when validation errors change
watch(() => validation.errorCount.value, async (errorCount) => {
  // Update validationErrorCount for each row
  store.rows.forEach(row => {
    const count = newErrors[row.rowId]?.length || 0
    row.validationErrorCount = count
    // Uloží počet errors do každého riadku - používa sa pre DynamicScroller size dependencies
  })

  await nextTick()  // Počkaj na Vue render

  if (store.isAutoRowHeightEnabled) {
    await applyAutoRowHeightToAll()
    // Auto-height režim: vypočítaj výšky podľa obsahu vrátane error messages
  } else {
    await resetAllRowHeights()
    // Normálny režim: nastav výšky podľa počtu newline znakov
  }
})
```

**Kedy sa spustí:**
- Po dokončení validácie (`validateAllCellsInBatches()`)
- Keď používateľ opraví chybu a error zmizne
- Keď používateľ pridá nevalidný text a objaví sa nový error

**Dôležité:** Výšky riadkov sa MUSIA prepočítať aby validation errors neboli "orezané" (overflow hidden).

#### watch(gridTemplateColumns)

**Vstup:** Sleduje `gridTemplateColumns` - CSS grid-template-columns string (napr. "50px 100px 1fr 200px").

**Výstup:** Debug log do konzoly s novou hodnotou.

**Prečo:** Debug watcher - pomáha sledovať zmeny v šírkach stĺpcov pri AutoFit operáciách.

```typescript
// Debug watch for AutoFit verification
watch(gridTemplateColumns, (newVal) => {
  console.log('[DataGrid] gridTemplateColumns CHANGED:', newVal)
  // Vypíše napr.: "[DataGrid] gridTemplateColumns CHANGED: 50px 100px 1fr 200px"
}, { immediate: false })
// immediate: false - nespustí sa pri inicializácii, len pri zmenách
```

**Použitie:** Development - overenie že AutoFit správne prepočítal šírky stĺpcov.

### Computed Properties

**Účel:** Computed properties sú reactive derived values - automaticky sa prepočítajú keď sa zmení ich závislost. Používajú sa na transformáciu store dát pre zobrazenie v template.

#### visibleRows

**Vstup:** `store.visibleRows` - computed property zo store.

**Výstup:** Pole GridRow objektov ktoré sa majú zobraziť v gridu (po aplikovaní filter, search, sort, pagination).

**Prečo:** Deleguje na store computed aby sa zabránilo duplicite logiky. Store má komplexnú logiku pre filtering/search/sort/pagination.

```typescript
const visibleRows = computed(() => store.visibleRows)
// Deleguje na store computed - filtering + search + sort + pagination
```

**Pipeline v store.visibleRows:**
1. **Filtering:** Aplikuje filter expression tree na rows
2. **Search:** Filtruje rows podľa search query
3. **Sorting:** Zoradzuje rows podľa sortColumns (multi-column support)
4. **Pagination:** Vyberie len rows pre aktuálnu stránku (currentPage * pageSize)

**Použitie v template:**
```vue
<LazyRow
  v-for="item in visibleRows"
  :key="item.rowId"
  :row="item"
/>
```

#### dataColumns

**Vstup:** `store.columns` - pole všetkých stĺpcov zo store.

**Výstup:** Pole GridColumn objektov s aplikovanými default hodnotami pre DATA stĺpce (nie special columns).

**Prečo:** Zabezpečuje že všetky DATA columns majú konzistentné default values (minWidth, maxWidth, isSortable, atď.). Special columns (RowNumber, Checkbox) sa vracajú nezmenené.

```typescript
const dataColumns = computed(() => {
  return store.columns.map(col => {
    if (col.specialType) return col
    // Special columns (RowNumber, Checkbox, ValidationAlerts, DeleteRow, InsertRow) sa nementujú

    // Apply defaults for DATA columns
    return {
      ...col,
      minWidth: col.minWidth ?? 50,      // Default min 50px
      maxWidth: col.maxWidth ?? 200,     // Default max 200px
      isSortable: col.isSortable ?? false,     // Default nesortable
      isFilterable: col.isFilterable ?? false, // Default nefilterable
      visibleForGrid: col.visibleForGrid ?? true  // Default visible
    }
  })
})
```

**Použitie:** Centralizované nastavenie defaults - zabezpečuje konzistenciu aj keď používateľ neposkytne všetky vlastnosti.

#### specialColumns

**Vstup:** `store.config` - konfigurácia gridu (showRowNumber, showCheckbox flags).

**Výstup:** Pole special columns ktoré sa majú zobraziť PRED data columns (RowNumber, Checkbox).

**Prečo:** Dynamicky pridáva špeciálne stĺpce podľa konfigurácie. Ak používateľ nepotrebuje row numbers alebo checkboxy, nezaberie sa priestor.

```typescript
const specialColumns = computed(() => {
  const cols: GridColumn[] = []
  const config = store.config

  if (config.showRowNumber) {
    cols.push({
      name: '__rowNumber',    // Prefix __ = special column
      header: '#',
      width: 50,              // Fixná šírka 50px
      specialType: 'RowNumber'
    })
  }

  if (config.showCheckbox) {
    cols.push({
      name: '__checkbox',
      header: '☑',
      width: 40,                    // Fixná šírka 40px
      specialType: 'Checkbox',
      isFilterable: true  // Checkbox stĺpec je filtrovateľný (Checked/Unchecked)
    })
  }

  return cols
})
```

**Použitie:** Special columns sa zobrazujú ako prvé (vľavo) v gridu.

#### validationColumn

**Vstup:** `config.showValidationAlerts` - boolean flag či zobraziť validation alerts stĺpec.

**Výstup:** Prázdne pole `[]` ak je vypnuté, alebo pole s jedným ValidationAlerts column definíciou.

**Prečo:** Validation alerts stĺpec je voliteľný - zobrazuje sa len ak je zapnutá validácia a config.showValidationAlerts === true.

```typescript
const validationColumn = computed(() => {
  if (!config.showValidationAlerts) return []

  return [{
    name: '__validationAlerts',
    header: '⚠ Validation',
    width: 150,      // Fixed width (NOT autoWidth)
    minWidth: 100,
    maxWidth: 300,
    specialType: 'ValidationAlerts'
  }]
})
```

**Pozícia:** Zobrazuje sa PRED action columns (Insert/Delete) ale PO data columns.

#### actionColumns

**Vstup:** `config.showInsertButton`, `config.showDeleteButton` - boolean flags.

**Výstup:** Pole action columns (InsertRow, DeleteRow) ktoré sa majú zobraziť.

**Prečo:** Insert a Delete buttons sú voliteľné - zobrazujú sa len ak sú zapnuté v config.

```typescript
const actionColumns = computed(() => {
  const cols: GridColumn[] = []

  if (config.showInsertButton) {
    cols.push({
      name: '__insertRow',
      header: 'Insert',
      width: 60,           // Fixná šírka 60px
      specialType: 'InsertRow'
    })
  }

  if (config.showDeleteButton) {
    cols.push({
      name: '__deleteRow',
      header: 'Delete',
      width: 60,           // Fixná šírka 60px
      specialType: 'DeleteRow'
    })
  }

  return cols
})
```

**Pozícia:** Zobrazujú sa ako posledné (vpravo) v gridu.

#### allColumns

**Vstup:** `specialColumns`, `dataColumns`, `validationColumn`, `actionColumns` - všetky computed columns.

**Výstup:** Finálne pole všetkých stĺpcov v správnom poradí pre rendering.

**Prečo:** Kombinuje všetky typy stĺpcov do jedného poľa v správnom poradí. Filtruje skryté data columns.

```typescript
// Poradie: RowNumber, Checkbox | Data Columns | ValidationAlerts | Insert, Delete
const allColumns = computed(() => [
  ...specialColumns.value,           // Špeciálne stĺpce vľavo
  ...dataColumns.value.filter(col =>
    !col.specialType &&              // Len data columns (nie special)
    col.isVisible &&                 // Len viditeľné
    col.visibleForGrid !== false     // Nie skryté pre grid
  ),
  ...validationColumn.value,         // Validation stĺpec
  ...actionColumns.value             // Action buttons vpravo
])
```

**Použitie v template:** Tento computed sa používa všade kde treba iterovať cez stĺpce (header, rows).

#### gridTemplateColumns

**Vstup:** `allColumns` - pole všetkých viditeľných stĺpcov.

**Výstup:** CSS grid-template-columns string (napr. `"50px 40px 150px 200px 1fr 60px"`).

**Prečo:** Vue template potrebuje tento string pre CSS Grid layout. Každý stĺpec má buď fixnú šírku (`150px`) alebo star sizing (`1fr`).

```typescript
const gridTemplateColumns = computed(() => {
  return allColumns.value.map(col => {
    if (col.autoWidth) return '1fr'  // Star sizing - expanduje do zbytku priestoru
    return `${col.width}px`          // Fixná šírka
  }).join(' ')  // Join s medzerou: "50px 100px 1fr 200px"
})
// Príklad: "50px 40px 150px 200px 1fr 150px 60px 60px"
```

**Použitie v template:**
```vue
<div class="grid-header" :style="{ gridTemplateColumns }">
  <!-- Stĺpce sa automaticky rozprestria podľa template -->
</div>
```

#### minTableWidth

**Vstup:** `allColumns` - všetky viditeľné stĺpce.

**Výstup:** Minimálna šírka tabuľky v pixeloch (suma fixných šírok, bez autoWidth stĺpcov).

**Prečo:** Používa sa na horizontal scroll - tabuľka nesmie byť užšia ako suma fixných stĺpcov.

```typescript
const minTableWidth = computed(() => {
  return allColumns.value.reduce((sum, col) => {
    if (col.visibleForGrid === false || col.autoWidth) return sum
    // Skipnúť skryté a autoWidth (1fr) stĺpce
    return sum + col.width  // Sčítaj len fixné šírky
  }, 0)
})
// Sum iba fixed-width stĺpcov (1fr stĺpce sa nepočítajú)
```

**Použitie:** Nastavuje sa ako `min-width` na table container pre horizontal scroll.

#### hiddenColumns

**Vstup:** `dataColumns` - všetky data columns s defaults.

**Výstup:** Pole skrytých data columns (isVisible === false).

**Prečo:** Zobrazuje sa v "Hidden Columns Panel" - používateľ môže kliknúť na skrytý stĺpec aby ho znova zobrazil.

```typescript
const hiddenColumns = computed(() => {
  return dataColumns.value.filter(col =>
    !col.isVisible &&             // Skryté (Hide Column)
    !col.specialType &&           // Len data columns (nie RowNumber, Checkbox, atď.)
    col.visibleForGrid !== false  // Nie úplne skryté (visible for grid)
  )
})
```

**Použitie v template:**
```vue
<div v-if="hiddenColumns.length > 0" class="hidden-columns-panel">
  <button v-for="col in hiddenColumns" @click="showColumn(col.name)">
    {{ col.header }}
  </button>
</div>
```

#### mergedTheme

**Vstup:** `defaultDataGridTheme` (z theme systému), `props.theme` (user overrides).

**Výstup:** Kompletná merged theme objekt so všetkými color properties.

**Prečo:** Umožňuje čiastočné prepísanie témy - používateľ môže zmeniť len niektoré farby, zvyšok sa vezme z default.

```typescript
const mergedTheme = computed(() => {
  return {
    ...defaultDataGridTheme,  // Default theme ako základ
    cellColors: { ...defaultDataGridTheme.cellColors, ...props.theme?.cellColors },
    // Merge cell colors: default + user overrides
    rowColors: { ...defaultDataGridTheme.rowColors, ...props.theme?.rowColors },
    // Merge row colors: default + user overrides
    // ... všetky theme properties (headerColors, borderColors, atď.)
  }
})
```

**Príklad:**
```typescript
// Zmeniť len hover farbu buniek
<DataGrid :theme="{ cellColors: { hover: '#e3f2fd' } }" />
```

#### cssVariables

**Vstup:** `mergedTheme` - kompletná theme configuration, `props.width`, `props.height`.

**Výstup:** Objekt CSS custom properties pre inline style binding.

**Prečo:** Konvertuje theme objekt na CSS variables (`--dg-cell-bg`, `--dg-cell-hover`, atď.) a pridáva width/height z props.

```typescript
const cssVariables = computed(() => {
  const themeVars = generateDataGridCSSVariables(mergedTheme.value)
  // Vygeneruje: { '--dg-cell-bg': '#fff', '--dg-cell-hover': '#f5f5f5', ... }
  return {
    ...themeVars,
    '--dg-min-table-width': `${minTableWidth.value}px`,  // Min width pre scroll
    width: props.width || '100%',      // Grid šírka
    height: props.height || '800px'    // Grid výška
  }
})
```

**Použitie v template:**
```vue
<div class="data-grid" :style="cssVariables">
  <!-- CSS variables sú dostupné pre všetky child elementy -->
</div>
```

### Kľúčové Funkcie

**Účel:** Kľúčové funkcie obsahujú hlavnú business logiku DataGrid komponentu - validácia, copy/paste, auto row height, filter management, atď.

#### Validation Functions

##### validateAllCellsInBatches()

**Účel:** Validuje všetky bunky v gridu v batch-och aby sa zabránilo zamrznutiu UI pri veľkom počte buniek.

**Vstup:** Žiadne parametre (používa store.rows a validation.validationRules).

**Výstup:** Promise<void> - dokončí sa keď je validácia hotová. Nastavuje validation errors do `validation.validationErrors`.

**Prečo sa používa:**
- **Výkon:** Validácia 10 000+ buniek naraz by zamrzla UI. Batch processing s `await nextTick()` umožňuje UI updaty medzi batch-ami.
- **Progress tracking:** Zobrazuje progress bar počas validácie (percentage).
- **Cancellation:** Podporuje prerušenie validácie ak sa spustí nová (concurrent guard).
- **Optimalizácia:** Validuje len bunky ktoré majú validation rules a neboli ešte validované.

```typescript
async function validateAllCellsInBatches() {
  // Guard: prevent concurrent validation
  if (isValidating.value) {
    validationCancelled = true  // Zruš predchádzajúcu validáciu
    await waitForValidation(5000)  // Počkaj max 5s na jej dokončenie
  }

  isValidating.value = true
  validationCancelled = false

  try {
    // Early exit if no rules
    const columnsWithRules = new Set()
    for (const [col, rules] of validation.validationRules.value) {
      if (rules.length > 0) columnsWithRules.add(col)
    }
    if (columnsWithRules.size === 0) return
    // Ak nie sú žiadne validation rules, skipni

    // Get cells needing validation
    const cellsToValidate = store.getCellsNeedingValidation(true, columnsWithRules)
    if (cellsToValidate.length === 0) return
    // Získaj len bunky ktoré treba validovať (optimalizácia)

    // Initialize progress
    validationProgress.value = {
      isValidating: true,
      current: 0,           // Aktuálny počet zvalidovaných buniek
      total: cellsToValidate.length,
      percentage: 0
    }

    // Dynamic batch size
    const BATCH_SIZE = calculateOptimalBatchSize(cellsToValidate.length)
    // Adaptívna veľkosť batch-u podľa počtu buniek (25-200)

    // Process batches
    for (let i = 0; i < cellsToValidate.length; i += BATCH_SIZE) {
      if (validationCancelled) return  // Prerušenie ak sa spustila nová validácia

      const batch = cellsToValidate.slice(i, i + BATCH_SIZE)

      // Validate all cells in batch SIMULTANEOUSLY
      const promises = batch.map(({ rowId, columnName }) => {
        const row = store.getRow(rowId)
        const cell = row?.cells.find(c => c.columnName === columnName)
        const rowCells = row?.cells.map(c => ({ columnName: c.columnName, value: c.value }))

        return validation.validateCellDirect(rowId, columnName, cell.value, rowCells, true)
          .then(() => store.markCellValidated(rowId, columnName))
          // skipErrorCountUpdate=true - error count sa updatne až na konci (performance)
      })

      await Promise.all(promises)
      // Validuj všetky bunky v batch-u PARALELNE (Promise.all)

      // Update progress
      validationProgress.value.current += batch.length
      validationProgress.value.percentage = Math.round(
        (validationProgress.value.current / cellsToValidate.length) * 100
      )

      await nextTick()
      // KĽÚČOVÉ: Yield UI thread - umožní Vue render a používateľskú interakciu
    }

    // Update error count ONCE at the end
    validation.updateErrorCount()
    // Jednorázový update namiesto po každej bunke (performance!)

  } finally {
    isValidating.value = false
    validationProgress.value.isValidating = false
    // Vždy cleanup flags aj pri error/cancellation
  }
}
```

**Výkon:**
- **Malý grid (100 buniek):** Batch size 25 → 4 batch-e → ~120ms
- **Stredný grid (1000 buniek):** Batch size 50 → 20 batch-ov → ~600ms
- **Veľký grid (10 000 buniek):** Batch size 200 → 50 batch-ov → ~3s
- UI ostáva responzívne vďaka `await nextTick()` medzi batch-ami!

**Kedy sa volá:**
- Po načítaní dát (`loadDataFromBackend()`)
- Po zapnutí auto-validate (`watch(store.config.autoValidate)`)
- Po pridaní nových validation rules (`watch(validation.ruleCount)`)
- Manuálne cez API (`gridRef.value.validation.validateAll()`)

##### calculateOptimalBatchSize()

**Účel:** Vypočíta optimálnu veľkosť batch-u podľa celkového počtu buniek na validáciu.

**Vstup:** `totalCells: number` - celkový počet buniek ktoré treba validovať.

**Výstup:** `number` - optimálna batch size (25, 50, 100, alebo 200).

**Prečo:** Malé batch-e (25) sú lepšie pre malé grid-y (rýchlejší feedback, menej pauznutie UI). Veľké batch-e (200) sú efektívnejšie pre veľké grid-y (menej overhead nextTick()).

```typescript
function calculateOptimalBatchSize(totalCells: number): number {
  if (totalCells < 1000) return 25   // Small dataset - častejšie UI yielding
  if (totalCells < 5000) return 50   // Medium - vyvážený kompromis
  if (totalCells < 15000) return 100 // Large - väčšie batch-e = rýchlejšie
  return 200                          // Very large - maximálna efektivita
}
```

**Príklad:**
- **500 buniek:** Batch 25 → 20 batch-ov → UI update každých ~30ms
- **10 000 buniek:** Batch 200 → 50 batch-ov → UI update každých ~60ms

#### Copy/Paste Functions

##### handleCopySelectedCells()

**Účel:** Kopíruje aktuálne vybrané bunky do clipboard v TSV formáte (Tab-Separated Values) kompatibilnom s Excelom.

**Vstup:** Používa `store.selectedCells` - Set<string> s kľúčmi "rowId:columnName".

**Výstup:** Promise<void> - dokončí sa po skopírovaní do system clipboard.

**Prečo:** Excel-kompatibilný copy/paste - používateľ môže označiť bunky v gridu a Ctrl+C ich skopíruje do Excelu. Zachováva pozície buniek (prázdne bunky ako medzery).

```typescript
async function handleCopySelectedCells() {
  if (store.selectedCells.size === 0) return
  // Guard: ak nie je nič vybrané, skipni

  // Use copySelectedCells with position preservation
  const result = await copyPaste.copySelectedCells(
    store.selectedCells,  // Set vybraných buniek
    store.rows,           // Všetky riadky (potrebné pre position lookup)
    allColumns.value      // Všetky stĺpce (potrebné pre column index)
  )
  // Position preservation: ak sú vybrané bunky (2,3) a (4,5), skopíruje sa 3×3 grid s prázdnymi bunkami

  console.log(result.message)
  // Napr: "Copied 15 cells to clipboard"
}
```

**Použitie:**
- Používateľ označí bunky v gridu a stlačí Ctrl+C
- Bunky sa skopírujú do clipboard ako TSV
- V Exceli Ctrl+V vloží dáta s zachovaním pozície

**TSV formát:**
```
Cell1	\t	Cell(2,3)	\n
\t	\t	\t	\n
\t	\t	\t	Cell(4,5)
```

##### handlePasteSelectedCells()

**Účel:** Vloží dáta z clipboard do gridu od pozície aktuálnej bunky (alebo od 0,0).

**Vstup:** Číta z system clipboard (navigator.clipboard.readText()).

**Výstup:** Promise<void> - dokončí sa po vložení dát a validácii.

**Prečo:** Excel-kompatibilný paste - používateľ môže skopírovať dáta v Exceli a Ctrl+V ich vloží do gridu. Automaticky parsuje TSV formát a mapuje dáta na správne bunky.

```typescript
async function handlePasteSelectedCells() {
  const result = await copyPaste.pasteFromClipboard()
  // Parsuje TSV z clipboard (multiline support, quote escaping, atď.)

  if (result.success && result.rows) {
    // Filter data columns only (no special columns)
    const dataColumnsOnly = allColumns.value.filter(col => !col.specialType)
    // Ignore RowNumber, Checkbox, ValidationAlerts, Delete, Insert columns

    // Find paste target (first selected cell or 0,0)
    let targetRowIndex = 0
    let targetColIndex = 0

    if (store.selectedCells.size > 0) {
      const firstCellKey = Array.from(store.selectedCells)[0]  // První vybraná bunka
      const [firstRowId, firstColName] = firstCellKey.split(':')
      const firstRow = store.rows.find(r => r.rowId === firstRowId)
      const firstColIdx = dataColumnsOnly.findIndex(c => c.name === firstColName)

      if (firstRow) {
        targetRowIndex = firstRow.rowIndex  // Visual row index
        targetColIndex = firstColIdx !== -1 ? firstColIdx : 0
      }
    }
    // Ak nie je nič vybrané, paste sa začne od (0, 0)

    // Paste data row by row, column by column
    result.rows.forEach((rowData, rowOffset) => {
      const pasteRowIndex = targetRowIndex + rowOffset
      if (pasteRowIndex >= store.rows.length) return
      // Skipni ak paste presahuje počet riadkov

      const targetRow = store.rows[pasteRowIndex]

      // Use headers array for correct column order
      result.headers.forEach((columnKey, colOffset) => {
        const pasteColIndex = targetColIndex + colOffset
        if (pasteColIndex >= dataColumnsOnly.length) return
        // Skipni ak paste presahuje počet stĺpcov

        const targetColumn = dataColumnsOnly[pasteColIndex]
        const value = rowData[columnKey] ?? null

        store.updateCell(targetRow.rowId, targetColumn.name, value)
        // Updatni bunku hodnotou z clipboard
      })
    })

    // Trigger validation after paste
    if (store.config.autoValidate && store.config.enableValidation) {
      await nextTick()
      await validateAllCellsInBatches()
    }
  }
}
```

#### Auto Row Height Functions

##### toggleAutoRowHeight()

**Účel:** Prepína Auto Row Height režim on/off a aplikuje/resetuje výšky všetkých riadkov.

**Vstup:** Žiadne parametre (používa `store.isAutoRowHeightEnabled`).

**Výstup:** Promise<void> - dokončí sa po aplikovaní/resete výšok všetkých riadkov.

**Prečo:** Používateľ môže prepínať medzi auto-height (výška podľa obsahu) a fixed-height (32px alebo podľa newlines) režimom. Auto-height je užitočný pre bunky s veľkým textom ale je výpočtovo náročný.

```typescript
async function toggleAutoRowHeight() {
  const newValue = !store.isAutoRowHeightEnabled
  store.setAutoRowHeightEnabled(newValue)  // Toggle flag v store

  if (newValue) {
    // Apply heights to all rows
    await applyAutoRowHeightToAll()
    // Zaplo sa auto-height → vypočítaj výšky podľa Canvas text measurement
  } else {
    // Reset to default/newline-based heights
    await resetAllRowHeights()
    // Vyplo sa auto-height → reset na 32px alebo počet newlines * 21px
  }
}
```

**Použitie:** Toolbar button "📏 Auto Height" volá túto funkciu.

##### applyAutoRowHeightToAll()

**Účel:** Aplikuje auto-vypočítané výšky na všetky riadky pomocou Canvas API text measurement.

**Vstup:** Používa `store.rows` a `allColumns.value`.

**Výstup:** Promise<void> - dokončí sa po aplikovaní výšok a DOM update.

**Prečo:** Canvas API dokáže presne zmerať šírku textu pre daný font. Auto-height vypočíta koľko riadkov text zaberie pri danej šírke stĺpca a nastaví výšku riadku tak, aby sa všetok text zmestil (word wrapping support).

```typescript
async function applyAutoRowHeightToAll() {
  // Skip ValidationAlerts column (uses ellipsis)
  const columnsForMeasurement = allColumns.value
    .filter(col => !col.specialType || col.specialType !== 'ValidationAlerts')
    .map(col => ({ name: col.name, width: col.width, specialType: col.specialType }))
  // ValidationAlerts používa ellipsis (overflow: hidden) takže sa ignoruje pri výpočte

  const result = await autoRowHeight.applyAutoRowHeight(store.rows, columnsForMeasurement)
  // Volá useAutoRowHeight composable ktorý používa Canvas API na text measurement

  // Wait for DOM updates
  await nextTick()
  await nextTick()
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 50))
  // Trojité nextTick + 50ms timeout - zabezpečí že DOM sa plne aktualizuje pred ďalšími operáciami
  // Potrebné kvôli async rendering a lazy loading
}
```

**Výkon:** Pre 1000 riadkov trvá ~200-500ms (závisí od množstva textu a počtu stĺpcov).

##### resetAllRowHeights()

**Účel:** Resetuje výšky všetkých riadkov na default (32px) alebo na výšku podľa počtu newline znakov.

**Vstup:** Používa `store.rows`.

**Výstup:** Promise<void> - dokončí sa po resete výšok a DOM update.

**Prečo:** Jednoduchší a rýchlejší algoritmus než auto-height. Počíta len newline znaky (`\n`) v texte a nastaví výšku podľa počtu riadkov. Nepoužíva Canvas API, takže je oveľa rýchlejší.

```typescript
async function resetAllRowHeights() {
  const defaultHeight = 32  // Default výška pre single-line text

  for (const row of store.rows) {
    let maxLines = 1

    // Check all cells for newlines
    for (const cell of row.cells) {
      if (cell.value == null) continue
      const textValue = String(cell.value)
      if (textValue.includes('\n')) {
        const lines = textValue.split('\n').length
        maxLines = Math.max(maxLines, lines)
        // Nájdi bunku s najväčším počtom newlines v riadku
      }
    }

    // Calculate height based on lines
    if (maxLines > 1) {
      const lineHeight = 21  // 14px font * 1.5 line-height
      const verticalPadding = 10  // 5px top + 5px bottom padding
      row.height = maxLines * lineHeight + verticalPadding
      // Multi-line: lineCount * 21px + 10px padding
    } else {
      row.height = defaultHeight
      // Single-line: 32px default
    }
  }

  // Wait for DOM updates
  await nextTick()
  await nextTick()
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 50))
  // Trojité nextTick + timeout pre istotu
}
```

**Výkon:** Pre 1000 riadkov trvá ~20-50ms (oveľa rýchlejšie než auto-height).

##### recalculateRowHeightAfterEdit()

**Účel:** Prepočíta výšku JEDNÉHO riadku po editácii bunky (ak je zapnutý auto-height).

**Vstup:** `rowId: string` - ID riadku ktorý sa má prepočítať.

**Výstup:** Promise<void> - dokončí sa po prepočítaní výšky.

**Prečo:** Po editácii bunky sa môže zmeniť množstvo textu → výška riadku sa musí prepočítať. Ale len pre JEDEN riadok, nie všetky (performance optimalizácia).

```typescript
async function recalculateRowHeightAfterEdit(rowId: string) {
  if (!store.isAutoRowHeightEnabled) return
  // Guard: len ak je auto-height zapnutý

  const columnsForMeasurement = allColumns.value
    .filter(col => !col.specialType || col.specialType !== 'ValidationAlerts')
    .map(col => ({ name: col.name, width: col.width, specialType: col.specialType }))

  const row = store.rows.find(r => r.rowId === rowId)
  if (!row) return

  const updatedCount = autoRowHeight.recalculateRows(store.rows, [rowId], columnsForMeasurement)
  // Volá useAutoRowHeight.recalculateRows pre JEDEN riadok

  if (updatedCount > 0) {
    store.updateRowHeight(rowId, row.height)
    // Updatni výšku v store (triggerne reactivity)
    await nextTick()
  }
}
```

**Kedy sa volá:** Po každej editácii bunky (`handleCellEditComplete()`).

##### recalculateRowHeightForNewlines()

**Účel:** Prepočíta výšku JEDNÉHO riadku podľa newline znakov (jednoduchší algoritmus než auto-height).

**Vstup:** `rowId: string` - ID riadku ktorý sa má prepočítať.

**Výstup:** Promise<void> - dokončí sa po prepočítaní výšky.

**Prečo:** Používa sa keď je auto-height VYPNUTÝ. Po editácii bunky sa počet newlines mohol zmeniť, takže výška sa musí prepočítať. Rýchlejšie než Canvas-based measurement.

```typescript
async function recalculateRowHeightForNewlines(rowId: string) {
  const row = store.rows.find(r => r.rowId === rowId)
  if (!row) return

  let maxLines = 1

  // Check all cells for newlines
  for (const cell of row.cells) {
    if (cell.value == null) continue
    const textValue = String(cell.value)
    if (textValue.includes('\n')) {
      const lines = textValue.split('\n').length
      maxLines = Math.max(maxLines, lines)
    }
  }

  // Calculate height
  const lineHeight = 21  // 14px * 1.5
  const verticalPadding = 10
  const calculatedHeight = maxLines * lineHeight + verticalPadding

  store.updateRowHeight(rowId, calculatedHeight)
  await nextTick()
}
```

**Kedy sa volá:** Po editácii bunky keď je auto-height VYPNUTÝ.

#### Filter Functions

##### handleShowFilter()

**Účel:** Zobrazí filter flyout dialóg pre daný stĺpec s unique values na výber.

**Vstup:** `columnName: string` - názov stĺpca pre ktorý sa má zobraziť filter.

**Výstup:** Void - nastaví `filterFlyout.value.visible = true` čo zobrazí FilterFlyout komponent.

**Prečo:** Excel-like filtering - používateľ klikne na stĺpec header a vyberie hodnoty ktoré chce zobraziť. Filter flyout zobrazuje všetky unique values s počtom výskytov.

```typescript
function handleShowFilter(columnName: string) {
  // Guards
  if (!isGridReady.value) {
    alert('Please wait for the grid to finish loading')
    return  // Grid sa ešte inicializuje - filter by nefungoval správne
  }

  if (isProcessing.value) {
    alert('Please wait while data is being processed')
    return  // Grid spracováva dáta (validácia, load, atď.) - počkaj
  }

  const column = dataColumns.value.find(c => c.name === columnName)
  if (!column || !column.isFilterable) return
  // Guard: stĺpec musí existovať a musí byť filterable

  if (column.visibleForGrid === false) return
  // Guard: skryté stĺpce (visibleForGrid=false) sa nedajú filtrovať

  // Get unique values
  const uniqueValues = getUniqueValues(columnName)
  // Získaj všetky unique hodnoty v stĺpci + counts

  // Show flyout
  filterFlyout.value = {
    visible: true,
    columnName,
    position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 300 },
    // Centrované v okne
    uniqueValues,
    mode: 'checkbox',  // Default: checkbox mode (nie regex)
    pattern: ''
  }
}
```

**Kedy sa volá:**
- Používateľ klikne na header stĺpca a vyberie "Filter..." z context menu
- Programaticky: `emit('showFilter', columnName)` z DataGridHeader

##### getUniqueValues()

**Účel:** Získa všetky unique hodnoty v stĺpci s counts a isSelected flags pre filter flyout.

**Vstup:** `columnName: string` - názov stĺpca.

**Výstup:** `FilterValue[]` - pole objektov `{ value, isSelected, count, displayText }`.

**Prečo:** Filter flyout potrebuje zobraziť checkbox list všetkých unique hodnôt. Counts zobrazujú koľko riadkov má danú hodnotu (po aplikovaní ostatných filtrov). isSelected indikuje či je hodnota aktuálne vyfiltrovaná.

```typescript
function getUniqueValues(columnName: string): FilterValue[] {
  // Special handling for Checkbox column
  if (columnName === '__checkbox') {
    const filtersExceptThisColumn = extractFiltersExceptColumn(store.filterExpression, columnName)
    const filteredRows = filtersExceptThisColumn
      ? filterRowsHelper(store.rows, filtersExceptThisColumn, store)
      : store.rows
    // Aplikuj všetky filtre OKREM checkbox filtra (aby sa videli counts pre iné filtre)

    const trueCount = filteredRows.filter(row => store.isRowChecked(row.rowId)).length
    const falseCount = filteredRows.length - trueCount

    const currentlySelected = extractSelectedValuesForColumn(store.filterExpression, columnName)
    // Zisti ktoré hodnoty sú aktuálne vyfiltrované (checked/unchecked)

    return [
      { value: 'true', isSelected: currentlySelected.has('true'), count: trueCount, displayText: `☑ Checked (${trueCount})` },
      { value: 'false', isSelected: currentlySelected.has('false'), count: falseCount, displayText: `☐ Unchecked (${falseCount})` }
    ]
  }

  // Normal columns
  const valueMap = new Map<string, number>()
  const filtersExceptThisColumn = extractFiltersExceptColumn(store.filterExpression, columnName)
  const filteredRows = filtersExceptThisColumn
    ? filterRowsHelper(store.rows, filtersExceptThisColumn, store)
    : store.rows
  // Aplikuj všetky ostatné filtre (nie tento stĺpec) aby counts boli správne

  // Extract unique values
  filteredRows.forEach(row => {
    const cell = row.cells.find(c => c.columnName === columnName)
    const value = cell?.value?.toString() ?? ''
    valueMap.set(value, (valueMap.get(value) || 0) + 1)
    // Count výskytov každej unique hodnoty
  })

  const currentlySelected = extractSelectedValuesForColumn(store.filterExpression, columnName)
  // Zisti ktoré hodnoty sú aktuálne vyfiltrované

  return Array.from(valueMap.entries())
    .map(([value, count]) => ({
      value,
      isSelected: currentlySelected.has(value),
      count,
      displayText: `${value === '' ? '(Empty)' : value} (${count})`
    }))
    .sort((a, b) => {
      if (a.value === '' && b.value !== '') return 1
      // Empty values na koniec
      if (a.value !== '' && b.value === '') return -1
      return a.value.localeCompare(b.value)
      // Locale-aware alphabetical sort
    })
}
```

**Výstup príklad pre stĺpec "Status":**
```typescript
[
  { value: 'Active', isSelected: false, count: 45, displayText: 'Active (45)' },
  { value: 'Inactive', isSelected: true, count: 12, displayText: 'Inactive (12)' },
  { value: 'Pending', isSelected: false, count: 8, displayText: 'Pending (8)' },
  { value: '', isSelected: false, count: 3, displayText: '(Empty) (3)' }
]
```

##### handleApplyCheckboxFilter()

**Účel:** Aplikuje checkbox filter (multiple values OR filter) pre stĺpec. Nahradí existujúci filter pre tento stĺpec ale zachová filtre pre ostatné stĺpce.

**Vstup:** `selectedValues: string[]` - pole vybraných hodnôt z filter flyout.

**Výstup:** Void - aktualizuje `store.filterExpression` a triggerne re-render gridu.

**Prečo:** Excel-like multi-value filtering - používateľ vyberie viacero hodnôt (napr. "Active" a "Pending") a grid zobrazí len riadky s týmito hodnotami. Filtre pre rôzne stĺpce sa kombinujú cez AND (Column1=X AND Column2=Y).

```typescript
function handleApplyCheckboxFilter(selectedValues: string[]) {
  const columnName = filterFlyout.value.columnName

  if (selectedValues.length === 0) {
    // Remove filter for this column
    const columnFilters = extractColumnFilters(store.filterExpression)
    columnFilters.delete(columnName)
    // Odstráň filter pre tento stĺpec (deselect all = show all)

    if (columnFilters.size === 0) {
      store.clearFilter()
      // Ak už nie sú žiadne filtre, vyčisti úplne
    } else {
      const combinedFilter = combineFiltersWithAnd(Array.from(columnFilters.values()))
      store.setFilter(combinedFilter)
      // Zachovaj filtre pre ostatné stĺpce
    }
    return
  }

  // Convert string to boolean for Checkbox column
  const filterValues = columnName === '__checkbox'
    ? selectedValues.map(v => v === 'true')
    : selectedValues
  // Checkbox stĺpec používa boolean hodnoty (true/false), nie stringy

  // Build filter expression
  let newColumnFilter: FilterExpression

  if (filterValues.length === 1) {
    // Single value - simple filter
    newColumnFilter = {
      type: 'simple',
      columnName,
      operator: 'Equals',
      value: filterValues[0]
    }
    // Jedna hodnota: Status = 'Active'
  } else {
    // Multiple values - composite OR filter
    newColumnFilter = {
      type: 'simple',
      columnName,
      operator: 'Equals',
      value: filterValues[0]
    }

    for (let i = 1; i < filterValues.length; i++) {
      newColumnFilter = {
        type: 'composite',
        left: newColumnFilter,
        right: {
          type: 'simple',
          columnName,
          operator: 'Equals',
          value: filterValues[i]
        },
        operator: 'OR'
      }
    }
    // Viacero hodnôt: (Status = 'Active' OR Status = 'Pending')
    // Stavia sa rekurzívne binary tree
  }

  // Combine with existing filters
  const combinedFilter = combineWithExistingFilters(newColumnFilter, columnName)
  store.setFilter(combinedFilter)
  // Kombinuj s filtrami pre ostatné stĺpce cez AND
}
```

**Filter expression tree príklad:**
```
AND
├─ OR (Status column)
│  ├─ Status = 'Active'
│  └─ Status = 'Pending'
└─ Category = 'Important'
```

##### extractFiltersExceptColumn()

**Účel:** Extrahuje filter expression tree BEZ filtrov pre daný stĺpec. Používa sa pre zobrazenie counts v filter flyout.

**Vstup:** `filter: FilterExpression | null`, `excludeColumnName: string`.

**Výstup:** `FilterExpression | null` - filter tree bez filtrov pre excludeColumnName.

**Prečo:** Pri otvorení filter flyout pre stĺpec "Status" musíme zobraziť counts AKO BY neboli filtre pre "Status", ale s aplikovanými filtrami pre ostatné stĺpce. Inak by counts boli vždy 0 pre nevybrané hodnoty.

```typescript
function extractFiltersExceptColumn(filter: FilterExpression | null, excludeColumnName: string): FilterExpression | null {
  if (!filter) return null

  if (filter.type === 'simple') {
    const simpleFilter = filter as SimpleFilter
    return simpleFilter.columnName === excludeColumnName ? null : filter
    // Ak je to filter pre excludeColumnName, vráť null (odstráň ho)
  }

  // Composite filter - recurse
  const compositeFilter = filter as CompositeFilter
  const leftFiltered = extractFiltersExceptColumn(compositeFilter.left, excludeColumnName)
  const rightFiltered = extractFiltersExceptColumn(compositeFilter.right, excludeColumnName)
  // Rekurzívne prejdi binary tree

  if (!leftFiltered && !rightFiltered) return null
  // Obe vetvy sú null → celý composite filter je null
  if (!leftFiltered) return rightFiltered
  // Ľavá vetva je null → vráť len pravú
  if (!rightFiltered) return leftFiltered
  // Pravá vetva je null → vráť len ľavú

  return {
    type: 'composite',
    left: leftFiltered,
    right: rightFiltered,
    operator: compositeFilter.operator
  }
  // Obe vetvy existujú → zachovaj composite filter
}
```

**Príklad:**
```typescript
// Pôvodný filter: (Status = 'Active' OR Status = 'Pending') AND Category = 'Important'
// extractFiltersExceptColumn(filter, 'Status')
// Výsledok: Category = 'Important'
```

#### Column Management Functions

**Účel celej sekcie:** Funkcie pre manipuláciu so stĺpcami - skrývanie, zobrazovanie a automatické prispôsobenie šírky stĺpca na základe obsahu.

##### handleHideColumn()

**Účel:** Skryje zadaný stĺpec v DataGrid. Používa sa cez context menu alebo programaticky.

**Vstup:** `columnName: string` - názov stĺpca, ktorý sa má skryť.

**Výstup:** Void. Aktualizuje `isVisible` property stĺpca na `false` v store.

**Prečo:** Umožňuje používateľom dočasne skryť nepotrebné stĺpce bez ich trvalého odstránenia z konfigurácie. Špeciálne stĺpce (checkbox, validácia, akcie) nemožno skryť.

```typescript
function handleHideColumn(columnName: string) {
  // Nájdi stĺpec v store podľa názvu
  const col = store.columns.find(c => c.name === columnName)

  // Skry iba ak existuje a nie je špeciálny (checkbox, validácia, akcie)
  if (col && !col.specialType) {
    store.updateColumn(columnName, { isVisible: false })
  }
}
```

**Príklad použitia:**
```typescript
// Skrytie stĺpca "Description" cez context menu
handleHideColumn('Description')

// Špeciálne stĺpce sa NEmôžu skryť
handleHideColumn('__checkbox') // Ignorované - specialType = 'checkbox'
```

##### showColumn()

**Účel:** Zobrazí skrytý stĺpec. Používa sa cez "Show All Columns" funkciu alebo programaticky cez exposed API.

**Vstup:** `columnName: string` - názov stĺpca, ktorý sa má zobraziť.

**Výstup:** Void. Aktualizuje `isVisible` property stĺpca na `true` v store.

**Prečo:** Umožňuje obnoviť viditeľnosť skrytých stĺpcov. Na rozdiel od `handleHideColumn()`, táto funkcia nekontroluje `specialType` - špeciálne stĺpce sú štandardne vždy viditeľné.

```typescript
function showColumn(columnName: string) {
  // Aktualizuj isVisible na true - stĺpec sa znovu zobrazí v gridu
  store.updateColumn(columnName, { isVisible: true })
}
```

**Príklad použitia:**
```typescript
// Zobrazenie predtým skrytého stĺpca
showColumn('Description')

// Volané cez exposed API z rodičovského komponentu
gridRef.value.showColumn('Description')
```

##### showAllColumns()

**Účel:** Zobrazí všetky dátové stĺpce, ktoré boli skryté. Špeciálne stĺpce sa ignorujú, pretože sú vždy viditeľné.

**Vstup:** Žiadne parametre.

**Výstup:** Void. Aktualizuje `isVisible` na `true` pre všetky dátové stĺpce.

**Prečo:** Rýchly spôsob, ako obnoviť všetky skryté stĺpce naraz, namiesto manuálneho zobrazenia každého stĺpca zvlášť. Používa sa cez context menu "Show All Columns" alebo exposed API.

```typescript
function showAllColumns() {
  // Prejdi všetky stĺpce v store
  store.columns.forEach(col => {
    // Zobraz iba dátové stĺpce (nie checkbox, validáciu, akcie)
    if (!col.specialType) {
      store.updateColumn(col.name, { isVisible: true })
    }
  })
}
```

**Príklad použitia:**
```typescript
// Skryjeme niekoľko stĺpcov
handleHideColumn('Description')
handleHideColumn('Status')
handleHideColumn('Category')

// Zobrazíme všetky naraz jedným kliknutím
showAllColumns()

// Výsledok: Všetky 3 stĺpce sú znovu viditeľné
```

##### handleAutoFitColumn()

**Účel:** Automaticky prispôsobí šírku stĺpca na základe najširšieho obsahu v stĺpci (header alebo bunky). Používa Canvas API pre presné meranie textu.

**Vstup:** `columnName: string` - názov stĺpca, ktorého šírka sa má prispôsobiť.

**Výstup:** Void. Aktualizuje `width` property stĺpca v store na optimálnu hodnotu.

**Prečo:** Umožňuje efektívne využitie priestoru - stĺpec nie je príliš úzky (text sa orezáva) ani príliš široký (plytvanie priestorom). Alternatíva k manuálnemu resize drag&drop.

**Výkonové poznámky:**
- Používa Canvas API pre pixel-perfect meranie textu (rýchlejšie ako DOM rendering)
- Iteruje cez všetky riadky (môže byť pomalé pri 10000+ riadkoch)
- Aplikuje minWidth/maxWidth constraints z column config

```typescript
function handleAutoFitColumn(columnName: string) {
  // Nájdi stĺpec v store
  const col = store.columns.find(c => c.name === columnName)
  if (!col) return

  // Vytvor canvas element pre meranie textu (off-screen, nie je viditeľný)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return

  // Nastav font zhodný s font-om v DataGrid bunkách
  context.font = '14px system-ui, -apple-system, sans-serif'

  let maxWidth = 0

  // 1️⃣ Zmeraj šírku header textu
  const headerWidth = context.measureText(col.header).width
  // +40px padding pre header (ikony, sort indicator, padding)
  maxWidth = Math.max(maxWidth, headerWidth + 40)

  // 2️⃣ Zmeraj šírku všetkých buniek v stĺpci
  store.rows.forEach(row => {
    const cell = row.cells.find(c => c.columnName === columnName)
    const value = cell?.value?.toString() ?? ''
    if (value) {
      const textWidth = context.measureText(value).width
      // +24px padding pre bunku (left/right padding)
      maxWidth = Math.max(maxWidth, textWidth + 24)
    }
  })

  // 3️⃣ Aplikuj constraints (minWidth a maxWidth z column config)
  const newWidth = Math.max(
    col.minWidth,                    // Minimálna šírka (default 50px)
    Math.min(col.maxWidth, Math.ceil(maxWidth))  // Maximálna šírka (default 500px)
  )

  // 4️⃣ Aktualizuj šírku stĺpca v store
  store.updateColumn(columnName, { width: newWidth })
}
```

**Príklad použitia:**
```typescript
// AutoFit cez context menu
handleAutoFitColumn('Description')

// Príklad výpočtu:
// Header "Description" = 80px + 40px = 120px
// Bunka "Short text" = 60px + 24px = 84px
// Bunka "Very long description text here" = 180px + 24px = 204px
// maxWidth = 204px
// newWidth = Math.max(50, Math.min(500, 204)) = 204px

// S constraints:
// col.minWidth = 100px, col.maxWidth = 300px
// newWidth = Math.max(100, Math.min(300, 204)) = 204px
```

#### Event Handlers

**Účel celej sekcie:** Spracovanie užívateľských interakcií a systémových udalostí (edit complete, cell input, keyboard shortcuts, mouse events).

##### handleCellEditComplete()

**Účel:** Spracuje dokončenie editácie bunky (onBlur alebo Enter). Aktualizuje hodnotu, validuje a prepočíta výšku riadku.

**Vstup:**
- `rowId: string` - ID editovaného riadku
- `columnName: string` - názov editovaného stĺpca
- `value: any` - nová hodnota bunky

**Výstup:** `Promise<void>`. Async funkcia kvôli validácii a prepočtu výšky.

**Prečo:** Centralizovaný handler pre finalizáciu editácie bunky. Zabezpečuje 3 kroky:
1. Uloženie hodnoty do store
2. Validácia (ak je zapnutá autoValidate)
3. Prepočet výšky riadku (ak obsahuje nové riadky alebo je zapnuté AutoRowHeight)

**Výkonové poznámky:**
- Používa `validateCellThrottled` (300ms debounce) namiesto direct validation
- Prepočet výšky je async s `await nextTick()` pre synchronizáciu DOM

```typescript
async function handleCellEditComplete(rowId: string, columnName: string, value: any) {
  // 1️⃣ Aktualizuj hodnotu bunky v store
  store.updateCell(rowId, columnName, value)

  // Nájdi stĺpec pre konfiguráciu validácie
  const column = store.columns.find(c => c.name === columnName)
  if (!column) return

  // 2️⃣ VALIDÁCIA (ak je zapnutá)
  // Skip validation for hidden columns
  if (column.visibleForGrid === false) {
    // Pokračuj k prepočtu výšky - validácia sa preskočí
  }
  // Validate if auto-validate enabled and column has rules
  else if (store.config.autoValidate && store.config.enableValidation && validation) {
    // Kontrola, či stĺpec má validation rules
    const hasRules = validation.validationRules.value.has(columnName) &&
                     validation.validationRules.value.get(columnName).length > 0

    if (hasRules) {
      // Získaj všetky bunky riadku pre isRowCompletelyEmpty check
      const row = store.rows.find(r => r.rowId === rowId)
      const rowCells = row?.cells.map(c => ({ columnName: c.columnName, value: c.value }))

      // Validuj s 300ms debounce (throttled) - užívateľ môže rýchlo editovať viac buniek
      await validation.validateCellThrottled(rowId, columnName, value, rowCells)
    }
  }

  // 3️⃣ PREPOČET VÝŠKY RIADKU
  if (store.isAutoRowHeightEnabled) {
    // AutoRowHeight ON - Canvas API meranie (presné, ale pomalšie)
    await recalculateRowHeightAfterEdit(rowId)
    await nextTick()  // Synchronizuj DOM update
  } else {
    // AutoRowHeight OFF - rýchly prepočet na základe \n znakov
    await recalculateRowHeightForNewlines(rowId)
  }
}
```

**Príklad použitia:**
```typescript
// DataGridCell.vue emituje 'edit-complete' event
emit('edit-complete', props.rowId, props.columnName, inputValue.value)

// DataGrid.vue spracuje event
@edit-complete="handleCellEditComplete"

// Flow:
// 1. Užívateľ edituje bunku, stlačí Enter
// 2. emit('edit-complete', 'row-1', 'Description', 'New value')
// 3. handleCellEditComplete:
//    - Uloží 'New value' do store
//    - Validuje (ak je zapnuté)
//    - Prepočíta výšku (ak obsahuje \n)
```

##### handleCellInput()

**Účel:** Spracuje real-time input do bunky počas editácie (každý keystroke). Používa sa pre okamžitý prepočet výšky riadku pri písaní viacriadkového textu.

**Vstup:**
- `rowId: string` - ID editovaného riadku
- `columnName: string` - názov editovaného stĺpca
- `value: any` - aktuálna hodnota bunky (pri každom keystroke)

**Výstup:** `Promise<void>`. Async funkcia kvôli prepočtu výšky.

**Prečo:** Užívateľská skúsenosť - riadok sa roztiahne okamžite pri písaní viacriadkového textu (Shift+Enter), nie až po dokončení editácie.

**Rozdiel vs handleCellEditComplete:**
- `handleCellInput` - volá sa pri každom keystroke (real-time)
- `handleCellEditComplete` - volá sa iba raz po Enter/Blur (s validáciou)

```typescript
async function handleCellInput(rowId: string, columnName: string, value: any) {
  // Aktualizuj hodnotu bunky v real-time (pre AutoRowHeight)
  store.updateCell(rowId, columnName, value)

  // PREPOČET VÝŠKY V REAL-TIME
  if (store.isAutoRowHeightEnabled) {
    // AutoRowHeight ON - Canvas API meranie pri každom keystroke
    await recalculateRowHeightAfterEdit(rowId)
    await nextTick()
  } else if (value != null && String(value).includes('\n')) {
    // AutoRowHeight OFF - prepočítaj iba ak text obsahuje nové riadky (\n)
    await recalculateRowHeightForNewlines(rowId)
  }
}
```

**Príklad použitia:**
```typescript
// DataGridCell.vue emituje 'cell-input' event pri každom keystroke
@input="emit('cell-input', props.rowId, props.columnName, inputValue.value)"

// DataGrid.vue spracuje event
@cell-input="handleCellInput"

// Flow:
// 1. Užívateľ píše: "Line 1"
//    → handleCellInput('row-1', 'Description', 'Line 1')
//    → Výška zostáva 40px (jeden riadok)
//
// 2. Užívateľ stlačí Shift+Enter: "Line 1\n"
//    → handleCellInput('row-1', 'Description', 'Line 1\n')
//    → Výška sa zvýši na 65px (dva riadky) OKAMŽITE
//
// 3. Užívateľ píše ďalej: "Line 1\nLine 2"
//    → handleCellInput('row-1', 'Description', 'Line 1\nLine 2')
//    → Výška zostáva 65px (stále dva riadky)
```

##### handleKeyboardShortcuts()

**Účel:** Spracuje klávesové skratky Ctrl+C a Ctrl+V (resp. Cmd+C/V na macOS) pre copy/paste funkcionalitu.

**Vstup:** `event: KeyboardEvent` - klávesový event z `@keydown` listenera.

**Výstup:** Void. Volá `handleCopySelectedCells()` alebo `handlePasteSelectedCells()`.

**Prečo:** Umožňuje štandardnú copy/paste skratku známu z Excelu a iných tabulkových aplikácií. Alternatíva k pravému kliknutiu a context menu.

**Dôležité poznámky:**
- Funguje iba keď je DataGrid aktívny (má focus)
- Podporuje Windows/Linux (Ctrl) aj macOS (Cmd) modifikátor
- `event.preventDefault()` zabráni default browser copy/paste

```typescript
function handleKeyboardShortcuts(event: KeyboardEvent) {
  // Kontrola, či je stlačený Ctrl (Windows/Linux) alebo Cmd (macOS)
  if (!event.ctrlKey && !event.metaKey) return

  // Ctrl+C alebo Cmd+C - Copy
  if (event.key === 'c' || event.key === 'C') {
    event.preventDefault()  // Zabráň default browser copy
    handleCopySelectedCells()
  }

  // Ctrl+V alebo Cmd+V - Paste
  if (event.key === 'v' || event.key === 'V') {
    event.preventDefault()  // Zabráň default browser paste
    handlePasteSelectedCells()
  }
}
```

**Príklad použitia:**
```typescript
// DataGrid.vue template
<div @keydown="handleKeyboardShortcuts" tabindex="0">
  ...
</div>

// Flow:
// 1. Užívateľ vyberie bunky myšou (drag selection)
// 2. Stlačí Ctrl+C
//    → handleKeyboardShortcuts → handleCopySelectedCells()
//    → Dáta sa skopírujú do clipboard ako TSV
// 3. Klikne na inú bunku
// 4. Stlačí Ctrl+V
//    → handleKeyboardShortcuts → handlePasteSelectedCells()
//    → Dáta sa vložia z clipboardu
```

##### handleDocumentMouseUp()

**Účel:** Ukončí drag selection, keď užívateľ pustí tlačidlo myši kdekoľvek v dokumente (aj mimo DataGrid).

**Vstup:** Žiadne parametre. Listener je pripojený na `document` v `onMounted`.

**Výstup:** Void. Volá `store.endDragSelection()`, ktorý vyčistí `isDragging` a `pressedCell` state.

**Prečo:** Zabezpečuje, že drag selection sa ukončí aj keď užívateľ pustí myš mimo DataGrid oblasti. Inak by selection ostal "zamrznutý" v dragging state.

**Dôležité poznámky:**
- Listener je pripojený na `document`, nie na DataGrid element
- Musí byť odstránený v `onBeforeUnmount` (memory leak prevention)

```typescript
function handleDocumentMouseUp() {
  // Kontrola, či prebieha dragging alebo je pressed cell
  if (store.isDragging || store.pressedCell) {
    // Ukončí drag selection, vyčistí state
    store.endDragSelection()
  }
}
```

**Pripojenie listenera:**
```typescript
// onMounted
onMounted(() => {
  // ...
  document.addEventListener('mouseup', handleDocumentMouseUp)
})

// onBeforeUnmount
onBeforeUnmount(() => {
  document.removeEventListener('mouseup', handleDocumentMouseUp)
})
```

**Príklad použitia:**
```typescript
// Flow:
// 1. Užívateľ stlačí myš na bunke A1
//    → store.pressedCell = { rowId: 'row-1', columnName: 'A' }
//    → store.isDragging = false
//
// 2. Užívateľ pohne myšou na bunku B2 (stále drží tlačidlo)
//    → store.isDragging = true
//    → store.selectedCells = [A1, A2, B1, B2]
//
// 3. Užívateľ pustí myš MIMO DataGrid (napr. na sidebar)
//    → handleDocumentMouseUp()
//    → store.endDragSelection()
//    → store.isDragging = false
//    → store.pressedCell = null
//    → Selection je ukončená, bunky zostanú selected
```

#### Backend Functions

**Účel celej sekcie:** Komunikácia s backend API - health check a načítanie dát zo servera.

##### checkBackendConnection()

**Účel:** Kontroluje, či je backend API dostupný. Volá sa pri inicializácii DataGrid v `onMounted`.

**Vstup:** Žiadne parametre.

**Výstup:** `Promise<void>`. Aktualizuje `isBackendConnected.value` na `true` alebo `false`.

**Prečo:** Umožňuje DataGrid zistiť, či backend beží, a podľa toho prispôsobiť UI (napr. skryť tlačidlo "Load from Backend" ak je backend offline).

**Dôležité poznámky:**
- Neblokuje inicializáciu DataGrid - ak backend nie je dostupný, grid funguje v offline režime
- Logger výpisy sú viditeľné v konzole pre debugging

```typescript
async function checkBackendConnection() {
  try {
    // Zavolaj backend health check endpoint (napr. GET /api/health)
    isBackendConnected.value = await gridApi.healthCheck()

    if (isBackendConnected.value) {
      logger.info('✅ Backend connected')
    } else {
      logger.warn('⚠️ Backend disconnected')
    }
  } catch (error) {
    // Network error, backend offline, CORS error, atď.
    logger.error('❌ Backend connection check failed', { error })
    isBackendConnected.value = false
  }
}
```

**Príklad použitia:**
```typescript
// onMounted
onMounted(async () => {
  // ...
  await checkBackendConnection()
  // ...
})

// V template - podmienené zobrazenie tlačidla
<button v-if="isBackendConnected" @click="loadDataFromBackendOriginal">
  Load from Backend
</button>
```

##### loadDataFromBackendOriginal()

**Účel:** Načíta dáta z backend API a naplní DataGrid riadkami. Zobrazuje loading overlay s progress indikátorom.

**Vstup:** Žiadne parametre.

**Výstup:** `Promise<void>`. Aktualizuje `store.rows` s načítanými dátami.

**Prečo:** Umožňuje načítať dáta zo servera namiesto lokálneho JSON súboru. Užitočné pre dynamické dáta (databáza, API, atď.).

**Výkonové poznámky:**
- Zobrazuje loading overlay s progress (UX)
- Konvertuje backend formát na store formát
- Auto-validuje dáta po načítaní (ak je zapnuté)
- Debounced wrapper zabraňuje duplicitným requestom (pozri `loadDataFromBackend`)

**Backend formát dát:**
```typescript
{
  success: boolean,
  data: [
    { RowId: string, RowHeight: number, Checkbox: boolean, Data: { col1: value1, ... } }
  ]
}
```

**Store formát dát:**
```typescript
{
  __rowId: string,
  __rowHeight: number,
  __checkbox: boolean,
  col1: value1,
  col2: value2,
  ...
}
```

```typescript
async function loadDataFromBackendOriginal() {
  // Zabráň súčasným requestom (guard)
  if (isProcessing.value) return

  // Nastav loading state
  isLoadingFromBackend.value = true
  isProcessing.value = true

  // Inicializuj progress indikátor
  loadingState.value = {
    isLoading: true,
    operation: 'Loading data from backend...',
    progress: 0,
    total: 0,
    percentage: 0
  }

  try {
    // 1️⃣ Zavolaj backend API (napr. GET /api/grid/data)
    const response = await gridApi.getData()

    if (response.success && response.data) {
      // 2️⃣ Aktualizuj progress
      loadingState.value.operation = 'Processing data...'
      loadingState.value.total = response.data.length

      // 3️⃣ KONVERZIA FORMÁTU
      // Convert backend format: { RowId, RowHeight, Checkbox, Data: {...} }
      // to store format: { __rowId, __rowHeight, __checkbox, ...Data }
      const rows = response.data.map((row, index) => ({
        __rowId: row.RowId || `row-${Date.now()}-${index}`,  // Fallback ID
        __rowHeight: row.RowHeight || 40,                     // Default 40px
        __checkbox: row.Checkbox,
        ...row.Data  // Spread všetky dátové stĺpce
      }))

      // 4️⃣ Aktualizuj progress na 100%
      loadingState.value.progress = rows.length
      loadingState.value.percentage = 100

      // 5️⃣ Vyčisti staré validation errors a načítaj nové riadky
      store.clearValidationTracking()
      store.loadRows(rows)

      loadingState.value.operation = 'Data loaded successfully'

      // 6️⃣ AUTO-VALIDATE (ak je zapnuté)
      if (store.config.autoValidate && store.config.enableValidation) {
        const rulesCount = validation.validationRules.value.size
        if (rulesCount > 0) {
          // Počkaj na DOM update (3x nextTick + 50ms pre istotu)
          await nextTick()
          await nextTick()
          await new Promise(resolve => setTimeout(resolve, 50))

          // Validuj všetky bunky v batchoch
          await validateAllCellsInBatches()
        }
      }
    } else {
      // Backend vrátil error
      alert(`Failed to load data: ${response.error}`)
    }
  } catch (error) {
    // Network error, timeout, atď.
    alert(`Error loading data: ${error.message}`)
  } finally {
    // 7️⃣ Vyčisti loading state
    isLoadingFromBackend.value = false
    isProcessing.value = false
    loadingState.value.isLoading = false
  }
}
```

**Príklad použitia:**
```typescript
// V template
<button @click="loadDataFromBackend" :disabled="isLoadingFromBackend">
  Load from Backend
</button>

// Flow:
// 1. Užívateľ klikne na tlačidlo
// 2. Zobrazí sa loading overlay "Loading data from backend..."
// 3. Backend API vráti 1000 riadkov
// 4. Konverzia formátu (1000 rows)
// 5. store.loadRows(rows) - grid sa naplní dátami
// 6. Auto-validate v batchoch (ak je zapnuté)
// 7. Loading overlay zmizne
```

##### loadDataFromBackend (Debounced)

**Účel:** Debounced wrapper pre `loadDataFromBackendOriginal`. Zabraňuje duplicitným backend requestom pri rýchlych klikoch.

**Vstup:** Žiadne parametre. Volá `loadDataFromBackendOriginal` po debounce period.

**Výstup:** Void (debounced funkcia).

**Prečo:** Ak užívateľ rýchlo klikne 3x na tlačidlo "Load from Backend", vykoná sa iba 1 request namiesto 3. Šetrí bandwidth a backend load.

**Debounce konfigurácia:**
- **1000ms delay** - čaká 1s pred volaním funkcie
- **maxWait: 2000ms** - vykoná funkciu maximálne po 2s (aj počas ďalších kliknutí)

```typescript
// Debounced wrapper (1s debounce, max 2s wait)
const loadDataFromBackend = useDebounceFn(loadDataFromBackendOriginal, 1000, {
  maxWait: 2000
})
```

**Príklad použitia:**
```typescript
// V template
<button @click="loadDataFromBackend">Load from Backend</button>

// Scenár 1: Jeden klik
// t=0ms:   Klik → Čaká 1000ms
// t=1000ms: Vykoná loadDataFromBackendOriginal()

// Scenár 2: Rýchle kliky (spam)
// t=0ms:   Klik 1 → Čaká 1000ms
// t=100ms: Klik 2 → Reset timer, čaká 1000ms od t=100
// t=200ms: Klik 3 → Reset timer, čaká 1000ms od t=200
// t=1200ms: Vykoná loadDataFromBackendOriginal() (1x namiesto 3x)

// Scenár 3: Dlhý spam (maxWait)
// t=0ms:    Klik 1 → Čaká 1000ms
// t=100ms:  Klik 2 → Reset timer
// t=200ms:  Klik 3 → Reset timer
// ...
// t=1900ms: Klik 20 → Reset timer
// t=2000ms: Vykoná loadDataFromBackendOriginal() (maxWait dosiahnutý)
```

##### saveDataToBackend()

**Účel:** Uloží dáta z DataGrid do backend API. Filtruje prázdne riadky a extrahuje iba dátové stĺpce (bez špeciálnych stĺpcov).

**Vstup:** Žiadne parametre.

**Výstup:** `Promise<void>`. Zasiela dáta na backend cez `gridApi.importData()`.

**Prečo:** Umožňuje perzistentné uloženie zmien do databázy. Užitočné pre save/submit workflow.

**Výkonové poznámky:**
- Filtruje riadky bez viditeľných dát (preskočí prázdne riadky)
- Extrahuje VŠETKY stĺpce (aj skryté) pre riadky s obsahom
- Počíta preskočené riadky pre debugging
- Nezobrazuje progress overlay (na rozdiel od load)

**Formát odosielaných dát:**
```typescript
[
  { col1: value1, col2: value2, ... },  // Riadok 1
  { col1: value3, col2: value4, ... },  // Riadok 2
  ...
]
```

```typescript
async function saveDataToBackend() {
  // Nastav saving state (zobrazí loading indikátor v tlačidle)
  isSavingToBackend.value = true

  try {
    // 1️⃣ Získaj VIDITEĽNÉ dátové stĺpce (pre empty check)
    // Get visible data columns (for empty check)
    const visibleDataColumns = dataColumns.value.filter(col =>
      !col.specialType && col.visibleForGrid !== false
    )

    // 2️⃣ FILTRÁCIA A EXTRAKCIA DÁT
    // Filter and extract data
    const data: Record<string, any>[] = []
    let skippedEmptyRows = 0

    for (const row of store.rows) {
      // Kontrola, či riadok má nejaké viditeľné dáta
      // Check if row has visible data
      const hasVisibleData = visibleDataColumns.some(col => {
        const cell = row.cells.find(c => c.columnName === col.name)
        const value = cell?.value
        return value !== null && value !== undefined && value !== ''
      })

      if (!hasVisibleData) {
        // Riadok je prázdny → preskočiť
        skippedEmptyRows++
        continue
      }

      // 3️⃣ Extract ALL columns (včítane skrytých) pre riadky s obsahom
      // Extract ALL columns (including hidden) for rows with visible content
      const rowData: Record<string, any> = {}
      dataColumns.value.forEach(col => {
        if (!col.specialType) {
          const cell = row.cells.find(c => c.columnName === col.name)
          if (cell) rowData[col.name] = cell.value
        }
      })

      data.push(rowData)
    }

    // 4️⃣ Zavolaj backend API (napr. POST /api/grid/import)
    const response = await gridApi.importData(data)

    if (response.success) {
      console.log(`✅ Saved ${data.length} rows to backend`)
      // Voliteľne: Zobraz success notifikáciu
    } else {
      // Backend vrátil error
      alert(`Failed to save data: ${response.error}`)
    }
  } catch (error) {
    // Network error, timeout, atď.
    alert(`Error saving data: ${error.message}`)
  } finally {
    // 5️⃣ Vyčisti saving state
    isSavingToBackend.value = false
  }
}
```

**Príklad použitia:**
```typescript
// V template
<button @click="saveDataToBackend" :disabled="isSavingToBackend">
  {{ isSavingToBackend ? 'Saving...' : 'Save to Backend' }}
</button>

// Flow:
// 1. Grid má 1000 riadkov (500 s dátami, 500 prázdnych)
// 2. Užívateľ klikne na "Save to Backend"
// 3. saveDataToBackend():
//    - Filtruje prázdne riadky → 500 riadkov
//    - Extrahuje dáta (všetky stĺpce)
//    - POST /api/grid/import s 500 riadkami
// 4. Backend odpovie { success: true }
// 5. Konzola: "✅ Saved 500 rows to backend"
```

**Dôležité poznámky:**
- **Skryté stĺpce sa uložia** - extrahuje ALL columns (aj hidden), iba sa kontroluje viditeľnosť pre empty check
- **Špeciálne stĺpce sa neuložia** - checkbox, validácia, akcie sa ignorujú
- **Prázdne riadky sa preskočia** - iba riadky s aspoň jednou vyplnenou viditeľnou bunkou

### Štýly (Scoped CSS)

**Účel celej sekcie:** CSS štýly pre DataGrid komponent. Používajú CSS custom properties (premenné) pre theming a scoped styling pre izoláciu.

**Dôležité poznámky:**
- Všetky CSS štýly sú **scoped** - aplikujú sa iba na DataGrid komponent
- Používajú **CSS custom properties** (`--dg-*`) pre dynamické theming
- Každá CSS premenná má **fallback hodnotu** (napr. `var(--dg-cell-bg, white)`)
- Premenné sa nastavujú cez `:style="cssVariables"` v root elemente

#### Hlavný Container
```css
.data-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dg-border-grid, #ddd);
  background-color: var(--dg-cell-bg, white);
  border-radius: 4px;
  overflow: hidden;
  position: relative; /* For overlay positioning */
}
```

#### Loading Overlays
```css
.processing-overlay,
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.processing-spinner,
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--dg-border-cell, #e0e0e0);
  border-top-color: var(--dg-header-sort-indicator, #2196f3);
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;
}

@keyframes spinner-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

#### Progress Bar
```css
.progress-container {
  width: 100%;
  max-width: 400px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: var(--dg-border-cell, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--dg-header-sort-indicator, #2196f3);
  border-radius: 4px;
  transition: width 0.3s ease;
}
```

#### Toolbar
```css
.grid-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: var(--dg-ui-pagination-bg, #f8f9fa);
  border-bottom: 1px solid var(--dg-border-cell, #e0e0e0);
}

.toolbar-button {
  padding: 6px 12px;
  background-color: var(--dg-ui-pagination-bg, white);
  border: 1px solid var(--dg-border-cell, #ccc);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button--active {
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  border-color: var(--dg-header-sort-indicator, #2196f3);
}
```

#### Hidden Columns Panel
```css
.hidden-columns-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--dg-validation-warning-bg, #fff3cd);
  border-bottom: 1px solid var(--dg-validation-warning-border, #ffc107);
  font-size: 13px;
}

.show-column-button,
.show-all-button {
  padding: 4px 12px;
  background-color: var(--dg-ui-pagination-bg, white);
  border: 1px solid var(--dg-border-cell, #ccc);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.show-all-button {
  font-weight: 500;
  background-color: var(--dg-header-sort-indicator, #2196f3);
  color: white;
  margin-left: auto;
}
```

#### Grid Container & Scrolling
```css
.grid-container {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  overflow: visible;
  width: 100%;
  min-width: 0;
  min-height: 0; /* Allow flex child to shrink */
}

.table-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  overflow-x: auto; /* Horizontal scroll */
  overflow-y: hidden; /* Vertical scroll on .scroller */
}

.table-inner {
  /* minWidth set via inline style */
  width: fit-content;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.scroller {
  flex: 1;
  overflow-y: auto; /* Vertical scroll */
  overflow-x: hidden; /* No horizontal scroll */
  min-width: 0;
}
```

#### Scrollbar Styling
```css
/* Horizontal scrollbar (on .table-content) */
.table-content::-webkit-scrollbar {
  height: 8px;
}

.table-content::-webkit-scrollbar-track {
  background: var(--dg-ui-pagination-bg, #f1f1f1);
}

.table-content::-webkit-scrollbar-thumb {
  background: var(--dg-border-cell, #c1c1c1);
  border-radius: 4px;
}

.table-content::-webkit-scrollbar-thumb:hover {
  background: var(--dg-ui-resize-grip, #a8a8a8);
}

/* Vertical scrollbar (on .scroller) */
.scroller::-webkit-scrollbar {
  width: 8px;
}

.scroller::-webkit-scrollbar-track {
  background: var(--dg-ui-pagination-bg, #f1f1f1);
}

.scroller::-webkit-scrollbar-thumb {
  background: var(--dg-border-cell, #c1c1c1);
  border-radius: 4px;
}

.scroller::-webkit-scrollbar-thumb:hover {
  background: var(--dg-ui-resize-grip, #a8a8a8);
}
```

### Poznámky k Implementácii

**Účel celej sekcie:** Kľúčové implementačné detaily a riešenia problémov, ktoré boli vyriešené počas vývoja DataGrid komponentu.

#### 1. Horizontal Scroll Fix

**Problém:** Pri horizontal scrollingu sa stĺpce rozišli (header vs riadky boli misaligned).

**Riešenie:** Pridanie `.table-inner` wrappera, ktorý zoskupí header a rows do jedného scrollovateľného kontajnera.

**Prečo to funguje:** Header a rows sú v rovnakom flex containeri, takže horizontal scroll sa aplikuje na oba súčasne.

```html
<div class="table-content">  <!-- Horizontal scroll container -->
  <div class="table-inner">  <!-- Column grouping wrapper - KĽÚČOVÝ FIX -->
    <DataGridHeader />       <!-- Header -->
    <div class="scroller">   <!-- Rows -->
      <LazyRow />
    </div>
  </div>
</div>
```

**Alternatívne riešenia (nefungovali):**
- Sync scroll position cez JavaScript → laggy, nestabilné
- Sticky header s position: sticky → nefunguje s horizontal scroll

#### 2. Lazy Rendering

**Účel:** Optimalizácia výkonu pre veľké datasety (10000+ riadkov). Renderuje iba riadky viditeľné vo viewporte.

**Implementácia:** Každý DataGrid má vlastný IntersectionObserver:
- **Scoped cez `provide('intersectionObserver', sharedObserver)`** - observer je dostupný pre všetky child komponenty
- **LazyRow komponenty `inject` observer** - každý riadok sa registruje
- **100px rootMargin** - predčasné načítanie riadkov tesne pred vstupom do viewportu (plynulejší scroll)
- **Map-based visibility tracking** - efektívne sledovanie viditeľných riadkov (O(1) lookup)

**Výkonový benefit:**
- 10000 riadkov: Render iba ~20 viditeľných riadkov → 500x rýchlejší initial render
- Scroll je plynulý (60fps) vďaka predčasnej renderizácii

#### 3. Validation Optimization

**Účel:** Rýchla validácia tisícov buniek bez zmrazenia UI.

**Implementácia:**
- **Batch processing (25-200 cells per batch)** - rozdelenie validácie na menšie kusy
- **Dynamic batch size** - automatické prispôsobenie na základe celkového počtu buniek:
  - < 1000 buniek → batch 25
  - 1000-5000 buniek → batch 50
  - 5000-10000 buniek → batch 100
  - \> 10000 buniek → batch 200
- **`skipErrorCountUpdate` parameter** - batch operácie nevolajú `updateErrorCount()` po každej bunke, iba raz na konci
- **Cancellation token** - možnosť prerušiť validáciu (napr. pri zatvorení gridu)
- **`await nextTick()`** - UI yielding medzi batchmi (plynulejšie loading overlay)

**Výkonový benefit:**
- 10000 buniek: 2-3 sekundy namiesto 20+ sekúnd (bez batchov)
- UI zostáva responsive počas validácie

#### 4. Memory Management

**Účel:** Zabránenie memory leakov pri unmounte DataGrid komponentu.

**Cleanup v `onBeforeUnmount`:**
- **IntersectionObserver.disconnect()** - cleanup lazy rendering observer
- **validation.clearValidationErrors()** - clear validation state
- **store.clearData()** - clear všetky riadky a stĺpce
- **document.removeEventListener('mouseup', handleDocumentMouseUp)** - remove global listener

**Prečo je to dôležité:**
- DataGrid môže byť dynamicky vytvorený a zničený (napr. v dialog/modal)
- Bez cleanupu by každý unmount/mount pridával nové listenery → memory leak
- IntersectionObserver bez disconnect sleduje DOM nodes, ktoré už neexistujú

### Príklad Použitia

**Účel sekcie:** Ukážkový kód, ako použiť DataGrid komponent v reálnej Vue 3 aplikácii.

**Kľúčové body v príklade:**
1. **Import DataGrid** z rpa-web-ui knižnice
2. **Konfigurácia columns** - definícia stĺpcov s názvami, šírkami, sortability, filterability
3. **Konfigurácia config** - zapnutie validácie, checkbox, row numbers
4. **Custom theme** - prispôsobenie farieb
5. **Exposed API použitie** - volanie `loadDataFromBackend()` a `addValidationRule()` cez `gridRef`
6. **Async initialization** - čakanie na `isGridReady` pred volaním API metód

```vue
<template>
  <DataGrid
    :columns="columns"                    <!-- Definícia stĺpcov -->
    :config="config"                      <!-- Grid konfigurácia -->
    :theme="customTheme"                  <!-- Custom farby -->
    :auto-row-height-enabled="true"       <!-- AutoRowHeight zapnuté -->
    :min-rows="5"                         <!-- Min 5 riadkov vždy viditeľných -->
    :enable-hide-column="true"            <!-- Context menu - Hide Column -->
    :enable-auto-fit="true"               <!-- Context menu - AutoFit Column -->
    grid-id="my-grid"                     <!-- Unikátny ID (povinné pre viacero gridov) -->
    height="600px"                        <!-- Výška gridu -->
    ref="gridRef"                         <!-- Ref pre prístup k exposed API -->
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DataGrid } from 'rpa-web-ui'  // Import DataGrid komponentu

// Ref na grid pre prístup k exposed API
const gridRef = ref()

// Definícia stĺpcov
const columns = ref([
  { name: 'name', header: 'Name', width: 150, isSortable: true, isFilterable: true },
  { name: 'email', header: 'Email', width: 200, isSortable: true },
  { name: 'age', header: 'Age', width: 80, isSortable: true }
])

// Grid konfigurácia
const config = ref({
  pageSize: 50,                     // 50 riadkov na stránku
  enableValidation: true,           // Zapnúť validáciu
  autoValidate: true,               // Auto-validovať po edit
  showRowNumber: true,              // Zobraziť čísla riadkov
  showCheckbox: true,               // Zobraziť checkbox column
  showValidationAlerts: true        // Zobraziť validation alerts
})

// Custom theme - prispôsobenie farieb
const customTheme = {
  cellColors: {
    defaultBackground: '#ffffff',   // Biela bunka
    hoverBackground: '#f0f0f0'      // Svetlo šedá pri hover
  }
}

// Inicializácia gridu po mounte
onMounted(async () => {
  // 1️⃣ Počkaj na grid ready (async Promise)
  // Wait for grid to be ready
  await gridRef.value.isGridReady

  // 2️⃣ Načítaj dáta z backend API
  // Load data from backend
  await gridRef.value.loadDataFromBackend()

  // 3️⃣ Pridaj validation rule pre email stĺpec
  // Add validation rules
  gridRef.value.validation.addValidationRule({
    columnName: 'email',
    ruleType: 'Regex',
    regexPattern: '^[^@]+@[^@]+\\.[^@]+$',  // Email regex pattern
    errorMessage: 'Invalid email format',
    severity: 'Error'                        // Error severity (červený indikátor)
  })
})
</script>
```

**Výsledok:**
- Grid s 3 stĺpcami (Name, Email, Age)
- Dáta načítané z backend API
- Email stĺpec má Regex validáciu
- Checkbox a row numbers zapnuté
- AutoRowHeight zapnuté (riadky sa prispôsobia obsahu)
- Context menu s Hide Column a AutoFit Column
- Custom theme s bielym pozadím a šedým hover

### Dodatočné Kľúčové Funkcie (Complete List)

**Účel sekcie:** Helper funkcie pre rôzne operácie - row insertion, filter management, filter application. Tieto funkcie dopĺňajú hlavné funkcie DataGrid.vue.

#### Row Insertion (Multiple Rows)

**Účel:** Vložiť viacero prázdnych riadkov naraz (napr. 10 riadkov) nad alebo pod konkrétnym riadkom.

**Použitie:** Volané z context menu "Insert Rows" alebo programaticky cez exposed API.

```typescript
function handleInsertAbove(rowId: string, count: number) {
  // Vloží 'count' prázdnych riadkov NAD riadok s ID 'rowId'
  store.insertMultipleRows(rowId, count, 'above')
}

function handleInsertBelow(rowId: string, count: number) {
  // Vloží 'count' prázdnych riadkov POD riadok s ID 'rowId'
  store.insertMultipleRows(rowId, count, 'below')
}
```

**Príklad použitia:**
```typescript
// Context menu: Pravý klik na riadok → "Insert 5 Rows Above"
handleInsertAbove('row-123', 5)
// Výsledok: 5 nových prázdnych riadkov nad riadkom 'row-123'

// Programaticky
gridRef.value.handleInsertBelow('row-456', 10)
// Výsledok: 10 nových prázdnych riadkov pod riadkom 'row-456'
```

#### Filter Flyout Management

**Účel podsekie:** Funkcie pre správu filter flyout dialógu - otváranie, zatváranie, extrakcia selected values.

##### closeFilterFlyout()

**Účel:** Zatvorí filter flyout dialog.

**Vstup:** Žiadne parametre.

**Výstup:** Void. Nastaví `filterFlyout.value.visible = false`.

**Prečo:** Jednoduchá helper funkcia pre zatváranie flyout dialógu. Volá sa po aplikovaní filtra alebo pri kliknutí mimo dialógu.

```typescript
function closeFilterFlyout() {
  // Skry filter flyout dialog
  filterFlyout.value.visible = false
}
```

**Použitie:**
```typescript
// Po aplikovaní filtra
handleApplyCheckboxFilter(selectedValues)
closeFilterFlyout()

// Pri kliknutí na "Cancel" tlačidlo
<button @click="closeFilterFlyout">Cancel</button>
```

##### extractSelectedValuesForColumn()

**Účel:** Extrahuje aktuálne vybrané hodnoty pre daný stĺpec z filter expression tree. Používa sa pre označenie checkboxov v filter flyout.

**Vstup:**
- `filter: FilterExpression | null | undefined` - filter tree
- `columnName: string` - názov stĺpca, pre ktorý sa extrahujú hodnoty

**Výstup:** `Set<string>` - množina vybraných hodnôt pre daný stĺpec.

**Prečo:** Pri otvorení filter flyout musíme zobraziť, ktoré hodnoty sú aktuálne vyfiltrované (checkboxy checked). Táto funkcia prechádza filter tree a hľadá všetky `Equals` filtre pre daný stĺpec.

**Algoritmus:** Rekurzívny tree traversal - prechádza SimpleFilter nodes a hľadá `columnName` + `operator === 'Equals'`.

```typescript
function extractSelectedValuesForColumn(
  filter: FilterExpression | null | undefined,
  columnName: string
): Set<string> {
  const selectedValues = new Set<string>()

  // Prázdny filter → žiadne selected values
  if (filter === null || filter === undefined) return selectedValues

  // Rekurzívny tree traversal
  function traverse(expr: FilterExpression) {
    if (expr.type === 'simple') {
      // SimpleFilter node
      const simpleFilter = expr as SimpleFilter

      // Ak je to filter pre náš stĺpec S operátorom 'Equals'
      if (simpleFilter.columnName === columnName && simpleFilter.operator === 'Equals') {
        // Pridaj hodnotu do selected set
        selectedValues.add(String(simpleFilter.value))
      }
    } else {
      // CompositeFilter node (AND/OR) → rekurzívne prechádza left & right
      const compositeFilter = expr as CompositeFilter
      traverse(compositeFilter.left)
      traverse(compositeFilter.right)
    }
  }

  traverse(filter)
  return selectedValues
}
```

**Príklad použitia:**
```typescript
// Filter tree: (Status = 'Active' OR Status = 'Pending') AND Category = 'Important'
const selectedValues = extractSelectedValuesForColumn(store.filterExpression, 'Status')
// Výsledok: Set(['Active', 'Pending'])

// Filter flyout označí checkboxy pre 'Active' a 'Pending' ako checked
checkboxes.forEach(cb => {
  cb.checked = selectedValues.has(cb.value)
})
```

##### extractColumnFilters()

**Účel:** Extrahuje filtre zoskupené podľa stĺpcov z filter expression tree. Používa sa pri úprave filtrov - nahradenie filtra pre jeden stĺpec bez ovplyvnenia ostatných.

**Vstup:** `filter: FilterExpression | null` - celý filter tree.

**Výstup:** `Map<string, FilterExpression>` - mapa kde kľúč je `columnName` a hodnota je filter expression pre daný stĺpec.

**Prečo:** Pri aplikovaní nového filtra pre stĺpec "Status" musíme zachovať existujúce filtre pre "Category", "Priority", atď. Táto funkcia rozdelí komplexný filter tree na individuálne stĺpce.

**Algoritmus:**
- **AND operátor** - separuje rôzne stĺpce (napr. `Status = 'Active' AND Category = 'Important'`)
- **OR operátor** - drží rovnaký stĺpec spolu (napr. `Status = 'Active' OR Status = 'Pending'`)

```typescript
function extractColumnFilters(filter: FilterExpression | null): Map<string, FilterExpression> {
  const columnFilters = new Map<string, FilterExpression>()

  // Rekurzívna funkcia s kontextom (AND/OR)
  function traverse(expr: FilterExpression, isAndContext: boolean): string | null {
    if (expr.type === 'simple') {
      // SimpleFilter node
      const simple = expr as SimpleFilter

      if (isAndContext) {
        // V AND kontexte → nový stĺpec, pridaj do mapy
        columnFilters.set(simple.columnName, expr)
      }
      return simple.columnName
    } else {
      // CompositeFilter node
      const composite = expr as CompositeFilter

      if (composite.operator === 'AND') {
        // AND separuje rôzne stĺpce
        // Príklad: (Status = 'Active') AND (Category = 'Important')
        traverse(composite.left, true)   // isAndContext = true
        traverse(composite.right, true)
        return null
      } else {
        // OR drží rovnaký stĺpec spolu
        // Príklad: (Status = 'Active') OR (Status = 'Pending')
        const leftCol = traverse(composite.left, false)   // isAndContext = false
        const rightCol = traverse(composite.right, false)

        const columnName = leftCol || rightCol
        if (columnName && isAndContext) {
          // Celý OR subtree patrí k jednému stĺpcu
          columnFilters.set(columnName, expr)
        }
        return columnName
      }
    }
  }

  if (filter) {
    traverse(filter, true)  // Začni v AND kontexte
  }

  return columnFilters
}
```

**Príklad použitia:**
```typescript
// Filter tree:
// (Status = 'Active' OR Status = 'Pending') AND (Category = 'Important')

const columnFilters = extractColumnFilters(store.filterExpression)

// Výsledok:
// Map {
//   'Status' => (Status = 'Active' OR Status = 'Pending'),
//   'Category' => (Category = 'Important')
// }

// Teraz môžeme nahradiť filter pre 'Status' bez ovplyvnenia 'Category'
columnFilters.set('Status', newStatusFilter)
const newFilter = combineFiltersWithAnd(Array.from(columnFilters.values()))
```

##### combineFiltersWithAnd()
```typescript
function combineFiltersWithAnd(filters: FilterExpression[]): FilterExpression | null {
  const validFilters = filters.filter(f => f != null)

  if (validFilters.length === 0) return null
  if (validFilters.length === 1) return validFilters[0]

  let result = validFilters[0]
  for (let i = 1; i < validFilters.length; i++) {
    result = {
      type: 'composite',
      left: result,
      right: validFilters[i],
      operator: 'AND'
    } as CompositeFilter
  }

  return result
}
```
**Použitie:** Combine multiple filter expressions with AND operator into a composite filter tree.

##### combineWithExistingFilters()
```typescript
function combineWithExistingFilters(newColumnFilter: FilterExpression, columnName: string): FilterExpression {
  const currentFilter = store.filterExpression
  const columnFilters = extractColumnFilters(currentFilter)

  // Replace or add filter for this column
  columnFilters.set(columnName, newColumnFilter)

  // Combine all column filters with AND
  const allFilters = Array.from(columnFilters.values())
  return combineFiltersWithAnd(allFilters) || newColumnFilter
}
```
**Použitie:** Combine a new column filter with existing filters from other columns. Replaces the filter for the target column while preserving filters for other columns.

#### Filter Application

##### handleApplyRegexFilter()
```typescript
function handleApplyRegexFilter(pattern: string) {
  const columnName = filterFlyout.value.columnName

  if (!pattern) {
    // Empty pattern = remove filter for this column
    const columnFilters = extractColumnFilters(store.filterExpression)
    columnFilters.delete(columnName)

    if (columnFilters.size === 0) {
      store.clearFilter()
    } else {
      const allFilters = Array.from(columnFilters.values())
      const combinedFilter = combineFiltersWithAnd(allFilters)
      store.setFilter(combinedFilter)
    }
    return
  }

  // Use 'Contains' operator as simplified pattern match
  const newColumnFilter: SimpleFilter = {
    type: 'simple',
    columnName,
    operator: 'Contains',
    value: pattern
  }

  const combinedFilter = combineWithExistingFilters(newColumnFilter, columnName)
  store.setFilter(combinedFilter)

  console.log(`Applied text contains filter to ${columnName}:`, pattern)
}
```
**Použitie:** Apply regex/text pattern filter to a column. Note: Full regex support is simplified to 'Contains' operator in the declarative filter system.

##### handleClearFilter()
```typescript
function handleClearFilter() {
  const columnName = filterFlyout.value.columnName

  // Remove filter for this column only
  const columnFilters = extractColumnFilters(store.filterExpression)
  columnFilters.delete(columnName)

  if (columnFilters.size === 0) {
    store.clearFilter()
  } else {
    const allFilters = Array.from(columnFilters.values())
    const combinedFilter = combineFiltersWithAnd(allFilters)
    store.setFilter(combinedFilter)
  }

  console.log(`Cleared filter for ${columnName}`)
}
```
**Použitie:** Clear filter for a specific column while preserving filters for other columns.

#### Data Import

##### handleImportFromJson()
```typescript
async function handleImportFromJson(mode: ImportMode = ImportMode.Append) {
  // Convert current rows to plain objects
  const currentRows = store.rows.map(row => {
    const rowData: Record<string, any> = {
      __rowId: row.rowId,
      __rowIndex: row.rowIndex
    }

    row.cells.forEach(cell => {
      rowData[cell.columnName] = cell.value
    })

    return rowData
  })

  const columnNames = getDataColumnNames()

  // Open import dialog and process file
  const result = await importExport.openImportDialog(currentRows, columnNames, {
    mode,
    validateSchema: true
  })

  if (result.success && result.rows) {
    console.log(result.message)
    store.loadRows(result.rows)
    console.log(`Successfully imported ${result.rowsImported} rows into grid`)
  } else {
    console.error('Import failed:', result.errors)
    alert(`Import failed: ${result.message}\n${result.errors.join('\n')}`)
  }
}
```
**Použitie:** Import data from JSON file with support for Append/Replace/Merge modes. Opens file picker dialog, validates schema, and loads rows into grid.

**Import Modes:**
- `ImportMode.Append` - Add new rows to end
- `ImportMode.Replace` - Replace all existing rows
- `ImportMode.Merge` - Merge by `__rowId` (update existing, add new)

---

## 2. DataGridHeader.vue

### Prehľad

**Účel:** Komponent pre header (hlavičku) DataGrid. Zobrazuje názvy stĺpcov, sort indikátory, filter ikony a umožňuje resize stĺpcov drag&drop.

**Kľúčové funkcionality:**
- **Sorting** - klik na header → sort ascending/descending, Ctrl+klik → multi-column sort
- **Column Resize** - drag&drop resize handle → zmena šírky stĺpca
- **Context Menu** - pravý klik → Sort, Hide Column, Auto-fit, Show Filter
- **Checkbox Toggle All** - klik na checkbox header → označí/odznačí všetky riadky
- **Filter Indicator** - zobrazuje 🔍 ikonu ak je na stĺpci aktívny filter

### Veľkosť
- **Počet riadkov:** 503
- **Template:** 1-182 (header bunky, sort/filter indikátory, resize handle)
- **Script:** 184-466 (sort, resize, context menu logika)
- **Style:** 468-503 (header styling, hover efekty)

### Props

**Účel:** Konfigurácia header komponentu - stĺpce, grid layout, store ID.

```typescript
interface DataGridHeaderProps {
  columns: GridColumn[]           // Všetky stĺpce (data + special) - určuje počet a poradie header buniek
  gridTemplateColumns: string     // CSS grid-template-columns - šírky stĺpcov (napr. "40px 150px 200px")
  gridId?: string                 // Pre store access - potrebné pre sort state a filter info
}
```

**Dôležité:**
- `columns` obsahuje ALL stĺpce (checkbox, validácia, dátové, akcie) v správnom poradí
- `gridTemplateColumns` musí mať rovnaký počet hodnôt ako `columns.length`
- `gridId` je kľúčový pre viacero gridov na stránke (každý má vlastný sort/filter state)

### Emits

**Účel:** Udalosti, ktoré DataGridHeader posiela parent komponentu (DataGrid.vue) pre spracovanie akcií.

```typescript
{
  // SORT - klik na header → zmení sort direction
  sort: (columnName: string, direction: 'asc' | 'desc', multiSort: boolean) => void

  // RESIZE - drag resize handle → zmení šírku stĺpca
  resize: (columnName: string, newWidth: number) => void

  // HIDE COLUMN - context menu → skryje stĺpec
  hideColumn: (columnName: string) => void

  // AUTO-FIT COLUMN - context menu → auto-prispôsobí šírku stĺpca na obsah
  autoFitColumn: (columnName: string) => void

  // SHOW FILTER - context menu → otvorí filter flyout
  showFilter: (columnName: string) => void
}
```

**Príklad použitia:**
```vue
<!-- DataGrid.vue -->
<DataGridHeader
  :columns="allColumns"
  :grid-template-columns="gridTemplateColumns"
  :grid-id="gridId"
  @sort="handleSort"
  @resize="handleColumnResize"
  @hide-column="handleHideColumn"
  @auto-fit-column="handleAutoFitColumn"
  @show-filter="handleShowFilter"
/>
```

### Template Štruktúra

```html
<div class="grid-header" :style="{ gridTemplateColumns }">
  <div
    v-for="column in columns"
    :key="column.name"
    class="header-cell"
    @click="handleHeaderClick(column)"
    @contextmenu="handleRightClick($event, column)"
  >
    <!-- Header Text -->
    <span class="header-text">{{ column.header }}</span>

    <!-- Sort Indicator -->
    <span v-if="sortInfo" class="sort-indicator">
      {{ sortInfo.direction === 'asc' ? '▲' : '▼' }}
      <sup v-if="sortInfo.order > 1">{{ sortInfo.order }}</sup>
    </span>

    <!-- Filter Icon -->
    <span v-if="column.isFilterable && hasActiveFilter" class="filter-icon">
      🔍
    </span>

    <!-- Resize Handle -->
    <div
      v-if="!column.autoWidth"
      class="resize-handle"
      @mousedown="startResize($event, column.name)"
    />
  </div>
</div>
```

### Kľúčové Funkcie

#### handleHeaderClick()

**Účel:** Spracuje klik na header bunku - either toggle sort (pre dátové stĺpce) alebo toggle all checkboxes (pre checkbox stĺpec).

**Vstup:** `column: GridColumn` - stĺpec, na ktorý sa kliklo.

**Výstup:** Void. Emituje `sort` event alebo volá `toggleAllCheckboxes()`.

**Prečo:** Centralizovaný handler pre header klik. Podporuje single sort (klik) aj multi-column sort (Ctrl+klik).

**Logika:**
1. **Checkbox stĺpec** → toggle all rows
2. **Non-sortable stĺpec** → ignore
3. **Sortable stĺpec** → toggle sort direction (asc ↔ desc)

```typescript
function handleHeaderClick(column: GridColumn) {
  // 1️⃣ ŠPECIÁLNY PRÍPAD: Checkbox stĺpec
  if (column.specialType === 'Checkbox') {
    toggleAllCheckboxes()  // Označí/odznačí všetky riadky
    return
  }

  // 2️⃣ Ignoruj non-sortable stĺpce
  if (!column.isSortable) return

  // 3️⃣ SORT LOGIC
  // Ctrl+klik (Win/Linux) alebo Cmd+klik (macOS) → multi-column sort
  const isMultiSort = event.ctrlKey || event.metaKey

  // Toggle sort direction: asc → desc → asc → ...
  const currentDirection = sortInfoMap.value.get(column.name)?.direction
  const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'

  // Emituj sort event pre DataGrid.vue spracovanie
  emit('sort', column.name, newDirection, isMultiSort)
}
```

**Príklad použitia:**
```typescript
// Single column sort
// Klik na "Name" header → sort by Name ascending
// Klik znova na "Name" header → sort by Name descending

// Multi-column sort
// Klik na "Category" → sort by Category asc
// Ctrl+Klik na "Name" → sort by Category asc, then by Name asc
// Ctrl+Klik na "Name" znova → sort by Category asc, then by Name desc
```

#### startResize()

**Účel:** Začne drag&drop resize operáciu pre stĺpec. Volá sa pri mousedown na resize handle (malý divider medzi stĺpcami).

**Vstup:**
- `event: MouseEvent` - mousedown event
- `columnName: string` - názov stĺpca, ktorý sa resizuje

**Výstup:** Void. Nastaví resize state a pripojí global mouse listeners.

**Prečo:** Umožňuje užívateľovi zmeniť šírku stĺpca drag&drop (ako v Exceli). Global listeners zabezpečujú, že resize funguje aj keď myš opustí header.

```typescript
function startResize(event: MouseEvent, columnName: string) {
  // Zabráň triggeru handleHeaderClick() (sort)
  event.stopPropagation()

  // Nastav resize state
  isResizing.value = true
  resizingColumn.value = columnName
  resizeStartX.value = event.clientX           // Počiatočná X pozícia myši
  resizeStartWidth.value = getColumnWidth(columnName)  // Počiatočná šírka stĺpca

  // Pripoj global mouse listeners (drag môže ísť mimo header)
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}
```

**handleResize()** - spracováva mouse move počas drag

```typescript
function handleResize(event: MouseEvent) {
  // Kontrola, či je resize aktívny
  if (!isResizing.value || !resizingColumn.value) return

  // Vypočítaj delta (koľko pixelov sa myš posunula)
  const deltaX = event.clientX - resizeStartX.value

  // Nová šírka = pôvodná šírka + delta (min 50px)
  const newWidth = Math.max(50, resizeStartWidth.value + deltaX)

  // Emituj resize event s novou šírkou
  emit('resize', resizingColumn.value, newWidth)
}
```

**stopResize()** - ukončí resize pri mouseup

```typescript
function stopResize() {
  // Vyčisti resize state
  isResizing.value = false
  resizingColumn.value = null

  // Odstráň global listeners (memory leak prevention)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}
```

**Príklad použitia:**
```typescript
// 1. Užívateľ klikne na resize handle medzi "Name" a "Email" stĺpcami
//    → startResize(event, 'Name')
//    → resizeStartX = 200px, resizeStartWidth = 150px

// 2. Užívateľ drag myš doprava o 50px
//    → handleResize() každý frame
//    → deltaX = 50px
//    → newWidth = 150 + 50 = 200px
//    → emit('resize', 'Name', 200)

// 3. Užívateľ pustí myš
//    → stopResize()
//    → resize complete, "Name" stĺpec má šírku 200px
```

#### Context Menu

**Účel:** Zobrazí context menu pri pravom kliku na header bunku. Ponúka sorting, hide column, auto-fit a filter actions.

**Vstup:**
- `event: MouseEvent` - right-click event
- `column: GridColumn` - stĺpec, na ktorý sa kliklo pravým tlačidlom

**Výstup:** Void. Zobrazí context menu s akciami.

**Prečo:** Alternatívny spôsob prístupu ku column actions (namiesto kliku a drag&drop). Špeciálne stĺpce (checkbox, validácia, akcie) nemajú context menu.

**Menu items:**
- **Sort Ascending / Descending** - sort stĺpec
- **Hide Column** - skryje stĺpec (možno obnoviť cez "Show All Columns")
- **Auto-fit Column** - prispôsobí šírku na najširší obsah
- **Show Filter** - otvorí filter flyout (iba pre filterable stĺpce)

```typescript
function handleRightClick(event: MouseEvent, column: GridColumn) {
  // Zabráň default browser context menu
  event.preventDefault()

  // Špeciálne stĺpce (checkbox, validácia, akcie) nemajú context menu
  if (column.specialType) return

  // Zobraz @imengyu/vue3-context-menu
  ContextMenu.showContextMenu({
    x: event.x,  // Pozícia myši
    y: event.y,
    items: [
      // --- SORT ACTIONS ---
      {
        label: 'Sort Ascending',
        onClick: () => emit('sort', column.name, 'asc', false)  // Single sort
      },
      {
        label: 'Sort Descending',
        onClick: () => emit('sort', column.name, 'desc', false)
      },

      { divided: true },  // Separator

      // --- COLUMN MANAGEMENT ---
      {
        label: 'Hide Column',
        onClick: () => emit('hideColumn', column.name)
      },
      {
        label: 'Auto-fit Column',
        onClick: () => emit('autoFitColumn', column.name)
      },

      { divided: true },  // Separator

      // --- FILTER ACTION ---
      {
        label: 'Show Filter',
        onClick: () => emit('showFilter', column.name),
        disabled: !column.isFilterable  // Disabled pre non-filterable stĺpce
      }
    ]
  })
}
```

**Príklad použitia:**
```typescript
// 1. Pravý klik na "Name" header
//    → Context menu s 6 items (Sort Asc, Sort Desc, Hide, Auto-fit, Show Filter)

// 2. Klik na "Sort Ascending"
//    → emit('sort', 'Name', 'asc', false)
//    → DataGrid.vue sortne riadky podľa Name ascending

// 3. Pravý klik na "Status" header (isFilterable = false)
//    → Context menu, "Show Filter" je disabled (sivý, neklickateľný)
```

#### Checkbox Header (Tri-state)
```typescript
const checkboxState = computed(() => {
  const totalRows = store.rows.length
  const checkedCount = store.checkedRows.length

  if (checkedCount === 0) return 'none'
  if (checkedCount === totalRows) return 'all'
  return 'some'
})

function toggleAllCheckboxes() {
  if (checkboxState.value === 'all') {
    store.clearAllCheckboxes()
  } else {
    store.checkAllRows()
  }
}
```

### Computed Properties

#### sortInfoMap
```typescript
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

### Dodatočné Funkcie

#### getSortInfo()
```typescript
function getSortInfo(columnName: string): {
  direction: 'asc' | 'desc'
  order: number
  isPrimary: boolean
} | null {
  return sortInfoMap.value.get(columnName) ?? null
}
```
**Použitie:** Get sort information for a specific column. Returns object with direction, order, and isPrimary flag, or null if column is not sorted.

#### handleCheckboxHeaderClick()
```typescript
function handleCheckboxHeaderClick() {
  store.toggleAllCheckboxes()
}
```
**Použitie:** Toggle all row checkboxes. Called when checkbox header is clicked. Uses tri-state logic (none → all → none).

#### handleSort()
```typescript
function handleSort(column: GridColumn, multiSort = false) {
  if (!column.isSortable) return

  const currentSort = getSortInfo(column.name)

  if (currentSort) {
    // Column is already sorted - toggle direction
    const newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc'
    store.addSort(column.name, newDirection, multiSort)
  } else {
    // Column is not sorted - add ascending sort
    store.addSort(column.name, 'asc', multiSort)
  }
}
```
**Použitie:** Internal sort handler. Toggles sort direction if column is already sorted, otherwise adds ascending sort. Supports multi-column sorting when `multiSort = true` (Shift+Click).

---

## 3. DataGridRow.vue

### Prehľad

**Účel:** Wrapper komponent pre jeden riadok gridu. Obsahuje DataGridCell komponenty (pre dátové stĺpce) a SpecialColumnCell (pre checkbox, validácia, akcie).

**Kľúčové funkcionality:**
- **Dynamic height** - výška riadku sa prispôsobuje obsahu (AutoRowHeight alebo newline count)
- **Cell rendering** - renderuje všetky bunky v správnom poradí
- **Event propagation** - preposiela cell events (edit, checkbox, delete, insert) do DataGrid.vue
- **Minimal logic** - väčšina logiky je v DataGridCell, DataGridRow je iba wrapper

### Veľkosť
- **Počet riadkov:** 127 (malý komponent, hlavne template)

### Props

**Účel:** Konfigurácia riadku - dáta, stĺpce, layout.

```typescript
interface DataGridRowProps {
  row: GridRow                    // Dáta riadku (rowId, cells, height)
  columns: GridColumn[]           // Všetky stĺpce (určuje poradie buniek)
  gridTemplateColumns: string     // CSS grid layout (šírky stĺpcov)
  minTableWidth?: number          // Minimálna šírka riadku (pre horizontal scroll sync)
  gridId?: string                 // Pre store access (checkbox state)
}
```

**Dôležité:**
- `row.height` určuje výšku riadku (default 40px, AutoRowHeight môže zvýšiť)
- `gridTemplateColumns` musí zodpovedať `columns` počtu
- `minTableWidth` zabezpečuje, že riadky majú rovnakú šírku ako header pri horizontal scroll

### Emits

**Účel:** Udalosti, ktoré DataGridRow preposiela do DataGrid.vue.

```typescript
{
  // Bunka dokončila editáciu (Enter alebo Blur)
  cellEditComplete: (rowId: string, columnName: string, value: any) => void

  // Checkbox bol zaškrtnutý/odškrtnutý
  checkboxChange: (rowId: string, checked: boolean) => void

  // Akčné tlačidlo "Delete Row" (z action column)
  deleteRow: (rowId: string) => void

  // Akčné tlačidlo "Insert Row" (z context menu alebo action column)
  insertRow: (afterRowId: string) => void
}
```

**Dôležité:**
- DataGridRow je iba **event relay** - nepridáva žiadnu logiku, iba preposiela events z child komponentov (DataGridCell, SpecialColumnCell) do DataGrid.vue

### Template Štruktúra

```html
<div
  class="grid-row"
  :style="{
    gridTemplateColumns,
    height: `${row.height}px`,
    minWidth: minTableWidth ? `${minTableWidth}px` : undefined
  }"
>
  <template v-for="column in columns" :key="column.name">
    <!-- Special Columns -->
    <SpecialColumnCell
      v-if="column.specialType"
      :special-type="column.specialType"
      :row-id="row.rowId"
      :row-index="row.rowIndex"
      :column="column"
      :is-checked="isRowChecked(row.rowId)"
      @checkbox-change="handleCheckboxChange"
      @delete-row="handleDeleteRow"
      @insert-row="handleInsertRow"
    />

    <!-- Data Cells -->
    <DataGridCell
      v-else
      :row-id="row.rowId"
      :column="column"
      :cell="getCell(row, column.name)"
      @edit-complete="handleEditComplete"
    />
  </template>
</div>
```

### Kľúčové Funkcie

```typescript
function getCell(row: GridRow, columnName: string) {
  return row.cells.find(c => c.columnName === columnName)
}

function isRowChecked(rowId: string): boolean {
  return store.checkedRows.includes(rowId)
}

function handleCheckboxChange(rowId: string, checked: boolean) {
  emit('checkboxChange', rowId, checked)
}

function handleEditComplete(rowId: string, columnName: string, value: any) {
  emit('cellEditComplete', rowId, columnName, value)
}

function handleDeleteRow(rowId: string) {
  emit('deleteRow', rowId)
}

function handleInsertRow(afterRowId: string) {
  emit('insertRow', afterRowId)
}
```

---

## 4. DataGridCell.vue

### Prehľad

**Účel:** Komponent pre jednotlivú bunku gridu. **NAJKOMPLEXNEJŠÍ** komponent s množstvom funkcionalít - inline editácia, validáciu, selection, drag selection, keyboard navigation, theming.

**Kľúčové funkcionality:**
- **Inline Editing** - double-click alebo Enter → textarea editor, ESC → zruš edit
- **Validation** - real-time validácia počas editácie, zobrazenie validation error styling
- **Selection** - klik → select cell, drag → select range, Shift+click → extend selection
- **Drag Selection** - mousedown + drag → multi-cell selection (Excel-like)
- **Keyboard Navigation** - Enter → edit, Escape → cancel, Tab → next cell
- **Theming** - dynamické farby cez CSS custom properties (cell background, hover, selected, validation states)
- **Auto-focus** - automatický focus na input po vstupe do edit mode

### Veľkosť
- **Počet riadkov:** 696 (najväčší komponent po DataGrid.vue)
- **Template:** 1-87 (textarea editor + display content)
- **Script:** 89-621 (edit logic, selection logic, validation, keyboard handlers)
- **Style:** 623-696 (cell styling, states, transitions)

### Props

**Účel:** Identifikácia a konfigurácia bunky - row ID, column config, cell data.

```typescript
interface DataGridCellProps {
  rowId: string           // ID riadku (pre store updates a event emits)
  column: GridColumn      // Konfigurácia stĺpca (editable, readonly, type, width)
  cell: GridCell          // Dáta bunky (columnName, value)
  gridId?: string         // Pre store access (selection state, validation errors)
}
```

**Dôležité:**
- `rowId` + `column.name` = **unikátna identifikácia bunky** v celom gridu
- `column.isReadOnly` → bunka nemôže byť editovaná (double-click nefunguje)
- `cell.value` je aktuálna hodnota bunky (môže byť string, number, boolean, null)

### Emits

**Účel:** Notifikácia parent komponentov o zmenách v bunke.

```typescript
{
  // Editácia dokončená (Enter alebo Blur) → uloží hodnotu do store
  editComplete: (rowId: string, columnName: string, value: any) => void

  // Real-time input počas editácie (každý keystroke) → pre AutoRowHeight real-time resize
  input: (rowId: string, columnName: string, value: any) => void
}
```

**Rozdiel medzi `input` a `editComplete`:**
- **`input`** - volá sa pri KAŽDOM keystroke (real-time)
  → používa sa pre real-time AutoRowHeight prepočet
- **`editComplete`** - volá sa iba RAZ pri dokončení editácie (Enter/Blur)
  → používa sa pre uloženie hodnoty do store + validáciu

### Template Štruktúra

```html
<div
  class="grid-cell"
  :class="{
    'is-selected': isSelected,
    'is-editing': isEditing,
    'has-validation-error': hasValidationError,
    'is-readonly': column.isReadOnly
  }"
  :style="cellStyle"
  @mousedown="handleMouseDown"
  @mouseenter="handleMouseEnter"
  @dblclick="startEdit"
>
  <!-- Edit Mode -->
  <textarea
    v-if="isEditing"
    ref="inputRef"
    v-model="editValue"
    class="cell-input"
    @blur="finishEdit"
    @keydown="handleKeyDown"
  />

  <!-- Display Mode -->
  <div v-else class="cell-content">
    {{ displayValue }}
  </div>

  <!-- Validation Error Tooltip -->
  <div v-if="hasValidationError" class="validation-tooltip">
    {{ validationMessage }}
  </div>
</div>
```

### Kľúčové Funkcie

#### Edit Mode

```typescript
const isEditing = ref(false)
const editValue = ref('')
const inputRef = ref<HTMLTextAreaElement>()

function startEdit() {
  if (column.isReadOnly) return

  isEditing.value = true
  editValue.value = cell.value?.toString() ?? ''

  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function finishEdit() {
  if (!isEditing.value) return

  const newValue = editValue.value
  const oldValue = cell.value

  if (newValue !== oldValue) {
    emit('editComplete', rowId, column.name, newValue)
  }

  isEditing.value = false
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.shiftKey) {
    // Shift+Enter = new line (do nothing, let textarea handle it)
    return
  }

  if (event.key === 'Enter') {
    // Enter = finish edit
    event.preventDefault()
    finishEdit()
  }

  if (event.key === 'Escape') {
    // Escape = cancel edit
    event.preventDefault()
    editValue.value = cell.value?.toString() ?? ''
    isEditing.value = false
  }

  if (event.key === 'Tab') {
    event.preventDefault()
    finishEdit()
    // Move to next cell (handled by parent)
  }
}
```

#### Selection

```typescript
const cellKey = computed(() => `${rowId}:${column.name}`)

const isSelected = computed(() => {
  return store.selectedCells.has(cellKey.value)
})

function handleMouseDown(event: MouseEvent) {
  if (isEditing.value) return

  const mode = event.ctrlKey || event.metaKey ? 'add' : 'replace'
  store.selectCell(rowId, column.name, mode)

  // Start drag selection
  store.startDragSelection(rowId, column.name, event.ctrlKey)
}

function handleMouseEnter(event: MouseEvent) {
  if (!store.isDragging) return

  store.updateDragSelection(rowId, column.name)
}
```

#### Validation

```typescript
const hasValidationError = computed(() => {
  const errors = validation.getValidationErrors(rowId)
  return errors.some(e => e.columnName === column.name)
})

const validationMessage = computed(() => {
  const errors = validation.getValidationErrors(rowId)
  const error = errors.find(e => e.columnName === column.name)
  return error?.message ?? ''
})

const validationSeverity = computed(() => {
  const errors = validation.getValidationErrors(rowId)
  const error = errors.find(e => e.columnName === column.name)
  return error?.severity ?? 'Error'
})
```

#### Cell Style

```typescript
const cellStyle = computed(() => {
  const styles: any = {}

  // Validation styling
  if (hasValidationError.value) {
    const severity = validationSeverity.value

    if (severity === 'Error' || severity === 'Critical') {
      styles.backgroundColor = 'var(--dg-validation-error-bg, #ffebee)'
      styles.borderColor = 'var(--dg-validation-error-border, #f44336)'
    } else if (severity === 'Warning') {
      styles.backgroundColor = 'var(--dg-validation-warning-bg, #fff3cd)'
      styles.borderColor = 'var(--dg-validation-warning-border, #ffc107)'
    } else {
      styles.backgroundColor = 'var(--dg-validation-info-bg, #e3f2fd)'
      styles.borderColor = 'var(--dg-validation-info-border, #2196f3)'
    }
  }

  // Selection styling
  if (isSelected.value) {
    styles.backgroundColor = 'var(--dg-cell-selected-bg, #e3f2fd)'
    styles.borderColor = 'var(--dg-cell-selected-border, #2196f3)'
  }

  return styles
})
```

### Dodatočné Funkcie

#### Cell Navigation & Keyboard
```typescript
function handleCellKeyDown(event: KeyboardEvent) {
  // Arrow key navigation
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
    navigateCell(event.key)
  }

  // Enter to start editing
  if (event.key === 'Enter' && !isEditing.value) {
    startEdit()
  }

  // F2 to start editing
  if (event.key === 'F2' && !isEditing.value) {
    startEdit()
  }

  // Delete to clear cell
  if (event.key === 'Delete' && !isEditing.value) {
    clearCell()
  }
}
```

#### Edit Confirmation & Cancellation
```typescript
function confirmEdit() {
  if (!isEditing.value) return

  const newValue = editValue.value
  const oldValue = cell.value

  if (newValue !== oldValue) {
    emit('editComplete', rowId, column.name, newValue)
  }

  isEditing.value = false
}

function cancelEdit() {
  editValue.value = cell.value?.toString() ?? ''
  isEditing.value = false
}
```

#### Blur Handling
```typescript
function handleBlur() {
  // Auto-commit on blur (configurable)
  if (isEditing.value && !isContextMenuOpen.value) {
    confirmEdit()
  }
}
```

#### Context Menu
```typescript
function handleContextMenu(event: MouseEvent) {
  event.preventDefault()

  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    items: [
      {
        label: 'Copy',
        onClick: () => handleCopy()
      },
      {
        label: 'Paste',
        onClick: () => handlePaste()
      },
      {
        label: 'Clear Cell',
        onClick: () => clearCell()
      },
      { divider: true },
      {
        label: 'Edit Cell',
        onClick: () => startEdit()
      }
    ]
  })
}
```

---

## 5. SpecialColumnCell.vue

### Prehľad

**Účel:** Komponent pre špeciálne (non-dátové) stĺpce - riadkové číslo, checkbox, validation alerts, akčné tlačidlá (delete/insert row).

**Typy špeciálnych stĺpcov:**
1. **RowNumber** - zobrazuje číslo riadku (1, 2, 3, ...)
2. **Checkbox** - checkbox pre označenie riadku (multi-select)
3. **ValidationAlerts** - zobrazuje validation error ikony a popisy
4. **DeleteRow** - tlačidlo pre zmazanie riadku
5. **InsertRow** - tlačidlo pre vloženie nového riadku

**Prečo samostatný komponent:**
- Špeciálne stĺpce majú úplne inú logiku ako dátové bunky (DataGridCell)
- Nemajú inline editing, validation, drag selection
- Majú špecifické click handlery (checkbox toggle, delete row, atď.)

### Veľkosť
- **Počet riadkov:** 355 (template-heavy komponent s 5 rôznymi typmi)

### Props

**Účel:** Konfigurácia špeciálneho stĺpca - typ, row ID, checkbox state.

```typescript
interface SpecialColumnCellProps {
  specialType: 'RowNumber' | 'Checkbox' | 'ValidationAlerts' | 'DeleteRow' | 'InsertRow'
  rowId: string           // ID riadku (pre checkbox change, delete, insert)
  rowIndex: number        // Index riadku (pre RowNumber zobrazenie: rowIndex + 1)
  column: GridColumn      // Column config (width, styling)
  isChecked?: boolean     // Checkbox state (iba pre Checkbox type)
  gridId?: string         // Pre store access (validation errors)
}
```

**Dôležité:**
- `specialType` určuje, ktorý template block sa renderuje
- `rowIndex` je 0-based → RowNumber zobrazuje `rowIndex + 1`
- `isChecked` je reactive - mení sa pri checkbox klikoch

### Emits

**Účel:** Notifikácia parent komponentov o akciách v špeciálnych stĺpcoch.

```typescript
{
  // Checkbox bol zaškrtnutý/odškrtnutý
  checkboxChange: (rowId: string, checked: boolean) => void

  // Tlačidlo "Delete Row" bolo stlačené
  deleteRow: (rowId: string) => void

  // Tlačidlo "Insert Row" bolo stlačené
  insertRow: (afterRowId: string) => void
}
```

**Poznámka:**
- `insertRow` pridá nový riadok POD aktuálnym riadkom (afterRowId)
- `deleteRow` odstráni aktuálny riadok zo store
- `checkboxChange` aktualizuje checkbox state v store

### Template Štruktúra

```html
<div class="special-cell" :class="`special-cell--${specialType}`">
  <!-- RowNumber -->
  <span v-if="specialType === 'RowNumber'" class="row-number">
    {{ rowIndex + 1 }}
  </span>

  <!-- Checkbox -->
  <input
    v-else-if="specialType === 'Checkbox'"
    type="checkbox"
    :checked="isChecked"
    @change="handleCheckboxChange"
    class="row-checkbox"
  />

  <!-- ValidationAlerts -->
  <div v-else-if="specialType === 'ValidationAlerts'" class="validation-alerts">
    <div v-for="error in validationErrors" :key="error.columnName" class="validation-alert">
      <span :class="`severity-${error.severity.toLowerCase()}`">
        {{ getSeverityIcon(error.severity) }}
      </span>
      <span class="error-message">{{ error.message }}</span>
    </div>
  </div>

  <!-- DeleteRow -->
  <button
    v-else-if="specialType === 'DeleteRow'"
    @click="handleDeleteRow"
    class="action-button delete-button"
    title="Delete row"
  >
    🗑️
  </button>

  <!-- InsertRow -->
  <button
    v-else-if="specialType === 'InsertRow'"
    @click="handleInsertRow"
    class="action-button insert-button"
    title="Insert row below"
  >
    ➕
  </button>
</div>
```

### Kľúčové Funkcie

```typescript
// Checkbox
function handleCheckboxChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  emit('checkboxChange', rowId, checked)
}

// Delete Row (with debounce protection)
const lastDeleteTime = ref(0)
const DELETE_DEBOUNCE_MS = 300

function handleDeleteRow() {
  const now = Date.now()
  if (now - lastDeleteTime.value < DELETE_DEBOUNCE_MS) {
    console.log('[SpecialColumnCell] Delete blocked by debounce')
    return
  }

  lastDeleteTime.value = now
  emit('deleteRow', rowId)
}

// Insert Row
function handleInsertRow() {
  emit('insertRow', rowId)
}

// Validation Alerts
const validationErrors = computed(() => {
  return validation.getValidationErrors(rowId)
})

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'Critical': return '🔴'
    case 'Error': return '❌'
    case 'Warning': return '⚠️'
    case 'Info': return 'ℹ️'
    default: return '⚠️'
  }
}
```

---

## 6. LazyRow.vue

### Prehľad

**Účel:** Wrapper komponent pre **lazy rendering** pomocou IntersectionObserver. Renderuje DataGridRow iba keď je viditeľný vo viewport (alebo tesne pred vstupom).

**Kľúčová optimalizácia:**
- **10000 riadkov** → renderuje sa iba ~20 viditeľných riadkov
- **500x rýchlejší** initial render
- **Plynulý scroll** (60fps) vďaka predčasnej renderizácii (100px rootMargin)

**Ako funguje:**
1. LazyRow registruje `rowRef` element v IntersectionObserver (poskytnutý cez `inject`)
2. Keď sa riadok priblíži k viewportu (100px pred vstupom) → `isVisible = true`
3. Vue renderuje DataGridRow
4. Keď riadok opustí viewport → `isVisible = false` (unrender)

### Veľkosť
- **Počet riadkov:** 101 (minimalistický wrapper)

### Props

**Účel:** Props sú forwarded do DataGridRow - LazyRow nepridáva žiadnu logiku, iba lazy rendering wrapper.

```typescript
interface LazyRowProps {
  row: GridRow               // Dáta riadku (forwarded do DataGridRow)
  columns: GridColumn[]      // Stĺpce (forwarded)
  gridTemplateColumns: string  // CSS grid layout (forwarded)
  minTableWidth?: number     // Min width (forwarded)
  gridId?: string            // Store ID (forwarded)
}
```

**Dôležité:**
- Všetky props sú **pass-through** - LazyRow ich iba preposiela do DataGridRow
- LazyRow pridáva iba `v-if="isVisible"` condition na DataGridRow

### Template Štruktúra

```html
<div ref="rowRef" class="lazy-row-container">
  <DataGridRow
    v-if="isVisible"
    :row="row"
    :columns="columns"
    :grid-template-columns="gridTemplateColumns"
    :min-table-width="minTableWidth"
    :grid-id="gridId"
    @cell-edit-complete="emit('cellEditComplete', $event)"
    @checkbox-change="emit('checkboxChange', $event)"
    @delete-row="emit('deleteRow', $event)"
    @insert-row="emit('insertRow', $event)"
  />

  <!-- Placeholder for non-visible rows -->
  <div v-else class="row-placeholder" :style="{ height: `${row.height}px` }" />
</div>
```

### Implementačné Detaily

```typescript
const rowRef = ref<HTMLElement>()
const isVisible = ref(true)  // Default visible for empty rows

onMounted(() => {
  const observer = inject<IntersectionObserver>('intersectionObserver')
  const rowVisibility = inject<Map<string, boolean>>('rowVisibility')

  if (!observer || !rowVisibility) return

  // Empty rows are always visible (no lazy loading)
  const isEmpty = row.cells.every(c => c.value == null || c.value === '')
  if (isEmpty) {
    isVisible.value = true
    return
  }

  // Non-empty rows use lazy rendering
  isVisible.value = rowVisibility.get(row.rowId) ?? true

  if (rowRef.value) {
    observer.observe(rowRef.value)
  }
})

onBeforeUnmount(() => {
  const observer = inject<IntersectionObserver>('intersectionObserver')
  if (observer && rowRef.value) {
    observer.unobserve(rowRef.value)
  }
})
```

**Poznámky:**
- IntersectionObserver je shared cez `provide/inject`
- Prázdne riadky sa VŽDY renderujú (nie lazy)
- Neprázdne riadky majú default visibility = true
- Visibility sa trackuje v Map pre O(1) lookup

---

## 7. FilterFlyout.vue

### Prehľad

**Účel:** Flyout dialóg pre filtrovanie stĺpcov. Zobrazuje sa vedľa header bunky po kliknutí na filter ikonu. Podporuje 2 režimy:
1. **Checkbox mode** - výber unikátnych hodnôt (napr. "Active", "Pending", "Completed")
2. **Regex mode** - pattern matching (napr. ".*@gmail.com" pre email filter)

**Kľúčové funkcionality:**
- **Unique values list** - zobrazuje zoznam všetkých unikátnych hodnôt v stĺpci s counts
- **Multi-select checkboxes** - označenie viacerých hodnôt naraz (OR filter)
- **Regex input** - textové pole pre regex pattern vstup
- **Apply/Cancel** - aplikuje filter alebo zatvára flyout
- **Positioning** - flyout sa pozicionuje vedľa header bunky (x, y coordinates)

### Veľkosť
- **Počet riadkov:** 517

### Props

```typescript
interface FilterFlyoutProps {
  visible: boolean
  columnName: string
  uniqueValues: FilterValue[]  // { value: string, isSelected: boolean, count: number, displayText: string }[]
  position: { x: number, y: number }
  mode: 'checkbox' | 'regex'
  pattern?: string
}
```

### Emits

```typescript
{
  applyCheckboxFilter: (selectedValues: string[]) => void
  applyRegexFilter: (pattern: string) => void
  close: () => void
}
```

### Template Štruktúra

```html
<div
  v-if="visible"
  class="filter-flyout"
  :style="{ left: `${position.x}px`, top: `${position.y}px` }"
>
  <div class="flyout-header">
    <h3>Filter: {{ columnName }}</h3>
    <button @click="emit('close')" class="close-button">✕</button>
  </div>

  <!-- Mode Tabs -->
  <div class="mode-tabs">
    <button
      :class="{ active: currentMode === 'checkbox' }"
      @click="currentMode = 'checkbox'"
    >
      Checkbox
    </button>
    <button
      :class="{ active: currentMode === 'regex' }"
      @click="currentMode = 'regex'"
    >
      Regex
    </button>
  </div>

  <!-- Checkbox Mode -->
  <div v-if="currentMode === 'checkbox'" class="checkbox-mode">
    <div class="search-box">
      <input v-model="searchQuery" placeholder="Search values..." />
    </div>

    <div class="select-all">
      <input
        type="checkbox"
        :checked="allSelected"
        @change="toggleSelectAll"
      />
      <label>Select All ({{ filteredValues.length }})</label>
    </div>

    <div class="values-list">
      <div v-for="item in filteredValues" :key="item.value" class="value-item">
        <input
          type="checkbox"
          :checked="item.isSelected"
          @change="toggleValue(item.value)"
        />
        <label>{{ item.displayText }}</label>
      </div>
    </div>
  </div>

  <!-- Regex Mode -->
  <div v-else class="regex-mode">
    <input
      v-model="regexPattern"
      placeholder="Enter regex pattern..."
      class="regex-input"
    />
    <div class="regex-help">
      Examples: ^A.* (starts with A), .*@gmail\\.com$ (Gmail emails)
    </div>
  </div>

  <!-- Footer -->
  <div class="flyout-footer">
    <button @click="applyFilter" class="apply-button">Apply</button>
    <button @click="clearFilter" class="clear-button">Clear</button>
  </div>
</div>
```

### Kľúčové Funkcie

```typescript
const currentMode = ref<'checkbox' | 'regex'>('checkbox')
const searchQuery = ref('')
const regexPattern = ref('')
const selectedValues = ref<Set<string>>(new Set())

// Checkbox Mode
const filteredValues = computed(() => {
  if (!searchQuery.value) return props.uniqueValues

  const query = searchQuery.value.toLowerCase()
  return props.uniqueValues.filter(item =>
    item.displayText.toLowerCase().includes(query)
  )
})

const allSelected = computed(() => {
  return filteredValues.value.every(item => item.isSelected)
})

function toggleSelectAll() {
  const newState = !allSelected.value
  filteredValues.value.forEach(item => {
    if (newState) {
      selectedValues.value.add(item.value)
    } else {
      selectedValues.value.delete(item.value)
    }
  })
}

function toggleValue(value: string) {
  if (selectedValues.value.has(value)) {
    selectedValues.value.delete(value)
  } else {
    selectedValues.value.add(value)
  }
}

// Apply Filter
function applyFilter() {
  if (currentMode.value === 'checkbox') {
    emit('applyCheckboxFilter', Array.from(selectedValues.value))
  } else {
    emit('applyRegexFilter', regexPattern.value)
  }

  emit('close')
}

function clearFilter() {
  selectedValues.value.clear()
  regexPattern.value = ''
  emit('applyCheckboxFilter', [])
  emit('close')
}
```

### Dodatočné Funkcie

#### displayText()
```typescript
const displayText = (item: FilterValue) => {
  return item.count > 0 ? `${item.value} (${item.count})` : item.value
}
```
**Použitie:** Helper function na formátovanie display textu pre filter hodnoty. Pridá count v zátvorkách ak je > 0.

#### selectAll()
```typescript
function selectAll() {
  filteredValues.value.forEach(item => {
    item.isSelected = true
  })
}
```
**Použitie:** Označí všetky filtrované hodnoty ako vybrané.

#### deselectAll()
```typescript
function deselectAll() {
  filteredValues.value.forEach(item => {
    item.isSelected = false
  })
}
```
**Použitie:** Zruší výber všetkých filtrovaných hodnôt.

#### handleApply()
```typescript
function handleApply() {
  if (filterMode.value === 'checkbox') {
    const selectedValues = values.value
      .filter(item => item.isSelected)
      .map(item => item.value)

    emit('applyCheckbox', selectedValues)
  } else {
    emit('applyRegex', regexPattern.value)
  }

  handleClose()
}
```
**Použitie:** Aplikuje aktuálny filter (checkbox alebo regex mode) a zavrie flyout.

#### handleClear()
```typescript
function handleClear() {
  emit('clearFilter')
  handleClose()
}
```
**Použitie:** Vyčistí filter a zavrie flyout.

#### handleClose()
```typescript
function handleClose() {
  emit('close')
}
```
**Použitie:** Zavrie filter flyout.

---

## 8. FilterRow.vue

### Prehľad

**Účel:** UI komponent pre stavbu **pokročilých composite filter expressions** s viacerými riadkami a AND/OR operátormi. Umožňuje vytvoriť komplexné filtre ako `(Status = 'Active' OR Status = 'Pending') AND (Category = 'Important')`.

**Kľúčové funkcionality:**
- **Multi-row UI** - pridávanie/odoberanie filter riadkov
- **Column selector** - dropdown pre výber stĺpca
- **Operator selector** - dropdown pre výber operátora (Equals, Contains, GreaterThan, atď.)
- **Value input** - textové pole pre hodnotu
- **AND/OR toggle** - prepínač medzi AND a OR operátormi medzi riadkami
- **Apply/Clear** - aplikuje filter tree alebo vyčistí všetky filtre

**Použitie:** Advanced filtering pre používateľov, ktorí potrebujú viac než jednoduchý checkbox filter.

### Veľkosť
- **Počet riadkov:** 482

### Props

```typescript
interface FilterRowProps {
  columns: GridColumn[]
  gridId?: string
}
```

### Emits

```typescript
{
  applyFilter: (filter: FilterExpression) => void
  clearFilter: () => void
}
```

### Template Štruktúra

```html
<div class="filter-row-builder">
  <div class="filter-rows">
    <div
      v-for="(row, index) in filterRows"
      :key="index"
      class="filter-row"
    >
      <!-- Logic Operator (AND/OR) -->
      <select
        v-if="index > 0"
        v-model="row.logicOperator"
        class="logic-operator"
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>

      <!-- Column Selector -->
      <select v-model="row.columnName" class="column-selector">
        <option value="">Select column...</option>
        <option
          v-for="col in dataColumns"
          :key="col.name"
          :value="col.name"
        >
          {{ col.header }}
        </option>
      </select>

      <!-- Operator Selector -->
      <select v-model="row.operator" class="operator-selector">
        <option value="Equals">Equals</option>
        <option value="NotEquals">Not Equals</option>
        <option value="Contains">Contains</option>
        <option value="StartsWith">Starts With</option>
        <option value="EndsWith">Ends With</option>
        <option value="GreaterThan">Greater Than</option>
        <option value="LessThan">Less Than</option>
        <option value="IsEmpty">Is Empty</option>
        <option value="IsNotEmpty">Is Not Empty</option>
      </select>

      <!-- Value Input -->
      <input
        v-if="!isUnaryOperator(row.operator)"
        v-model="row.value"
        type="text"
        placeholder="Value..."
        class="value-input"
      />

      <!-- Remove Row Button -->
      <button
        v-if="filterRows.length > 1"
        @click="removeRow(index)"
        class="remove-row-button"
      >
        ✕
      </button>
    </div>
  </div>

  <!-- Add Row Button -->
  <button @click="addRow" class="add-row-button">
    + Add Filter
  </button>

  <!-- Active Filters Display -->
  <div v-if="activeFilters.length > 0" class="active-filters">
    <span class="active-filters-label">Active:</span>
    <div
      v-for="(filter, index) in activeFilters"
      :key="index"
      class="filter-chip"
    >
      {{ filter.columnName }} {{ filter.operator }} {{ filter.value }}
      <button @click="removeActiveFilter(index)" class="remove-chip">✕</button>
    </div>
  </div>

  <!-- Footer -->
  <div class="filter-footer">
    <button @click="applyFilters" class="apply-button">Apply</button>
    <button @click="clearAllFilters" class="clear-button">Clear All</button>
  </div>
</div>
```

### Kľúčové Funkcie

```typescript
interface ColumnFilter {
  columnName: string
  operator: FilterOperator
  value: string
  logicOperator: 'AND' | 'OR'
}

const filterRows = ref<ColumnFilter[]>([
  { columnName: '', operator: 'Equals', value: '', logicOperator: 'AND' }
])

function addRow() {
  filterRows.value.push({
    columnName: '',
    operator: 'Equals',
    value: '',
    logicOperator: 'AND'
  })
}

function removeRow(index: number) {
  filterRows.value.splice(index, 1)
}

function isUnaryOperator(operator: FilterOperator): boolean {
  return operator === 'IsEmpty' || operator === 'IsNotEmpty'
}

// Build FilterExpression tree
function buildFilterExpression(): FilterExpression | null {
  const validRows = filterRows.value.filter(row =>
    row.columnName && (isUnaryOperator(row.operator) || row.value)
  )

  if (validRows.length === 0) return null
  if (validRows.length === 1) {
    return {
      type: 'simple',
      columnName: validRows[0].columnName,
      operator: validRows[0].operator,
      value: validRows[0].value
    }
  }

  // Build composite expression
  let expression: FilterExpression = {
    type: 'simple',
    columnName: validRows[0].columnName,
    operator: validRows[0].operator,
    value: validRows[0].value
  }

  for (let i = 1; i < validRows.length; i++) {
    const row = validRows[i]
    expression = {
      type: 'composite',
      left: expression,
      right: {
        type: 'simple',
        columnName: row.columnName,
        operator: row.operator,
        value: row.value
      },
      operator: row.logicOperator
    }
  }

  return expression
}

function applyFilters() {
  const filter = buildFilterExpression()
  emit('applyFilter', filter)
}

function clearAllFilters() {
  filterRows.value = [
    { columnName: '', operator: 'Equals', value: '', logicOperator: 'AND' }
  ]
  emit('clearFilter')
}
```

### Dodatočné Funkcie

#### Computed Properties

```typescript
const dataColumns = computed(() => {
  return store.columns.filter(col => !col.specialType)
})

const activeColumnFilters = computed(() => {
  return columnFilters.value.filter(f =>
    f.columnName && (f.value || ['IsEmpty', 'IsNotEmpty'].includes(f.operator))
  )
})

const activeFiltersCount = computed(() => activeColumnFilters.value.length)
```

#### addFilter()
```typescript
function addFilter() {
  columnFilters.value.push({
    columnName: '',
    operator: 'Contains',
    value: '',
    logicOperator: 'AND'
  })
}
```
**Použitie:** Pridá nový prázdny filter riadok do zoznamu.

#### removeFilter()
```typescript
function removeFilter(index: number) {
  columnFilters.value.splice(index, 1)

  // Ensure at least one empty filter exists
  if (columnFilters.value.length === 0) {
    addFilter()
  }

  updateFilters()
}
```
**Použitie:** Odstráni filter riadok na danom indexe. Zabezpečí že vždy ostane aspoň jeden prázdny filter.

#### updateFilters()
```typescript
function updateFilters() {
  const active = activeColumnFilters.value

  if (active.length === 0) {
    store.clearFilter()
    return
  }

  // Build composite filter expression
  if (active.length === 1) {
    // Single filter
    const f = active[0]
    const simpleFilter: SimpleFilter = {
      type: 'simple',
      columnName: f.columnName,
      operator: f.operator,
      value: f.value
    }
    store.setFilter(simpleFilter)
  } else {
    // Multiple filters - build composite expression
    let filterExpression: any = {
      type: 'simple',
      columnName: active[0].columnName,
      operator: active[0].operator,
      value: active[0].value
    }

    for (let i = 1; i < active.length; i++) {
      const currentFilter = active[i]
      const previousLogicOp = active[i - 1].logicOperator

      filterExpression = {
        type: 'composite',
        operator: previousLogicOp,
        left: filterExpression,
        right: {
          type: 'simple',
          columnName: currentFilter.columnName,
          operator: currentFilter.operator,
          value: currentFilter.value
        }
      }
    }

    store.setFilter(filterExpression)
  }
}
```
**Použitie:** Zostrojí filter expression tree z aktívnych filtrov a aplikuje ho na store. Podporuje single a composite filters s AND/OR operátormi.

#### toggleCollapse()
```typescript
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
```
**Použitie:** Prepína zobrazenie/skrytie filter riadkov (collapse/expand).

#### getColumnHeader()
```typescript
function getColumnHeader(columnName: string): string {
  const col = store.columns.find(c => c.name === columnName)
  return col?.header || columnName
}
```
**Použitie:** Vráti header text pre stĺpec. Ak stĺpec nie je nájdený, vráti columnName.

---

## 9. PaginationControl.vue

### Prehľad

**Účel:** Pagination ovládanie pre DataGrid s Page Size selector (10, 20, 50, 100, All riadkov na stránku) a Page navigation (Previous, Next, First, Last, Jump to page).

**Kľúčové funkcionality:**
- **Page Size dropdown** - zmena počtu riadkov na stránku
- **Page info** - zobrazuje "Showing 1-50 of 1000 rows"
- **Navigation buttons** - First, Previous, Next, Last page
- **Page jump** - input pre preskok na konkrétnu stránku
- **Keyboard support** - Enter v page jump inpute

**Použitie:** Umožňuje navigáciu v rozsiahlych datasetoch (1000+ riadkov) bez lagovania UI.

### Veľkosť
- **Počet riadkov:** 193

### Props

```typescript
interface PaginationControlProps {
  currentPage: number
  pageSize: number
  totalRows: number
}
```

### Emits

```typescript
{
  pageChange: (newPage: number) => void
  pageSizeChange: (newSize: number) => void
}
```

### Template Štruktúra

```html
<div class="pagination-control">
  <!-- Page Size Selector -->
  <div class="page-size-selector">
    <label>Rows per page:</label>
    <select :value="pageSize" @change="handlePageSizeChange">
      <option :value="25">25</option>
      <option :value="50">50</option>
      <option :value="100">100</option>
      <option :value="200">200</option>
      <option :value="500">500</option>
    </select>
  </div>

  <!-- Page Info -->
  <div class="page-info">
    <span>
      {{ startRow }} - {{ endRow }} of {{ totalRows }} rows
    </span>
  </div>

  <!-- Page Navigation -->
  <div class="page-navigation">
    <button
      @click="goToFirstPage"
      :disabled="currentPage === 1"
      class="nav-button"
      title="First page"
    >
      ⏮
    </button>

    <button
      @click="goToPreviousPage"
      :disabled="currentPage === 1"
      class="nav-button"
      title="Previous page"
    >
      ◀
    </button>

    <span class="page-display">
      Page {{ currentPage }} of {{ totalPages }}
    </span>

    <button
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
      class="nav-button"
      title="Next page"
    >
      ▶
    </button>

    <button
      @click="goToLastPage"
      :disabled="currentPage === totalPages"
      class="nav-button"
      title="Last page"
    >
      ⏭
    </button>
  </div>

  <!-- Jump to Page -->
  <div class="jump-to-page">
    <label>Go to:</label>
    <input
      v-model.number="jumpToPageInput"
      type="number"
      :min="1"
      :max="totalPages"
      @keydown.enter="handleJumpToPage"
      class="page-input"
    />
    <button @click="handleJumpToPage" class="jump-button">Go</button>
  </div>
</div>
```

### Computed Properties

```typescript
const totalPages = computed(() => {
  return Math.ceil(props.totalRows / props.pageSize)
})

const startRow = computed(() => {
  if (props.totalRows === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endRow = computed(() => {
  const end = props.currentPage * props.pageSize
  return Math.min(end, props.totalRows)
})
```

### Kľúčové Funkcie

```typescript
function handlePageSizeChange(event: Event) {
  const newSize = parseInt((event.target as HTMLSelectElement).value)
  emit('pageSizeChange', newSize)
}

function goToFirstPage() {
  emit('pageChange', 1)
}

function goToPreviousPage() {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

function goToNextPage() {
  if (props.currentPage < totalPages.value) {
    emit('pageChange', props.currentPage + 1)
  }
}

function goToLastPage() {
  emit('pageChange', totalPages.value)
}

const jumpToPageInput = ref<number>(1)

function handleJumpToPage() {
  const page = jumpToPageInput.value
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page)
  }
}
```

---

## 10. SearchPanel.vue

### Prehľad

**Účel:** Vyhľadávací panel s podporou rôznych search modes (Contains, Exact, StartsWith, EndsWith, Regex) a navigáciou cez výsledky.

**Kľúčové funkcionality:**
- **Search input** - textové pole pre vyhľadávací pattern
- **Search mode dropdown** - výber režimu (Contains, Exact, Regex, atď.)
- **Results navigation** - Previous/Next match, zobrazuje "3 of 45 matches"
- **Highlight matches** - zvýrazní nájdené bunky v gridu (žltá background)
- **Case sensitivity toggle** - zapnutie/vypnutie case sensitive search
- **Clear button** - vyčistí search a zruší highlights

**Použitie:** Rýchle vyhľadávanie hodnoty v celom gridu (všetky stĺpce, všetky riadky).

### Veľkosť
- **Počet riadkov:** 347

### Props

```typescript
interface SearchPanelProps {
  searchResults: SearchMatch[]
  currentResultIndex: number
  gridId?: string
}
```

### Emits

```typescript
{
  search: (term: string, mode: SearchMode, options: SearchOptions) => void
  nextResult: () => void
  previousResult: () => void
  clearSearch: () => void
}
```

### Template Štruktúra

```html
<div class="search-panel">
  <!-- Search Input -->
  <div class="search-input-container">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search..."
      @input="handleSearchInput"
      @keydown.enter="handleSearch"
      class="search-input"
    />

    <button
      v-if="searchTerm"
      @click="handleClearSearch"
      class="clear-search-button"
      title="Clear search"
    >
      ✕
    </button>
  </div>

  <!-- Search Mode Selector -->
  <div class="search-mode-selector">
    <label>Mode:</label>
    <select v-model="searchMode" @change="handleSearch">
      <option value="Contains">Contains</option>
      <option value="Exact">Exact</option>
      <option value="StartsWith">Starts With</option>
      <option value="EndsWith">Ends With</option>
      <option value="Regex">Regex</option>
      <option value="Fuzzy">Fuzzy</option>
    </select>
  </div>

  <!-- Search Options -->
  <div class="search-options">
    <label class="option-checkbox">
      <input v-model="caseSensitive" type="checkbox" @change="handleSearch" />
      Case Sensitive
    </label>

    <div v-if="searchMode === 'Fuzzy'" class="fuzzy-threshold">
      <label>Threshold:</label>
      <input
        v-model.number="fuzzyThreshold"
        type="number"
        min="1"
        max="10"
        @change="handleSearch"
        class="threshold-input"
      />
    </div>
  </div>

  <!-- Results Info -->
  <div v-if="searchResults.length > 0" class="search-results-info">
    <span class="results-count">
      {{ currentResultIndex + 1 }} / {{ searchResults.length }} matches
    </span>

    <div class="results-navigation">
      <button
        @click="emit('previousResult')"
        :disabled="currentResultIndex === 0"
        class="nav-button"
        title="Previous result"
      >
        ▲
      </button>

      <button
        @click="emit('nextResult')"
        :disabled="currentResultIndex === searchResults.length - 1"
        class="nav-button"
        title="Next result"
      >
        ▼
      </button>
    </div>
  </div>

  <div v-else-if="searchTerm && hasSearched" class="no-results">
    No results found
  </div>
</div>
```

### Kľúčové Funkcie

```typescript
const searchTerm = ref('')
const searchMode = ref<SearchMode>('Contains')
const caseSensitive = ref(false)
const fuzzyThreshold = ref(3)
const hasSearched = ref(false)

const handleSearchInput = useDebounceFn(() => {
  if (searchTerm.value) {
    handleSearch()
  } else {
    handleClearSearch()
  }
}, 300)

function handleSearch() {
  if (!searchTerm.value) return

  hasSearched.value = true

  emit('search', searchTerm.value, searchMode.value, {
    caseSensitive: caseSensitive.value,
    fuzzyThreshold: fuzzyThreshold.value
  })
}

function handleClearSearch() {
  searchTerm.value = ''
  hasSearched.value = false
  emit('clearSearch')
}
```

### Dodatočné Funkcie

#### toggleCollapse()
```typescript
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
```
**Použitie:** Prepína zobrazenie/skrytie search panelu (collapse/expand).

#### debounce()
```typescript
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
```
**Použitie:** Generic debounce helper function. Omedziť frekvenciu volania funkcie - počká `delay` ms pred vykonaním. Ak je funkcia volaná znova pred uplynutím delay, timer sa resetuje.

---

## 11. ListBox.vue

### Prehľad

**Účel:** Samostatný komponent pre výber položiek zo zoznamu s podporou single/multi select, search bar a reset button. **Nezávislý od DataGrid** - môže sa použiť samostatne v aplikácii.

**Kľúčové funkcionality:**
- **Single/Multi select** - výber jednej alebo viacerých položiek (checkbox mode)
- **Search bar** - rýchle filtrovanie položiek podľa textu
- **Reset button** - vyčistí všetky označené položky
- **Preselected values** - možnosť predvybrať položky pri inicializácii
- **Theming** - custom farby cez theme prop
- **Backend integration** - podporuje načítanie položiek z backend API (voliteľné)

**Použitie:** Dropdown selektory, filter panels, settings dialógy, atď.

### Veľkosť
- **Počet riadkov:** 314

### Props

```typescript
interface ListBoxProps {
  items: ListBoxItem[]
  config?: ListBoxConfig
  theme?: Partial<ListBoxTheme>
  preselectedValues?: string[]
  listBoxId?: string  // For backend API integration
}

interface ListBoxItem {
  value: string
  label: string
  disabled?: boolean
}

interface ListBoxConfig {
  allowMultiple: boolean        // Default: false
  showSearchBar: boolean        // Default: true
  showResetButton: boolean      // Default: true
  deselectOnClick?: boolean     // Single-select: deselect on click (default: true)
}
```

### Emits

```typescript
{
  selectionChange: (selectedValues: string[]) => void
}
```

### Exposed API

```typescript
{
  clearSelection: () => void
  getSelectedValues: () => string[]
  selectValue: (value: string) => void
}
```

### Template Štruktúra

```html
<div class="listbox-container" :style="cssVariables">
  <!-- Search Bar -->
  <div v-if="config.showSearchBar" class="listbox-search">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      class="search-input"
    />
  </div>

  <!-- Reset Button -->
  <button
    v-if="config.showResetButton"
    @click="clearSelection"
    class="reset-button"
    :disabled="selectedValues.size === 0"
  >
    Clear Selection
  </button>

  <!-- Items List -->
  <div class="listbox-items">
    <div
      v-for="item in filteredItems"
      :key="item.value"
      class="listbox-item"
      :class="{
        'is-selected': selectedValues.has(item.value),
        'is-disabled': item.disabled
      }"
      @click="handleItemClick(item)"
    >
      <!-- Multi-select: Checkbox -->
      <input
        v-if="config.allowMultiple"
        type="checkbox"
        :checked="selectedValues.has(item.value)"
        :disabled="item.disabled"
        class="item-checkbox"
      />

      <!-- Item Label -->
      <span class="item-label">{{ item.label }}</span>
    </div>
  </div>
</div>
```

### Kľúčové Funkcie

```typescript
const selectedValues = ref<Set<string>>(new Set())
const searchQuery = ref('')

// Initialize preselected values
onMounted(() => {
  if (props.preselectedValues) {
    props.preselectedValues.forEach(value => {
      selectedValues.value.add(value)
    })
  }

  // Register with gridApi for backend integration
  if (props.listBoxId) {
    gridApi.registerListBox(props.listBoxId, {
      clearSelection,
      getSelectedValues,
      selectValue
    })
  }
})

onBeforeUnmount(() => {
  if (props.listBoxId) {
    gridApi.unregisterListBox(props.listBoxId)
  }
})

// Filtered Items
const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items

  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item =>
    item.label.toLowerCase().includes(query)
  )
})

// Handle Item Click
function handleItemClick(item: ListBoxItem) {
  if (item.disabled) return

  if (props.config?.allowMultiple) {
    // Multi-select: toggle
    if (selectedValues.value.has(item.value)) {
      selectedValues.value.delete(item.value)
    } else {
      selectedValues.value.add(item.value)
    }
  } else {
    // Single-select
    if (selectedValues.value.has(item.value)) {
      // Deselect if deselectOnClick enabled
      if (props.config?.deselectOnClick !== false) {
        selectedValues.value.clear()
      }
    } else {
      selectedValues.value.clear()
      selectedValues.value.add(item.value)
    }
  }

  emitSelectionChange()
}

// API Methods
function clearSelection() {
  selectedValues.value.clear()
  emitSelectionChange()
}

function getSelectedValues(): string[] {
  return Array.from(selectedValues.value)
}

function selectValue(value: string) {
  const item = props.items.find(i => i.value === value)
  if (item && !item.disabled) {
    selectedValues.value.add(value)
    emitSelectionChange()
  }
}

function emitSelectionChange() {
  emit('selectionChange', Array.from(selectedValues.value))
}
```

### Dodatočné Funkcie & Computed Properties

#### mergedTheme (Computed)
```typescript
const mergedTheme = computed(() => {
  return {
    ...defaultListBoxTheme,
    itemColors: { ...defaultListBoxTheme.itemColors, ...(props.theme?.itemColors || {}) },
    containerColors: { ...defaultListBoxTheme.containerColors, ...(props.theme?.containerColors || {}) },
    checkboxColors: { ...defaultListBoxTheme.checkboxColors, ...(props.theme?.checkboxColors || {}) },
    scrollbarColors: { ...defaultListBoxTheme.scrollbarColors, ...(props.theme?.scrollbarColors || {}) }
  }
})
```
**Použitie:** Merge custom theme with default ListBox theme. Deep merges all color categories.

#### listboxStyle (Computed)
```typescript
const listboxStyle = computed(() => ({
  height: `${props.height}px`,
  width: `${props.width}px`,
  ...cssVariables.value
}))
```
**Použitie:** Computed style object combining height, width props and CSS variables from theme.

#### isSelected()
```typescript
function isSelected(value: string): boolean {
  return selectedValues.value.has(value)
}
```
**Použitie:** Check if a value is currently selected. O(1) lookup using Set.

#### handleReset()
```typescript
function handleReset() {
  selectedValues.value.clear()
  emit('selectionChange', [])
}
```
**Použitie:** Clear all selections and emit empty selection change event. Called by Reset button.

---

## 12. App.vue

### Prehľad

**Účel:** Demo aplikácia (zakomentovaná). Ukazuje použitie DataGrid a ListBox komponentov s praktickými príkladmi.

**Obsah:**
- **DataGrid demo** - konfigurácia columns, config, theme, validation rules
- **ListBox demo** - single/multi select príklady
- **API calls** - príklady načítania dát z backend
- **Event handlers** - ukážky spracovania grid events

**Poznámka:**
- **NIE JE SÚČASŤOU KNIŽNICE** - App.vue je iba development/testing súbor
- Zaznamovaný pre referenčné účely
- Používa sa lokálne počas vývoja pre testovanie nových features

### Veľkosť
- **Počet riadkov:** 115 (jednoduchá demo app)

---

**Koniec dokumentácie komponentov.**
