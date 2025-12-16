<template>
  <div id="app">
    <h1>RPA Advanced Data Grid - Demo</h1>

    <div class="toolbar">
      <button @click="loadSampleData">Load Sample Data</button>
      <button @click="addValidationRules">Add Validation Rules</button>
      <button @click="performValidation">Validate Required</button>
      <button @click="toggleAutoValidate">
        {{ gridConfig.autoValidate ? '✓ Auto Validate' : '✗ Manual Validate' }}
      </button>
      <button @click="exportData">Export Data</button>
      <button @click="toggleFeatures">Toggle Features</button>
    </div>

    <div class="grid-wrapper">
      <SearchPanel v-if="gridConfig.enableSearch" grid-id="main-grid" />
      <FilterRow v-if="gridConfig.enableFilter" grid-id="main-grid" />
      <DataGrid ref="mainGridRef" :config="gridConfig" :columns="mainGridColumns" grid-id="main-grid" :min-table-width="900" />
    </div>

    <div class="small-tables-section">
      <h2>Additional Tables</h2>
      <div class="small-tables-container">
        <div class="small-table-wrapper" v-for="(table, index) in smallTables" :key="index">
          <h3>{{ table.title }}</h3>
          <DataGrid :config="table.config" :columns="table.columns" :grid-id="`small-table-${index}`" :min-table-width="600" />
        </div>
      </div>
    </div>

    <div class="listbox-section">
      <h2>ListBox Examples</h2>
      <div class="listbox-container-group">
        <ListBox
          title="Countries (Single Select)"
          :items="countryItems"
          :multi-select="false"
          :pre-selected="['cz']"
          :height="200"
          :width="250"
          @selection-change="handleCountryChange"
        />

        <ListBox
          title="Programming Languages (Multi Select)"
          :items="languageItems"
          :multi-select="true"
          :pre-selected="['ts', 'csharp']"
          :height="200"
          :width="250"
          @selection-change="handleLanguageChange"
        />

        <ListBox
          title="Cities"
          :items="cityItems"
          :multi-select="false"
          :height="200"
          :width="250"
          @selection-change="handleCityChange"
        />

        <ListBox
          title="File Extensions (Multi Select)"
          :items="extensionItems"
          :multi-select="true"
          :pre-selected="['vue', 'ts']"
          :height="200"
          :width="250"
          @selection-change="handleExtensionChange"
        />

        <ListBox
          title="Database Systems"
          :items="databaseItems"
          :multi-select="true"
          :height="200"
          :width="250"
          @selection-change="handleDatabaseChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataGrid from './components/DataGrid.vue'
import SearchPanel from './components/SearchPanel.vue'
import FilterRow from './components/FilterRow.vue'
import ListBox, { type ListBoxItem } from './components/ListBox.vue'
import { useDataGridStore } from './stores/dataGridStore'

// Create a main store for the primary grid
const store = useDataGridStore('main-grid')

// Reference to main DataGrid to access its validation instance
const mainGridRef = ref<InstanceType<typeof DataGrid> | null>(null)

// Main grid columns configuration
const mainGridColumns = ref([
  {
    name: 'name',
    header: 'Name',
    width: 150,
    minWidth: 100,
    maxWidth: 300,
    isVisible: true,
    isReadOnly: false,
    isSortable: true,
    isFilterable: true
  },
  {
    name: 'email',
    header: 'Email',
    width: 200,
    minWidth: 150,
    maxWidth: 400,
    isVisible: true,
    isReadOnly: false,
    isSortable: true,
    isFilterable: true
  },
  {
    name: 'age',
    header: 'Age',
    width: 100,
    minWidth: 80,
    maxWidth: 150,
    isVisible: true,
    isReadOnly: false,
    isSortable: true,
    isFilterable: true
  },
  {
    name: 'city',
    header: 'City',
    width: 150,
    minWidth: 100,
    maxWidth: 300,
    isVisible: true,
    isReadOnly: false,
    isSortable: true,
    isFilterable: true
  }
])

