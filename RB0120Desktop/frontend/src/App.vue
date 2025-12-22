<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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

// ✅ RIEŠENIE #4: ListBox refs for GridAPI registration
const listbox1Ref = ref<InstanceType<typeof ListBox> | null>(null)
const listbox2Ref = ref<InstanceType<typeof ListBox> | null>(null)
const listbox3Ref = ref<InstanceType<typeof ListBox> | null>(null)
const listbox4Ref = ref<InstanceType<typeof ListBox> | null>(null)

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

// ✅ RIEŠENIE #1: ListBox items - načítané z backendu (nie hardcoded)
const listbox1Items = ref<ListBoxItem[]>([])
const listbox2Items = ref<ListBoxItem[]>([])
const listbox3Items = ref<ListBoxItem[]>([])
const listbox4Items = ref<ListBoxItem[]>([])

// ✅ RIEŠENIE #1: ListBox configs - načítané z backendu
const listbox1Config = ref<any>(null)
const listbox2Config = ref<any>(null)
const listbox3Config = ref<any>(null)
const listbox4Config = ref<any>(null)

// ✅ RIEŠENIE #2: Theme config - načítaný z backendu
const dataGridTheme = ref<any>(null)
const listBoxTheme = ref<any>(null)

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

    // 3. Validation rules - not required automatically
    // Backend will send validation rules to table if needed using AddValidationRulesAsync
    console.log('[DEBUG] Step 3: Validation rules - waiting for backend to send rules if needed')
    console.log('[DEBUG] Step 3 COMPLETE')

    // 4. ✅ RIEŠENIE #1: Load ListBox configs from backend
    console.log('[DEBUG] Step 4: Loading ListBox configs...')
    try {
      const [lb1, lb2, lb3, lb4] = await Promise.all([
        gridApi.getListBoxConfig('listbox-1'),
        gridApi.getListBoxConfig('listbox-2'),
        gridApi.getListBoxConfig('listbox-3'),
        gridApi.getListBoxConfig('listbox-4')
      ])

      if (lb1.success && lb1.data) {
        listbox1Items.value = lb1.data.items || []
        listbox1Config.value = lb1.data
        console.log('✅ Loaded ListBox 1 config:', lb1.data.items?.length || 0, 'items')
      }
      if (lb2.success && lb2.data) {
        listbox2Items.value = lb2.data.items || []
        listbox2Config.value = lb2.data
        console.log('✅ Loaded ListBox 2 config:', lb2.data.items?.length || 0, 'items')
      }
      if (lb3.success && lb3.data) {
        listbox3Items.value = lb3.data.items || []
        listbox3Config.value = lb3.data
        console.log('✅ Loaded ListBox 3 config:', lb3.data.items?.length || 0, 'items')
      }
      if (lb4.success && lb4.data) {
        listbox4Items.value = lb4.data.items || []
        listbox4Config.value = lb4.data
        console.log('✅ Loaded ListBox 4 config:', lb4.data.items?.length || 0, 'items')
      }
    } catch (lbError) {
      console.warn('⚠️ ListBox configs failed, using empty arrays:', lbError)
    }
    console.log('[DEBUG] Step 4 COMPLETE')

    // 5. ✅ RIEŠENIE #2: Load Theme config from backend
    console.log('[DEBUG] Step 5: Loading Theme config...')
    try {
      const themeResponse = await gridApi.getThemeConfig()
      if (themeResponse.success && themeResponse.data) {
        dataGridTheme.value = themeResponse.data.dataGrid
        listBoxTheme.value = themeResponse.data.listBox
        console.log('✅ Loaded Theme config')
      } else {
        console.warn('⚠️ Theme config failed, using default themes')
      }
    } catch (themeError) {
      console.warn('⚠️ Theme config failed, using default themes:', themeError)
    }
    console.log('[DEBUG] Step 5 COMPLETE')

    // 6. Set isLoading to false - tables will render
    console.log('[DEBUG] Step 6: Setting isLoading=false...')
    isLoading.value = false
    console.log('✅ Initialization complete')
    console.log('[DEBUG] Step 6 COMPLETE')

    // 7. ✅ RIEŠENIE #4: Register ListBoxes with GridAPI
    console.log('[DEBUG] Step 7: Registering ListBoxes with GridAPI...')
    // Wait for next tick to ensure components are mounted
    await new Promise(resolve => setTimeout(resolve, 100))

    if (listbox1Ref.value) {
      gridApi.registerListBox('listbox-1', listbox1Ref.value)
    }
    if (listbox2Ref.value) {
      gridApi.registerListBox('listbox-2', listbox2Ref.value)
    }
    if (listbox3Ref.value) {
      gridApi.registerListBox('listbox-3', listbox3Ref.value)
    }
    if (listbox4Ref.value) {
      gridApi.registerListBox('listbox-4', listbox4Ref.value)
    }
    console.log('✅ ListBoxes registered with GridAPI')
    console.log('[DEBUG] Step 7 COMPLETE')

    // 8. All tables will start empty - data will be loaded when user clicks button
    console.log('[DEBUG] Step 8: All tables initialized with empty data')
    console.log('✅ Initialization complete - tables ready for data loading')

    // ✅ KROK 9: Export table refs to window for backend access
    console.log('[DEBUG] Step 9: Exporting table refs to window.__tableRefs...')

    // @ts-ignore - global window extension
    window.__tableRefs = {
      table1: table1Ref,
      table2: table2Ref,
      table3: table3Ref,
      table4: table4Ref,
      table5: table5Ref
    }

    // ✅ Register grid components for validation rules
    // @ts-ignore - global window extension
    window.__grids = {}
    if (table1Ref.value) {
      // @ts-ignore
      window.__grids['table1'] = table1Ref.value
      console.log('[App] Registered table1 to window.__grids')
    }
    if (table2Ref.value) {
      // @ts-ignore
      window.__grids['table2'] = table2Ref.value
      console.log('[App] Registered table2 to window.__grids')
    }
    if (table3Ref.value) {
      // @ts-ignore
      window.__grids['table3'] = table3Ref.value
      console.log('[App] Registered table3 to window.__grids')
    }
    if (table4Ref.value) {
      // @ts-ignore
      window.__grids['table4'] = table4Ref.value
      console.log('[App] Registered table4 to window.__grids')
    }
    if (table5Ref.value) {
      // @ts-ignore
      window.__grids['table5'] = table5Ref.value
      console.log('[App] Registered table5 to window.__grids')
    }
    console.log('✅ Grid components registered for validation rules')

    // @ts-ignore - global window extension
    window.__tableAPI = {
      /**
       * Load data into specified table
       * Called from C# backend via ExecuteScriptAsync
       */
      loadData(tableId: string, data: any[]) {
        console.log(`[TableAPI] ✅ loadData CALLED - tableId: ${tableId}, rows: ${data.length}`)
        const tableRef = (window as any).__tableRefs[tableId]

        if (!tableRef || !tableRef.value) {
          console.error(`[TableAPI] ❌ Table ref not found: ${tableId}`)
          console.error(`[TableAPI] Available refs:`, Object.keys((window as any).__tableRefs || {}))
          return false
        }

        console.log(`[TableAPI] 📋 Calling store.loadRows() for ${tableId}`)
        tableRef.value.store.loadRows(data)
        console.log(`[TableAPI] ✅ Successfully loaded ${data.length} rows into ${tableId}`)
        return true
      },

      /**
       * Get data from specified table
       * Returns array of rows (NOT serialized - C# will call JSON.stringify)
       */
      getData(tableId: string) {
        console.log(`[TableAPI] Getting data from ${tableId}`)
        const tableRef = (window as any).__tableRefs[tableId]

        if (!tableRef || !tableRef.value) {
          console.error(`[TableAPI] Table ref not found: ${tableId}`)
          return []
        }

        // Convert rows Map to array of row objects
        const rows = tableRef.value.store.rows
        const result = rows.map((row: any) => {
          const rowData: any = {
            __rowId: row.rowId,
            __rowHeight: row.height
          }

          row.cells.forEach((cell: any) => {
            rowData[cell.columnName] = cell.value
          })

          return rowData
        })

        console.log(`[TableAPI] ✅ Returning ${result.length} rows from ${tableId}`)
        return result
      },

      /**
       * Update cell in specified table
       */
      updateCell(tableId: string, rowId: string, columnName: string, value: any) {
        console.log(`[TableAPI] Updating cell in ${tableId}: ${rowId}.${columnName} = ${value}`)
        const tableRef = (window as any).__tableRefs[tableId]

        if (!tableRef || !tableRef.value) {
          console.error(`[TableAPI] Table ref not found: ${tableId}`)
          return false
        }

        tableRef.value.store.updateCell(rowId, columnName, value)
        console.log(`[TableAPI] ✅ Updated cell in ${tableId}`)
        return true
      },

      /**
       * Delete row from specified table
       */
      deleteRow(tableId: string, rowId: string) {
        console.log(`[TableAPI] Deleting row from ${tableId}: ${rowId}`)
        const tableRef = (window as any).__tableRefs[tableId]

        if (!tableRef || !tableRef.value) {
          console.error(`[TableAPI] Table ref not found: ${tableId}`)
          return false
        }

        tableRef.value.store.deleteRow(rowId)
        console.log(`[TableAPI] ✅ Deleted row from ${tableId}`)
        return true
      },

      /**
       * Add validation rule to specified table
       */
      addValidationRule(tableId: string, rule: any) {
        console.log(`[TableAPI] Adding validation rule to ${tableId}:`, rule)
        const tableRef = (window as any).__tableRefs[tableId]

        if (!tableRef || !tableRef.value || !tableRef.value.validation) {
          console.error(`[TableAPI] Table ref or validation not found: ${tableId}`)
          return false
        }

        tableRef.value.validation.addValidationRule(rule)
        console.log(`[TableAPI] ✅ Added validation rule to ${tableId}`)
        return true
      }
    }

    console.log('✅ Table refs and API exported to window')

    // ✅ DEBUG: Verify window.__tableAPI and window.__tableRefs
    console.log('[DEBUG] window.__tableAPI:', {
      exists: !!window.__tableAPI,
      type: typeof window.__tableAPI,
      methods: window.__tableAPI ? Object.keys(window.__tableAPI) : []
    })
    console.log('[DEBUG] window.__tableRefs:', {
      exists: !!window.__tableRefs,
      type: typeof window.__tableRefs,
      tables: window.__tableRefs ? Object.keys(window.__tableRefs) : []
    })

    console.log('[DEBUG] Step 9 COMPLETE')
  } catch (error) {
    const errorDetail = error instanceof Error ? error.message : String(error)
    console.error(`❌ Fatal error in onMounted: ${errorDetail}`)
    errorMessage.value = `Failed to load: ${errorDetail}`
    isLoading.value = false
  }
})

