<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AdvancedTable, ListBox, gridApi, SearchPanel, FilterRow } from 'rpa-web-ui'
import type { GridColumn, ListBoxItem } from 'rpa-web-ui'

// DataGrid components create their own stores internally based on grid-id prop
// No need to create stores here!

// Table refs
const table1Ref = ref<InstanceType<typeof AdvancedTable> | null>(null)
const table2Ref = ref<InstanceType<typeof AdvancedTable> | null>(null)
const table3Ref = ref<InstanceType<typeof AdvancedTable> | null>(null)
const table4Ref = ref<InstanceType<typeof AdvancedTable> | null>(null)
const table5Ref = ref<InstanceType<typeof AdvancedTable> | null>(null)

// Stĺpce - samostatné pre každú tabuľku (aby neboli zdieľané)
const table1Columns = ref<GridColumn[]>([])
const table2Columns = ref<GridColumn[]>([])
const table3Columns = ref<GridColumn[]>([])
const table4Columns = ref<GridColumn[]>([])
const table5Columns = ref<GridColumn[]>([])

// Config - načítaný z backendu
const gridConfig = ref<any>(null)

// Loading state
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

// ListBox items
const listbox1Items = ref<ListBoxItem[]>([
  { value: '1', name: 'Možnosť 1' },
  { value: '2', name: 'Možnosť 2' },
  { value: '3', name: 'Možnosť 3' }
])

const listbox2Items = ref<ListBoxItem[]>([
  { value: 'a', name: 'Alpha' },
  { value: 'b', name: 'Beta' },
  { value: 'c', name: 'Gamma' }
])

const listbox3Items = ref<ListBoxItem[]>([
  { value: 'red', name: 'Červená' },
  { value: 'green', name: 'Zelená' },
  { value: 'blue', name: 'Modrá' }
])

const listbox4Items = ref<ListBoxItem[]>([
  { value: '10', name: 'Desať' },
  { value: '20', name: 'Dvadsať' },
  { value: '30', name: 'Tridsať' }
])

// Grid config pre tabuľku 1
const table1Config = ref({
  pageSize: 100,
  pageSizeOptions: [10, 25, 50, 100, 200],
  enableSort: true,
  enableFilter: true,           // Filter zapnutý
  enableSearch: true,
  enableValidation: true,
  autoValidate: true,
  showRowNumber: false,
  showCheckbox: true,            // Checkbox stĺpec zapnutý
  showValidationAlerts: true,
  showDeleteButton: true,        // Delete button zapnutý
  showInsertButton: true         // Insert button zapnutý
})

// Načítanie dát, stĺpcov, config a validation rules z backendu
onMounted(async () => {
  try {
    console.log('🚀 Loading data from backend...')

    // 1. Load columns
    console.log('[DEBUG] Step 1: Loading columns...')
    const columnsResponse = await gridApi.getColumns()
    console.log('[DEBUG] Columns response received, success:', columnsResponse.success)

    if (!columnsResponse.success) {
      throw new Error(`Columns failed: ${columnsResponse.error || 'Unknown'}`)
    }
    if (!columnsResponse.data || !Array.isArray(columnsResponse.data)) {
      throw new Error('Columns data is invalid or not an array')
    }

    // Deep copy pre každú tabuľku (aby neboli zdieľané)
    table1Columns.value = JSON.parse(JSON.stringify(columnsResponse.data))
    table2Columns.value = JSON.parse(JSON.stringify(columnsResponse.data))
    table3Columns.value = JSON.parse(JSON.stringify(columnsResponse.data))
    table4Columns.value = JSON.parse(JSON.stringify(columnsResponse.data))
    table5Columns.value = JSON.parse(JSON.stringify(columnsResponse.data))
    console.log(`✅ Loaded ${columnsResponse.data.length} columns for all 5 tables`)

    // 2. Load config
    console.log('[DEBUG] Step 2: Loading config...')
    let configResponse
    try {
      configResponse = await gridApi.getConfig()
      console.log('[DEBUG] Config response received, success:', configResponse.success)
    } catch (configError) {
      console.error('[DEBUG] Config call failed with error:', configError)
      throw configError
    }

    if (configResponse.success && configResponse.data) {
      gridConfig.value = configResponse.data
      console.log('✅ Loaded config')
    } else {
      console.warn('⚠️ Config failed, using defaults')
    }
    console.log('[DEBUG] Step 2 COMPLETE')

    // 3. Load validation rules
    console.log('[DEBUG] Step 3: Loading validation rules...')
    let rulesResponse
    try {
      rulesResponse = await gridApi.getValidationRules()
      console.log('[DEBUG] Rules response received, success:', rulesResponse.success)
    } catch (rulesError) {
      console.error('[DEBUG] Rules call failed with error:', rulesError)
      throw rulesError
    }

    if (rulesResponse.success && rulesResponse.data) {
      const rulesCount = Array.isArray(rulesResponse.data) ? rulesResponse.data.length : 0
      console.log(`✅ Loaded ${rulesCount} validation rules`)
    } else {
      console.warn('⚠️ Validation rules failed:', rulesResponse.error || 'No data')
    }
    console.log('[DEBUG] Step 3 COMPLETE')

    // 4. Set isLoading to false - tables will render
    console.log('[DEBUG] Step 4: Setting isLoading=false...')
    isLoading.value = false
    console.log('✅ Initialization complete')
    console.log('[DEBUG] Step 4 COMPLETE')

    // 5. All tables will start empty - data will be loaded when user clicks button
    console.log('[DEBUG] Step 5: All tables initialized with empty data')
    console.log('✅ Initialization complete - tables ready for data loading')
  } catch (error) {
    const errorDetail = error instanceof Error ? error.message : String(error)
    console.error(`❌ Fatal error in onMounted: ${errorDetail}`)
    errorMessage.value = `Failed to load: ${errorDetail}`
    isLoading.value = false
  }
})