const gridConfig = ref({
  pageSize: 100,  // Default hodnota (prvá v poli pageSizeOptions)
  pageSizeOptions: [100, 25, 50, 200, 500, 1000],  // Prvá hodnota = default, ale zobrazí sa zoradené
  enableSort: true,
  enableFilter: true,
  enableSearch: true,
  enableValidation: true,
  autoValidate: true,  // true = validate on every change, false = manual validation only
  showRowNumber: true,
  showCheckbox: true,
  showValidationAlerts: true,
  showDeleteButton: true,
  showInsertButton: true
})

// Small tables configuration
const smallTables = ref([
  {
    title: 'Table 1',
    config: {
      pageSize: 20,
      pageSizeOptions: [10, 20, 50],  // Menšie možnosti pre malú tabuľku
      enableSort: false,
      enableFilter: false,
      enableSearch: false,
      enableValidation: false,
      showRowNumber: false,
      showCheckbox: false,
      showValidationAlerts: false,
      showDeleteButton: true,
      showInsertButton: true
    },
    columns: [
      { name: 'col1', header: 'Column 1', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'col2', header: 'Column 2', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'col3', header: 'Column 3', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'col4', header: 'Column 4', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false }
    ]
  },
  {
    title: 'Table 2',
    config: {
      pageSize: 20,
      pageSizeOptions: [5, 10, 25, 50, 100],  // Iné možnosti pre Table 2
      enableSort: false,
      enableFilter: false,
      enableSearch: false,
      enableValidation: false,
      showRowNumber: false,
      showCheckbox: false,
      showValidationAlerts: false,
      showDeleteButton: true,
      showInsertButton: true
    },
    columns: [
      { name: 'data1', header: 'Data 1', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'data2', header: 'Data 2', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'data3', header: 'Data 3', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'data4', header: 'Data 4', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false }
    ]
  },
  {
    title: 'Table 3',
    config: {
      pageSize: 20,
      pageSizeOptions: [15, 30, 60],  // Iné možnosti pre Table 3
      enableSort: false,
      enableFilter: false,
      enableSearch: false,
      enableValidation: false,
      showRowNumber: false,
      showCheckbox: false,
      showValidationAlerts: false,
      showDeleteButton: true,
      showInsertButton: true
    },
    columns: [
      { name: 'field1', header: 'Field 1', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'field2', header: 'Field 2', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'field3', header: 'Field 3', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'field4', header: 'Field 4', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false }
    ]
  },
  {
    title: 'Table 4',
    config: {
      pageSize: 20,
      pageSizeOptions: [10, 20, 30, 40, 50],  // Vlastné možnosti pre Table 4
      enableSort: false,
      enableFilter: false,
      enableSearch: false,
      enableValidation: false,
      showRowNumber: false,
      showCheckbox: false,
      showValidationAlerts: false,
      showDeleteButton: true,
      showInsertButton: true
    },
    columns: [
      { name: 'item1', header: 'Item 1', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'item2', header: 'Item 2', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'item3', header: 'Item 3', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false },
      { name: 'item4', header: 'Item 4', width: 120, minWidth: 80, maxWidth: 200, isVisible: true, isReadOnly: false, isSortable: false, isFilterable: false }
    ]
  }
])

// Note: Column initialization is now handled automatically via :columns prop on DataGrid component

function loadSampleData() {
  const sampleData = Array.from({ length: 1000 }, (_, i) => {
    // Add some invalid data for testing validation
    let name = `User ${i + 1}`
    let email = `user${i + 1}@example.com`
    let age = 20 + (i % 50)
    let city = ['Prague', 'Bratislava', 'Vienna', 'Budapest'][i % 4]

    // Every 10th row - empty name (Required validation error)
    if (i % 10 === 0) {
      name = ''
    }

    // Every 15th row - invalid email (Regex validation error)
    if (i % 15 === 0) {
      email = `invalid-email-${i}`
    }

    // Every 20th row - age out of range (Range validation warning)
    if (i % 20 === 0) {
      age = i % 2 === 0 ? 15 : 70  // Too young or too old
    }

    // Every 25th row - invalid city (Regex validation warning)
    if (i % 25 === 0) {
      city = 'Praha'  // Czech name instead of English
    }

    return {
      __rowId: `row-${i}`,
      __rowHeight: 25,
      name,
      email,
      age,
      city
    }
  })

  store.loadRows(sampleData)
  console.log('✅ Sample data loaded with intentional validation errors for testing')

  // Auto-validate if validation rules exist
  if (mainGridRef.value?.validation) {
    const { validateAll } = mainGridRef.value.validation
    setTimeout(async () => {
      await validateAll(store.rows)
      console.log('✅ Auto-validation completed after loading data')
    }, 100)
  }
}