// ✅ UNIVERZÁLNE volanie - načítanie sample dát do tabuľky 1
async function loadSampleDataToTable1() {
  try {
    console.log('📥 Loading sample data to table 1 via backend...')

    if (isLoading.value) {
      alert('⏳ Počkajte na dokončenie inicializácie')
      return
    }

    // ✅ Volá backend ktorý vnútri:
    // 1. Vygeneruje sample data (GenerateSampleData)
    // 2. Pošle do tabuľky (LoadDataToTableAsync)
    const response = await window.gridApi.LoadSampleDataToTable('table1', 1000)

    // ✅ FIX: Debug response
    console.log('📤 Raw response:', response)
    console.log('📤 Response type:', typeof response)

    // ✅ FIX: Check if response is valid
    if (!response) {
      console.error('❌ Response is null or undefined')
      alert('❌ Chyba: Backend nevrátil žiadnu odpoveď')
      return
    }

    // ✅ FIX: Parse response (may be string or already object)
    let result
    try {
      result = typeof response === 'string' ? JSON.parse(response) : response
    } catch (parseError) {
      console.error('❌ Failed to parse response:', parseError)
      console.error('❌ Response content:', response)
      alert(`❌ Chyba pri parsovaní odpovede: ${parseError}`)
      return
    }

    console.log('📊 Parsed result:', result)

    // ✅ DEBUG: Log debug info if available
    if (result?.debug) {
      console.log('🔍 Debug info:', result.debug)
    }

    if (result && result.success) {
      console.log(`✅ Backend loaded ${result.rowCount} rows into ${result.tableId}`)
      alert(`✅ Načítané ${result.rowCount} riadkov do Tabuľky 1`)
    } else {
      const errorMsg = result?.error || 'Neznáma chyba'
      console.error('❌ Backend failed to load data:', errorMsg)

      // ✅ Show detailed error with debug info
      if (result?.debug) {
        console.error('❌ Error details:', result.debug)
      }

      alert(`❌ Chyba: ${errorMsg}`)
    }
  } catch (error) {
    console.error('❌ EXCEPTION in loadSampleDataToTable1:', error)
    alert(`❌ Chyba: ${error}`)
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
  // ✅ LOG POINT #4: Add validation rules START
  console.log('═══════════════════════════════════════════════════')
  console.log('[App] ADD VALIDATION RULES - START')
  console.log(`  Table ready: ${!!table1Ref.value}`)
  console.log(`  Validation ready: ${!!table1Ref.value?.validation}`)
  console.log(`  Current ruleCount: ${(table1Ref.value?.validation as any)?.ruleCount?.value}`)
  console.log(`  Timestamp: ${new Date().toISOString()}`)
  console.log('═══════════════════════════════════════════════════')

  if (!table1Ref.value?.validation) {
    alert('❌ Tabuľka 1 nie je pripravená!')
    return
  }

  const { addValidationRule } = table1Ref.value.validation

  // Rule 1: Meno je povinné
  console.log('[App] Adding rule 1/3: name Required')
  addValidationRule({
    columnName: 'name',
    ruleType: 'Required',
    errorMessage: '❌ Meno je povinné pole!',
    severity: 'Error'
  })

  // Rule 2: Email - validný formát
  console.log('[App] Adding rule 2/3: email Regex')
  addValidationRule({
    columnName: 'email',
    ruleType: 'Regex',
    errorMessage: '❌ Email musí byť vo formáte: meno@domena.com',
    regexPattern: '^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$',
    severity: 'Error'
  })

  // Rule 3: Vek - rozsah 18-65
  console.log('[App] Adding rule 3/3: age Range')
  addValidationRule({
    columnName: 'age',
    ruleType: 'Range',
    errorMessage: '⚠️ Vek musí byť medzi 18 a 65',
    minValue: 18,
    maxValue: 65,
    severity: 'Warning'
  })

  // ✅ LOG POINT #4: Add validation rules COMPLETE
  console.log('═══════════════════════════════════════════════════')
  console.log('[App] ADD VALIDATION RULES - COMPLETE')
  console.log(`  New ruleCount: ${(table1Ref.value?.validation as any)?.ruleCount?.value}`)
  console.log(`  Timestamp: ${new Date().toISOString()}`)
  console.log('═══════════════════════════════════════════════════')

  alert('✅ Validation rules pridané pre Tabuľku 1!')
}

// ✅ RIEŠENIE #4: Unregister ListBoxes on unmount
onUnmounted(() => {
  console.log('[App] Unregistering ListBoxes from GridAPI...')
  gridApi.unregisterListBox('listbox-1')
  gridApi.unregisterListBox('listbox-2')
  gridApi.unregisterListBox('listbox-3')
  gridApi.unregisterListBox('listbox-4')
  console.log('[App] ✅ All ListBoxes unregistered')
})
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
        <button
          @click="loadSampleDataToTable1"
          :disabled="isLoading"
          :class="{ 'toolbar-button--disabled': isLoading }"
        >
          {{ isLoading ? '⏳ Načítava sa...' : '📥 Načítať Sample Dáta do Tabuľky 1' }}
        </button>
        <button @click="getTableData">📊 Zobraziť dáta z backendu</button>
        <button @click="addValidationRulesToTable1">✓ Pridať Validation Rules</button>
      </div>

      <div class="section">
        <h2>Tabuľka 1</h2>
        <SearchPanel grid-id="table1" />
        <FilterRow grid-id="table1" />
        <AdvancedTable
          ref="table1Ref"
          grid-id="table1"
          :columns="table1Columns"
          :config="table1Config"
          :theme="dataGridTheme"
          :minRows="10"
          height="600px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 2</h2>
        <SearchPanel grid-id="table2" />
        <AdvancedTable
          ref="table2Ref"
          grid-id="table2"
          :columns="table2Columns"
          :theme="dataGridTheme"
          :minRows="10"
          height="600px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 3</h2>
        <FilterRow grid-id="table3" />
        <AdvancedTable
          ref="table3Ref"
          grid-id="table3"
          :columns="table3Columns"
          :theme="dataGridTheme"
          :minRows="10"
          height="600px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 4</h2>
        <AdvancedTable
          ref="table4Ref"
          grid-id="table4"
          :columns="table4Columns"
          :theme="dataGridTheme"
          :minRows="10"
          height="600px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="section">
        <h2>Tabuľka 5</h2>
        <AdvancedTable
          ref="table5Ref"
          grid-id="table5"
          :columns="table5Columns"
          :theme="dataGridTheme"
          :minRows="10"
          height="600px"
          :showHiddenColumnsPanel="true"
        />
      </div>

      <div class="listboxes">
        <div class="listbox-item">
          <h3>{{ listbox1Config?.title || 'ListBox 1' }}</h3>
          <ListBox
            ref="listbox1Ref"
            :items="listbox1Items"
            :multi-select="listbox1Config?.multiSelect ?? false"
            :height="listbox1Config?.height ?? 200"
            :width="listbox1Config?.width ?? 250"
            :theme="listBoxTheme"
          />
        </div>

        <div class="listbox-item">
          <h3>{{ listbox2Config?.title || 'ListBox 2' }}</h3>
          <ListBox
            ref="listbox2Ref"
            :items="listbox2Items"
            :multi-select="listbox2Config?.multiSelect ?? true"
            :height="listbox2Config?.height ?? 200"
            :width="listbox2Config?.width ?? 250"
            :theme="listBoxTheme"
          />
        </div>

        <div class="listbox-item">
          <h3>{{ listbox3Config?.title || 'ListBox 3' }}</h3>
          <ListBox
            ref="listbox3Ref"
            :items="listbox3Items"
            :multi-select="listbox3Config?.multiSelect ?? false"
            :height="listbox3Config?.height ?? 200"
            :width="listbox3Config?.width ?? 250"
            :theme="listBoxTheme"
          />
        </div>

        <div class="listbox-item">
          <h3>{{ listbox4Config?.title || 'ListBox 4' }}</h3>
          <ListBox
            ref="listbox4Ref"
            :items="listbox4Items"
            :multi-select="listbox4Config?.multiSelect ?? true"
            :height="listbox4Config?.height ?? 200"
            :width="listbox4Config?.width ?? 250"
            :theme="listBoxTheme"
          />
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

.custom-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #6c757d !important;
}

.toolbar-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