// Funkcia na načítanie sample dát do backendu a zobrazenie v tabuľke 1
async function loadSampleDataToTable1() {
  try {
    console.log('📥 Loading sample data to backend...')

    // Check if window.gridApi is available
    if (!window.gridApi || typeof window.gridApi.LoadSampleData !== 'function') {
      console.error('❌ GridAPI not available!')
      alert('GridAPI not available (LoadSampleData method missing)')
      return
    }

    // 1. Call backend to generate and store sample data
    console.log('[loadSampleDataToTable1] Calling LoadSampleData(1000)...')
    const resultJson = await window.gridApi.LoadSampleData(1000)
    console.log('[loadSampleDataToTable1] LoadSampleData response received:', resultJson?.substring(0, 100))

    const result = JSON.parse(resultJson)
    console.log('[loadSampleDataToTable1] Parsed result:', {
      success: result.success,
      rowCount: result.rowCount,
      hasError: !!result.error
    })

    if (!result.success) {
      console.error('❌ LoadSampleData failed:', result.error)
      alert(`Failed to load sample data: ${result.error}`)
      return
    }

    console.log('✅ Sample data loaded to backend:', result.message)

    // 2. ✅ RIEŠENIE #4: Defensive checks before calling loadDataFromBackend
    if (!table1Ref.value) {
      console.error('❌ table1Ref is NULL!')
      console.error('table1Ref.value:', table1Ref.value)
      alert('Table 1 reference not available - component not mounted?')
      return
    }

    console.log('[loadSampleDataToTable1] table1Ref.value exists:', !!table1Ref.value)
    console.log('[loadSampleDataToTable1] Available keys on table1Ref.value:', Object.keys(table1Ref.value || {}))

    if (typeof table1Ref.value.loadDataFromBackend !== 'function') {
      console.error('❌ loadDataFromBackend() not found on table1Ref!')
      console.error('table1Ref.value type:', typeof table1Ref.value)
      console.error('Available methods:', Object.keys(table1Ref.value).filter(k => typeof table1Ref.value[k] === 'function'))
      alert('loadDataFromBackend method not exposed - rebuild issue?')
      return
    }

    console.log('✅ Calling table1Ref.value.loadDataFromBackend()...')
    await table1Ref.value.loadDataFromBackend()
    console.log('✅ loadDataFromBackend() completed successfully')
    console.log('✅ Table 1 refreshed with sample data')

    alert(`Loaded ${result.rowCount || 1000} sample rows into Table 1`)
  } catch (error) {
    console.error('❌ EXCEPTION in loadSampleDataToTable1:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    alert(`Error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Funkcia na načítanie dát z tabuľky do premennej
async function getTableData() {
  try {
    const response = await gridApi.getData()
    if (response.success && response.data) {
      console.log('📊 Table data:', response.data)
      alert(`Loaded ${response.rowCount || response.data.length} rows from backend`)
      return response.data
    }
    return []
  } catch (error) {
    console.error('Error getting table data:', error)
    return []
  }
}

// Funkcia na pridanie validation rules pre tabuľku 1
function addValidationRulesToTable1() {
  if (!table1Ref.value?.validation) {
    alert('❌ Tabuľka 1 nie je pripravená!')
    return
  }

  const { addValidationRule } = table1Ref.value.validation

  // Rule 1: Meno je povinné
  addValidationRule({
    columnName: 'name',
    ruleType: 'Required',
    errorMessage: '❌ Meno je povinné pole!',
    severity: 'Error'
  })

  // Rule 2: Email - validný formát
  addValidationRule({
    columnName: 'email',
    ruleType: 'Regex',
    errorMessage: '❌ Email musí byť vo formáte: meno@domena.com',
    regexPattern: '^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$',
    severity: 'Error'
  })

  // Rule 3: Vek - rozsah 18-65
  addValidationRule({
    columnName: 'age',
    ruleType: 'Range',
    errorMessage: '⚠️ Vek musí byť medzi 18 a 65',
    minValue: 18,
    maxValue: 65,
    severity: 'Warning'
  })

  alert('✅ Validation rules pridané pre Tabuľku 1!')
}
</script>

<template>
  <div class="app-container">
    <h1>RB0120 Desktop - Demo</h1>

    <div v-if="isLoading" class="loading">
      <p>⏳ Loading data from backend...</p>
    </div>

    <div v-else-if="errorMessage" class="error">
      <p>❌ Error: {{ errorMessage }}</p>
    </div>

    <template v-else>
      <!-- Custom toolbar -->
      <div class="custom-toolbar">
        <button @click="loadSampleDataToTable1">📥 Načítať Sample Dáta do Tabuľky 1</button>
        <button @click="getTableData">📊 Zobraziť dáta z backendu</button>
        <button @click="addValidationRulesToTable1">✓ Pridať Validation Rules</button>
      </div>

      <div class="section">
        <h2>Tabuľka 1</h2>
        <SearchPanel grid-id="table-1" />
        <FilterRow grid-id="table-1" />
        <AdvancedTable
          ref="table1Ref"
          grid-id="table-1"
          :columns="table1Columns"
          :config="table1Config"
          :minRows="10"
          height="300px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 2</h2>
        <SearchPanel grid-id="table-2" />
        <AdvancedTable
          ref="table2Ref"
          grid-id="table-2"
          :columns="table2Columns"
          :minRows="10"
          height="300px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 3</h2>
        <FilterRow grid-id="table-3" />
        <AdvancedTable
          ref="table3Ref"
          grid-id="table-3"
          :columns="table3Columns"
          :minRows="10"
          height="250px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 4</h2>
        <AdvancedTable
          ref="table4Ref"
          grid-id="table-4"
          :columns="table4Columns"
          :minRows="10"
          height="250px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 5</h2>
        <AdvancedTable
          ref="table5Ref"
          grid-id="table-5"
          :columns="table5Columns"
          :minRows="10"
          height="250px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="listboxes">
        <div class="listbox-item">
          <h3>ListBox 1</h3>
          <ListBox :items="listbox1Items" :multi-select="false" :height="200" :width="250" />
        </div>

        <div class="listbox-item">
          <h3>ListBox 2</h3>
          <ListBox :items="listbox2Items" :multi-select="true" :height="200" :width="250" />
        </div>

        <div class="listbox-item">
          <h3>ListBox 3</h3>
          <ListBox :items="listbox3Items" :multi-select="false" :height="200" :width="250" />
        </div>

        <div class="listbox-item">
          <h3>ListBox 4</h3>
          <ListBox :items="listbox4Items" :multi-select="true" :height="200" :width="250" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.custom-toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.custom-toolbar button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.custom-toolbar button:hover {
  background: #0056b3;
}

.section {
  margin-bottom: 30px;
}

.listboxes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.listbox-item h3 {
  margin-bottom: 10px;
}
</style>