function addValidationRules() {
  if (!mainGridRef.value?.validation) {
    alert('❌ Main grid not ready yet!')
    return
  }

  const { addValidationRule } = mainGridRef.value.validation

  // Rule 1: Email - must be valid email format
  addValidationRule({
    columnName: 'email',
    ruleType: 'Regex',
    errorMessage: '❌ Email musí byť vo formáte: meno@domena.com',
    regexPattern: '^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$',
    severity: 'Error'
  })

  // Rule 2: Age - must be between 18 and 65
  addValidationRule({
    columnName: 'age',
    ruleType: 'Range',
    errorMessage: '⚠️ Vek musí byť medzi 18 a 65 rokov',
    minValue: 18,
    maxValue: 65,
    severity: 'Warning'
  })

  // Rule 3: Name - required, cannot be empty
  addValidationRule({
    columnName: 'name',
    ruleType: 'Required',
    errorMessage: '❌ Meno je povinné pole!',
    severity: 'Error'
  })

  // Rule 4: City - must be one of allowed cities
  addValidationRule({
    columnName: 'city',
    ruleType: 'Regex',
    errorMessage: '⚠️ Mesto musí byť jedno z: Prague, Bratislava, Vienna, Budapest',
    regexPattern: '^(Prague|Bratislava|Vienna|Budapest)$',
    severity: 'Warning'
  })

  // Display validation rules info
  const rulesInfo = `
═══════════════════════════════════════════════════
   VALIDAČNÉ PRAVIDLÁ PRE HLAVNÚ TABUĽKU
═══════════════════════════════════════════════════

📋 STĹPEC: name
   Pravidlo: Required (povinné)
   Správanie: Pole nesmie byť prázdne
   Chyba: ❌ Meno je povinné pole!
   Severity: Error (červená)

📧 STĹPEC: email
   Pravidlo: Regex (formát)
   Správanie: Musí byť platný email (xxx@xxx.xxx)
   Chyba: ❌ Email musí byť vo formáte: meno@domena.com
   Severity: Error (červená)
   Príklady:
   ✓ user1@example.com (OK)
   ✗ user1example.com (CHYBA)
   ✗ @example.com (CHYBA)

🎂 STĹPEC: age
   Pravidlo: Range (rozsah)
   Správanie: Hodnota musí byť medzi 18-65
   Chyba: ⚠️ Vek musí byť medzi 18 a 65 rokov
   Severity: Warning (oranžová)
   Príklady:
   ✓ 25 (OK)
   ✗ 17 (CHYBA - príliš mladý)
   ✗ 70 (CHYBA - príliš starý)

🏙️ STĹPEC: city
   Pravidlo: Regex (zoznam povolených hodnôt)
   Správanie: Musí byť jedno z povolených miest
   Chyba: ⚠️ Mesto musí byť jedno z: Prague, Bratislava, Vienna, Budapest
   Severity: Warning (oranžová)
   Príklady:
   ✓ Prague (OK)
   ✓ Bratislava (OK)
   ✗ Berlin (CHYBA)
   ✗ Praha (CHYBA - musí byť anglicky)

═══════════════════════════════════════════════════
  AKO TESTOVAŤ:
═══════════════════════════════════════════════════
1. Klikni na "Load Sample Data" pre načítanie dát
2. Klikni na "Add Validation Rules" (toto tlačidlo)
3. Klikni na "Validate All" pre spustenie validácie
4. Alebo edituj jednotlivé bunky - validuje sa pri písaní
5. Červené bunky = Error, Oranžové = Warning
6. Hover nad bunkou zobrazí chybovú správu

═══════════════════════════════════════════════════
  `

  console.log(rulesInfo)
  alert('✅ Validačné pravidlá boli pridané!\n\nOtvor konzolu (F12) pre detailný prehľad pravidiel.')
}

async function performValidation() {
  if (!mainGridRef.value?.validation) {
    alert('❌ Main grid not ready yet!')
    return
  }

  const { validateRequired, isAllValid } = mainGridRef.value.validation

  // Validate only cells that need validation (changed or unvalidated)
  const isValid = await validateRequired()

  const status = isValid ? '✅ All valid!' : '❌ Has errors'
  alert(`Validation completed!\nStatus: ${status}\n\nOptimized: Only validated changed/unvalidated cells`)
}

function toggleAutoValidate() {
  gridConfig.value.autoValidate = !gridConfig.value.autoValidate
  const mode = gridConfig.value.autoValidate ? 'AUTO' : 'MANUAL'
  console.log(`Validation mode: ${mode}`)
  alert(`Validation mode switched to: ${mode}\n\n` +
    (gridConfig.value.autoValidate
      ? '✓ Cells will validate automatically on every change'
      : '✗ Cells will only validate when you click "Validate Required"'))
}

function exportData() {
  console.log('Export data:', store.rows)
  alert(`Exporting ${store.rows.length} rows...`)
}

function toggleFeatures() {
  gridConfig.value = {
    ...gridConfig.value,
    showRowNumber: !gridConfig.value.showRowNumber,
    showCheckbox: !gridConfig.value.showCheckbox,
    showValidationAlerts: !gridConfig.value.showValidationAlerts,
    showDeleteButton: !gridConfig.value.showDeleteButton,
    showInsertButton: !gridConfig.value.showInsertButton
  }
}

// ListBox data
const countryItems = ref<ListBoxItem[]>([
  { name: 'Czech Republic', value: 'cz' },
  { name: 'Slovakia', value: 'sk' },
  { name: 'Austria', value: 'at' },
  { name: 'Hungary', value: 'hu' },
  { name: 'Poland', value: 'pl' },
  { name: 'Germany', value: 'de' }
])

const languageItems = ref<ListBoxItem[]>([
  { name: 'TypeScript', value: 'ts' },
  { name: 'C#', value: 'csharp' },
  { name: 'JavaScript', value: 'js' },
  { name: 'Python', value: 'python' },
  { name: 'Java', value: 'java' },
  { name: 'Go', value: 'go' },
  { name: 'Rust', value: 'rust' }
])

const cityItems = ref<ListBoxItem[]>([
  { name: 'Prague', value: 'prague' },
  { name: 'Bratislava', value: 'bratislava' },
  { name: 'Vienna', value: 'vienna' },
  { name: 'Budapest', value: 'budapest' },
  { name: 'Warsaw', value: 'warsaw' },
  { name: 'Berlin', value: 'berlin' }
])

const extensionItems = ref<ListBoxItem[]>([
  { name: '.vue (Vue Component)', value: 'vue' },
  { name: '.ts (TypeScript)', value: 'ts' },
  { name: '.cs (C# Source)', value: 'cs' },
  { name: '.xaml (XAML Markup)', value: 'xaml' },
  { name: '.json (JSON Data)', value: 'json' },
  { name: '.xml (XML Data)', value: 'xml' }
])

const databaseItems = ref<ListBoxItem[]>([
  { name: 'PostgreSQL', value: 'postgres' },
  { name: 'MySQL', value: 'mysql' },
  { name: 'SQL Server', value: 'sqlserver' },
  { name: 'SQLite', value: 'sqlite' },
  { name: 'MongoDB', value: 'mongodb' },
  { name: 'Redis', value: 'redis' }
])

// ListBox event handlers
function handleCountryChange(selectedValues: string[]) {
  console.log('Selected countries:', selectedValues)
}

function handleLanguageChange(selectedValues: string[]) {
  console.log('Selected languages:', selectedValues)
}

function handleCityChange(selectedValues: string[]) {
  console.log('Selected cities:', selectedValues)
}

function handleExtensionChange(selectedValues: string[]) {
  console.log('Selected extensions:', selectedValues)
}

function handleDatabaseChange(selectedValues: string[]) {
  console.log('Selected databases:', selectedValues)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.grid-wrapper {
  min-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

button {
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1976d2;
}

button:active {
  background-color: #1565c0;
}

.small-tables-section {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.small-tables-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.small-tables-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.small-table-wrapper {
  flex: 0 0 calc(50% - 10px);
  min-width: 0;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
}

.small-table-wrapper h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.listbox-section {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.listbox-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.listbox-container-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
