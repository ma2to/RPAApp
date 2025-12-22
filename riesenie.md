IDENTIFIKÁCIA PROBLÉMOV - Náhodné ukončenia a zamrznutia

  Našiel som KRITICKÉ PROBLÉMY ktoré spôsobujú crash a freeze aplikácie.

  ---
  PROBLÉM #1: CHÝBAJÚCA METÓDA GetValidationRules() (KRITICKÝ - CRASH!)

  Dôkaz v log súbore (line 65-67):
  [ERR] [Frontend ERROR] Grid API call failed:
  [Frontend LOG] [DEBUG] Rules response received, success: false
  [WRN] [Frontend WARNING] ⚠️ Validation rules failed: o[e] is not a function

  Root Cause:
  - Frontend volá gridApi.getValidationRules() (App.vue:116)
  - Backend C# NEMÁ túto metódu! (GridApi.cs:203-205)

  // GridApi.cs line 203-205
  // ===== REMOVED: Validation and column methods =====
  // - GetValidationRules() → Managed in frontend store  ← ❌ PROBLÉM!

  Frontend TypeScript (gridApi.ts:189-193):
  async getValidationRules(): Promise<ApiResponse<ValidationRule[]>> {
    if (!this.isHostMode) {
      return { success: false, error: 'Grid API not available' }
    }
    return this.callHostApi<ValidationRule[]>('GetValidationRules')  // ❌ Volá neexistujúcu metódu!
  }

  Čo sa stane:
  1. Frontend zavolá window.gridApi.GetValidationRules()
  2. C# GridApi NEMÁ túto metódu
  3. JavaScript error: o[e] is not a function (minified)
  4. Uncaught exception môže crashnúť WebView2 proces
  5. Aplikácia sa náhle ukončí

  Impact:
  - ❌ VYSOKÝ - Aplikácia crashne pri každom štarte ak je enableValidation=true
  - Error handling v App.vue:118-121 zachytí error, ale už môže byť neskoro
  - WebView2 proces môže byť v nestabilnom stave

  📋 DETAILNÉ INFO: Ako fungujú Validation Rules v aplikácii

  Dva spôsoby ako pridať validation rules:

  SPÔSOB #1: Automatické načítanie pri štarte (BROKEN)
  // App.vue:112-129
  onMounted(async () => {
    // ...
    // 3. Load validation rules
    const rulesResponse = await gridApi.getValidationRules()  // ❌ Volá GetValidationRules() ktorá neexistuje!
    // Toto ZLYHÁ lebo C# GridApi nemá túto metódu
  })

  SPÔSOB #2: Manuálne tlačidlo "✓ Pridať Validation Rules" (FUNGUJE)
  // App.vue:433-470
  function addValidationRulesToTable1() {
    if (!table1Ref.value?.validation) {
      alert('❌ Tabuľka 1 nie je pripravená!')
      return
    }

    // ✅ Pridáva pravidlá PRIAMO do Vue componenta (nie cez backend!)
    table1Ref.value.validation.addValidationRule({
      columnName: 'Name',
      ruleType: 'Required',
      errorMessage: 'Name je povinné pole',
      severity: 'Error'
    })

    table1Ref.value.validation.addValidationRule({
      columnName: 'Email',
      ruleType: 'Regex',
      regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
      errorMessage: 'Email musí byť platný',
      severity: 'Error'
    })

    table1Ref.value.validation.addValidationRule({
      columnName: 'Age',
      ruleType: 'Range',
      minValue: 18,
      maxValue: 65,
      severity: 'Warning'
    })

    alert('✅ Validation rules pridané pre Tabuľku 1!')
  }

  Ako to funguje:
  <!-- App.vue:506 -->
  <button @click="addValidationRulesToTable1">✓ Pridať Validation Rules</button>

  Architektonický detail:

  1. Vue Component Ref:
  const table1Ref = ref<InstanceType<typeof DataGrid> | null>(null)
  2. DataGrid.vue exposes validation API:
  // DataGrid.vue:147-172
  defineExpose({
    loadDataFromBackend,
    validation: {
      validateRequired,
      isAllValid,
      validateAll,
      validationRules,
      validationErrors,
      errorCount,
      ruleCount,
      addValidationRule,  // ← Toto sa volá z tlačidla
      validateCell,
      // ...
    },
    // ...
  })
  3. useValidation composable (rpa-web-ui):
  // rpa-web-ui/src/composables/useValidation.ts
  export function useValidation() {
    const validationRules = ref<Map<string, ValidationRule[]>>(new Map())

    function addValidationRule(rule: ValidationRule) {
      const columnRules = validationRules.value.get(rule.columnName) || []
      columnRules.push(rule)
      validationRules.value.set(rule.columnName, columnRules)
    }

    return {
      validationRules,
      addValidationRule,
      // ...
    }
  }

  ODPOVEDE NA TVOJE OTÁZKY:

  Q1: "to je co ? to nie su validacne pravidla z backend ?"
  - A: NIE, validačné pravidlá z tlačidla NIE SÚ z backendu!
  - Sú hardcoded v App.vue (line 433-470)
  - Pridávajú sa priamo do Vue component state (frontend store)
  - Backend vôbec nevie o týchto pravidlách

  Q2: "ako ich zasielam do tabulky ?"
  - A: Cez Vue component ref:
  table1Ref.value?.validation.addValidationRule({
    columnName: 'Name',
    ruleType: 'Required',
    // ...
  })
  - table1Ref je referencia na <DataGrid ref="table1Ref" /> komponent
  - .validation je exposed API z DataGrid komponenta
  - .addValidationRule() pridá pravidlo do frontend Pinia store

  Q3: "Čo je potom gridApi.getValidationRules() čo zlyhalo?"
  - A: To bol pokus načítať pravidlá Z BACKENDU pri štarte
  - Koncept bol:
    a. Backend má nejaké predefinované pravidlá v JSON súbore
    b. Frontend ich načíta pri štarte automaticky
    c. Pravidlá sa aplikujú na tabuľky
  - ALE metóda GetValidationRules() bola ODSTRÁNENÁ z C# backendu
  - Komentár hovorí: "Managed in frontend store" - teda pravidlá sa majú spravovať len vo frontende
  - PROBLÉM: Frontend kód stále volá túto metódu → crash!

  AKTUÁLNY STAV ARCHITEKTÚRY:

  ┌─────────────────────────────────────────────────────────────┐
  │ VALIDATION RULES - DVA ODDELENÉ SYSTÉMY                    │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │ SYSTÉM #1: Backend API (NEEXISTUJE - REMOVED!)            │
  │ ┌─────────────────────────────────────────────────────┐   │
  │ │ C# GridApi.GetValidationRules()  ← ❌ DELETED       │   │
  │ │   ↓                                                  │   │
  │ │ Frontend App.vue volá pri štarte ← ❌ CRASHNE!      │   │
  │ └─────────────────────────────────────────────────────┘   │
  │                                                             │
  │ SYSTÉM #2: Frontend Manual (FUNGUJE)                      │
  │ ┌─────────────────────────────────────────────────────┐   │
  │ │ User klikne "✓ Pridať Validation Rules"            │   │
  │ │   ↓                                                  │   │
  │ │ addValidationRulesToTable1()                        │   │
  │ │   ↓                                                  │   │
  │ │ table1Ref.value.validation.addValidationRule(...)   │   │
  │ │   ↓                                                  │   │
  │ │ useValidation() composable → Pinia store           │   │
  │ │   ↓                                                  │   │
  │ │ ✅ Pravidlá fungujú v tabuľke                      │   │
  │ └─────────────────────────────────────────────────────┘   │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘

  DÔLEŽITÉ ZISTENIE:
  - NIE JE žiadny backend systém pre validation rules v produkcii
  - Jediný spôsob je manuálne tlačidlo ktoré pridá hardcoded pravidlá
  - GetValidationRules() bol zrejme plánovaný feature, ale nedokončený
  - Kód bol odstránený z backendu, ale volanie zostalo vo frontende → CRASH

  ---
  PROBLÉM #2: WHILE LOOP BEZ ESCAPEHATCH (FREEZE!)

  Lokácia: DataGrid.vue:994-998

  // Wait for previous validation to finish (max 5 seconds)
  const startWait = Date.now()
  while (isValidating.value && Date.now() - startWait < 5000) {
    await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 100))
  }

  if (isValidating.value) {
    console.error('[validateRequired] ❌ Validation still running after 5s timeout')
    return false
  }

  Problém:
  - Ak isValidating.value sa nikdy nezmení na false, loop beží 5 sekúnd
  - Počas týchto 5 sekúnd UI je ZAMRZNUTÉ (synchronous while loop)
  - Aj s await setTimeout, Vue reactivity môže zlyhať ak je validácia deadlocked

  Scenár:
  1. isValidating sa nastaví na true
  2. Validácia zlyháva (exception, chýbajúca metóda, atď.)
  3. isValidating zostáva true navždy
  4. Ďalšia validácia sa pokúsi zavolať → zasekne sa v while loope 5 sekúnd
  5. Aplikácia zamrzne

  Impact:
  - ❌ VYSOKÝ - UI freeze na 5 sekúnd
  - Opakované pokusy vedú k opakovaným freezom
  - Používateľ to vníma ako "aplikácia zamrzla"

  ---
  PROBLÉM #3: CHÝBAJÚCE ERROR HANDLING PRE WebView2 ProcessFailed

  Lokácia: MainWindow.xaml.cs:766-792

  private void CoreWebView2_ProcessFailed(object sender, CoreWebView2ProcessFailedEventArgs e)
  {
      _fileLogger.Error("[WebView2 PROCESS FAILED]");
      _fileLogger.Error($"Process Kind: {e.ProcessFailedKind}");
      _fileLogger.Error($"Reason: {e.Reason}");

      // Try to show error to user if possible
      try {
          this.DispatcherQueue?.TryEnqueue(() => {
              Log($"[ProcessFailed] WebView2 process crashed - attempting recovery");
              // Optionally: Show error dialog or attempt reload  ← ❌ NIČ SA NEDEJE!
          });
      }
  }

  Problém:
  - Event handler LEN LOGUJE error
  - NEREŠTARTUJE WebView2
  - NEZOBRAZUJE user-friendly error dialog
  - Aplikácia zostáva v "zombie" state - okno otvorené, ale nefunkčné

  Dôsledok:
  - Používateľ vidí prázdne okno alebo zamrznuté UI
  - Myslí si že aplikácia crashla, ale proces ešte beží
  - Musí manuálne zatvoriť aplikáciu (Task Manager)

  ---
  PROBLÉM #4: DIAGNOSTIC LOGS SA NEZAPÍŠU PRI CRASH

  Aktuálny log (rpa-advanced-table20251221.log):
  - Končí na line 165 - náhle ukončenie
  - ŽIADNY ProcessFailed event
  - ŽIADNY UnhandledException event
  - ŽIADNY shutdown log

  Problém:
  - Ak WebView2 crashne rýchlo, logy sa nestihli zapísať (buffer flush)
  - Serilog file logger má buffer - pri crash sa stratí
  - Nemáme informácie o tom čo spôsobilo crash

  Impact:
  - Debugging je extrémne náročný
  - Nevieme rekonštruovať sequence of events pri crash

  ---
  PROBLÉM #5: UNHANDLED PROMISE REJECTIONS

  Lokácia: App.vue:114-121

  // 3. Load validation rules
  console.log('[DEBUG] Step 3: Loading validation rules...')
  let rulesResponse
  try {
    rulesResponse = await gridApi.getValidationRules()  // ❌ Môže failnúť
    console.log('[DEBUG] Rules response received, success:', rulesResponse.success)
  } catch (rulesError) {
    console.error('[DEBUG] Rules call failed with error:', rulesError)
    throw rulesError  // ❌ THROW - ak nie je catch vyššie, UNHANDLED REJECTION!
  }

  Problém:
  - Ak getValidationRules() zlyháva, throw rulesError
  - Ak onMounted nemá try-catch (neviem či má), → Unhandled Promise Rejection
  - V production Vue app, unhandled rejection môže crashnúť celý komponent tree

  ---
  NAVRHOVANÉ RIEŠENIA

  RIEŠENIE #1: Implementovať SetTableValidationRules() - Jediná všeobecná metóda (PRIORITA 1)

  DÔLEŽITÉ ZISTENIE:
  - Pôvodná GetValidationRules() nemá tableId parameter → nevie pre ktorú tabuľku sú pravidlá
  - Ak je to len testovacie metóda (pre development) → OK, nech vracia všetky pravidlá z JSON
  - Ak je to produkčná metóda → musí mať tableId ako argument

  NÁVRH RIEŠENIA:
  Namiesto dvoch rôznych metód (GetValidationRules a SetTableValidationRules), vytvoríme JEDNU všeobecnú metódu ktorá:
  - Prijíma tableId (povinné) - vie pre ktorú tabuľku
  - Prijíma rules[] (povinné) - pravidlá ako ARGUMENT, nie hardcoded
  - NEgeneruje pravidlá vnútri metódy
  - Aplikuje pravidlá na danú tabuľku

  ---
  IMPLEMENTÁCIA: Všeobecná metóda SetTableValidationRules()

  GridApi.cs - Pridať metódu:
  /// <summary>
  /// ✅ VŠEOBECNÁ METÓDA: Set validation rules for a specific table
  /// Prijíma tableId + rules ako ARGUMENTY (NIE hardcoded!)
  /// </summary>
  /// <param name="jsonParams">JSON with { tableId: string, rules: ValidationRule[] }</param>
  public string SetTableValidationRules(string jsonParams)
  {
      try
      {
          _logger?.LogInformation("[GridApi] SetTableValidationRules called");
          _logger?.LogDebug($"[GridApi] SetTableValidationRules params: {jsonParams}");

          // Parse input
          var input = JsonSerializer.Deserialize<SetTableValidationRulesInput>(jsonParams);

          if (input == null || string.IsNullOrEmpty(input.TableId))
          {
              return JsonSerializer.Serialize(new
              {
                  success = false,
                  error = "Invalid input: tableId is required"
              });
          }

          if (input.Rules == null || input.Rules.Count == 0)
          {
              _logger?.LogWarning($"[GridApi] No validation rules provided for table: {input.TableId}");
              return JsonSerializer.Serialize(new
              {
                  success = false,
                  error = "No validation rules provided"
              });
          }

          _logger?.LogInformation($"[GridApi] Setting {input.Rules.Count} validation rules for table: {input.TableId}");

          // ✅ KĽÚČOVÉ: Táto metóda NIE generuje pravidlá!
          // Pravidlá prichádzajú ako ARGUMENT z frontendu alebo z iného zdroja

          // Validácia pravidiel (optional)
          foreach (var rule in input.Rules)
          {
              if (string.IsNullOrEmpty(rule.ColumnName))
              {
                  return JsonSerializer.Serialize(new
                  {
                      success = false,
                      error = "Invalid rule: ColumnName is required"
                  });
              }

              if (string.IsNullOrEmpty(rule.RuleType))
              {
                  return JsonSerializer.Serialize(new
                  {
                      success = false,
                      error = $"Invalid rule for column '{rule.ColumnName}': RuleType is required"
                  });
              }
          }

          // Tu môžeš pridať ďalšiu logiku:
          // - Uložiť pravidlá do databázy
          // - Zaslať notifikáciu iným komponentom
          // - Validovať pravidlá podľa business rules
          // - atď.

          _logger?.LogInformation($"[GridApi] Validation rules successfully set for table '{input.TableId}'");

          // Vráť potvrdenie s detailami
          return JsonSerializer.Serialize(new
          {
              success = true,
              data = new
              {
                  tableId = input.TableId,
                  rulesCount = input.Rules.Count,
                  message = $"Successfully set {input.Rules.Count} validation rules for table '{input.TableId}'"
              }
          });
      }
      catch (Exception ex)
      {
          _logger?.LogError(ex, "[GridApi] SetTableValidationRules failed");
          return JsonSerializer.Serialize(new
          {
              success = false,
              error = ex.Message
          });
      }
  }

  // ===== Input model =====
  public class SetTableValidationRulesInput
  {
      public string TableId { get; set; } = "";
      public List<ValidationRule> Rules { get; set; } = new();
  }

  public class ValidationRule
  {
      public string ColumnName { get; set; } = "";
      public string RuleType { get; set; } = "";  // "Required", "Regex", "Range", "Custom"
      public string ErrorMessage { get; set; } = "";
      public string? RegexPattern { get; set; }
      public object? MinValue { get; set; }
      public object? MaxValue { get; set; }
      public string Severity { get; set; } = "Error";  // "Info", "Warning", "Error", "Critical"
  }

  ---
  VOLITEĽNE: Pomocná metóda pre načítanie pravidiel z JSON (len pre testovacie účely)

  Ak chceš mať možnosť načítať predpripravené pravidlá z JSON súboru:

  GridApi.cs - Pridať pomocnú metódu:
  /// <summary>
  /// ✅ POMOCNÁ METÓDA (TESTOVACIE): Get pre-configured validation rules from JSON
  /// Toto je len pre development/testing - v produkcii sa pravidlá zadávajú cez SetTableValidationRules()
  /// </summary>
  /// <param name="jsonParams">JSON with { tableId?: string } (optional - if not provided, returns all rules)</param>
  public string GetValidationRulesTemplate(string jsonParams = "{}")
  {
      try
      {
          _logger?.LogInformation("[GridApi] GetValidationRulesTemplate called (development only)");

          var configPath = Path.Combine(AppContext.BaseDirectory, "config", "validation-rules.json");
          _logger?.LogInformation($"[GridApi] Loading validation rules template from: {configPath}");

          if (!File.Exists(configPath))
          {
              _logger?.LogWarning($"[GridApi] Validation rules template file not found: {configPath}");
              return JsonSerializer.Serialize(new
              {
                  success = true,
                  data = new object[] { },  // Empty if file doesn't exist
                  message = "No validation rules template found"
              });
          }

          var json = File.ReadAllText(configPath);
          var rulesConfig = JsonSerializer.Deserialize<ValidationRulesConfig>(json);

          _logger?.LogInformation($"[GridApi] Loaded {rulesConfig?.Rules?.Count ?? 0} validation rules from template");

          // Optional: Filter by tableId if provided
          var input = JsonSerializer.Deserialize<GetValidationRulesInput>(jsonParams);
          List<ValidationRule> filteredRules = rulesConfig?.Rules ?? new List<ValidationRule>();

          if (!string.IsNullOrEmpty(input?.TableId))
          {
              // Tu môžeš filtrovať pravidlá podľa tableId ak to máš v JSON
              _logger?.LogInformation($"[GridApi] Filtering rules for table: {input.TableId}");
              // filteredRules = filteredRules.Where(r => r.TableId == input.TableId).ToList();
          }

          return JsonSerializer.Serialize(new
          {
              success = true,
              data = filteredRules,
              message = $"Loaded {filteredRules.Count} validation rules template"
          });
      }
      catch (Exception ex)
      {
          _logger?.LogError(ex, "[GridApi] GetValidationRulesTemplate failed");
          return JsonSerializer.Serialize(new
          {
              success = false,
              error = ex.Message
          });
      }
  }

  public class ValidationRulesConfig
  {
      public List<ValidationRule> Rules { get; set; } = new();
  }

  public class GetValidationRulesInput
  {
      public string? TableId { get; set; }
  }

  Vytvoriť JSON súbor: D:\...\RB0120Desktop\bin\Debug\...\config\validation-rules.json
  {
    "rules": [
      {
        "columnName": "Name",
        "ruleType": "Required",
        "errorMessage": "Name je povinné pole",
        "severity": "Error"
      },
      {
        "columnName": "Email",
        "ruleType": "Regex",
        "regexPattern": "^[^@]+@[^@]+\\.[^@]+$",
        "errorMessage": "Email musí byť platný",
        "severity": "Error"
      },
      {
        "columnName": "Age",
        "ruleType": "Range",
        "minValue": 18,
        "maxValue": 65,
        "errorMessage": "Vek musí byť medzi 18-65",
        "severity": "Warning"
      }
    ]
  }

  ---
  Frontend TypeScript Interface & API metóda

  gridApi.ts - Pridať metódu:
  // Add to Window interface declaration
  declare global {
    interface Window {
      gridApi?: {
        // ... existing methods ...
        SetTableValidationRules(jsonParams: string): Promise<string>  // ✅ Hlavná metóda
        GetValidationRulesTemplate?(jsonParams: string): Promise<string>  // ✅ Voliteľná pomocná metóda
      }
    }
  }

  // Add to GridApi class
  export class GridApi {
    // ... existing code ...

    /**
     * ✅ HLAVNÁ METÓDA: Set validation rules for a specific table
     * @param tableId - ID tabuľky (napr. "table1", "table2")
     * @param rules - Pole validačných pravidiel (ako ARGUMENT!)
     */
    async setTableValidationRules(tableId: string, rules: ValidationRule[]): Promise<ApiResponse<any>> {
      if (!this.isHostMode) {
        return { success: false, error: 'Grid API not available' }
      }

      const params = JSON.stringify({
        tableId,
        rules
      })

      console.log(`[GridAPI] Setting ${rules.length} validation rules for table: ${tableId}`)
      return this.callHostApi<any>('SetTableValidationRules', params)
    }

    /**
     * ✅ VOLITEĽNÁ POMOCNÁ METÓDA: Get pre-configured validation rules template
     * Len pre development/testing - v produkcii sa pravidlá zadávajú cez setTableValidationRules()
     */
    async getValidationRulesTemplate(tableId?: string): Promise<ApiResponse<ValidationRule[]>> {
      if (!this.isHostMode) {
        return { success: false, error: 'Grid API not available' }
      }

      const params = tableId ? JSON.stringify({ tableId }) : '{}'
      return this.callHostApi<ValidationRule[]>('GetValidationRulesTemplate', params)
    }
  }

  ---
  Prepísať App.vue - Presunúť hardcoded rules do backend volania

  App.vue - Použitie všeobecnej metódy:
  // ✅ NOVÁ IMPLEMENTÁCIA: Pravidlá cez backend všeobecnú metódu
  async function addValidationRulesToTable1() {
    try {
      if (!table1Ref.value?.validation) {
        alert('❌ Tabuľka 1 nie je pripravená!')
        return
      }

      console.log('[addValidationRules] Preparing validation rules...')

      // ✅ MOŽNOSŤ A: Pravidlá definované v kóde (hardcoded, ale poslané cez backend)
      const rules = [
        {
          columnName: 'Name',
          ruleType: 'Required',
          errorMessage: 'Name je povinné pole',
          severity: 'Error'
        },
        {
          columnName: 'Email',
          ruleType: 'Regex',
          regexPattern: '^[^@]+@[^@]+\\.[^@]+$',
          errorMessage: 'Email musí byť platný',
          severity: 'Error'
        },
        {
          columnName: 'Age',
          ruleType: 'Range',
          minValue: 18,
          maxValue: 65,
          errorMessage: 'Vek musí byť medzi 18-65',
          severity: 'Warning'
        }
      ]

      // ✅ MOŽNOSŤ B: Načítať pravidlá z backend JSON template (pre testing)
      // const templateResponse = await gridApi.getValidationRulesTemplate('table1')
      // if (!templateResponse.success) {
      //   alert(`❌ Nepodarilo sa načítať template: ${templateResponse.error}`)
      //   return
      // }
      // const rules = templateResponse.data || []

      console.log(`[addValidationRules] Sending ${rules.length} rules to backend for table1...`)

      // ✅ Zaslať pravidlá cez backend všeobecnú metódu
      // Backend dostáva tableId + rules ako ARGUMENTY (nie hardcoded!)
      const response = await gridApi.setTableValidationRules('table1', rules)

      if (!response.success) {
        alert(`❌ Backend odmietol validation rules: ${response.error}`)
        return
      }

      console.log('[addValidationRules] Backend accepted rules, applying locally...')

      // ✅ Aplikovať pravidlá lokálne do tabuľky
      for (const rule of rules) {
        table1Ref.value.validation.addValidationRule(rule)
      }

      alert(`✅ Validation rules pridané pre Tabuľku 1! (${rules.length} pravidiel)`)
      console.log('[addValidationRules] Rules applied successfully')
    } catch (error) {
      console.error('[addValidationRules] Failed:', error)
      alert(`❌ Chyba pri pridávaní validation rules: ${error}`)
    }
  }

  ---
  Opraviť App.vue onMounted - Odstrániť volanie GetValidationRules()

  App.vue:112-129 - Zmazať alebo upraviť:
  // ❌ ODSTRÁNIŤ TOTO (crashuje aplikáciu):
  // 3. Load validation rules
  console.log('[DEBUG] Step 3: Loading validation rules...')
  let rulesResponse
  try {
    rulesResponse = await gridApi.getValidationRules()  // ❌ Neexistuje!
    console.log('[DEBUG] Rules response received, success:', rulesResponse.success)
  } catch (rulesError) {
    console.error('[DEBUG] Rules call failed with error:', rulesError)
    throw rulesError
  }

  // ✅ NAHRADIŤ TÝMTO:
  // 3. Validation rules - managed manually via button (not auto-loaded)
  console.log('[DEBUG] Step 3: Validation rules - managed manually')
  console.log('[DEBUG] Step 3 COMPLETE')

  ALEBO ak chceš auto-load z template (voliteľné):
  // 3. Load validation rules template (optional)
  console.log('[DEBUG] Step 3: Loading validation rules template...')
  try {
    const rulesResponse = await gridApi.getValidationRulesTemplate()
    console.log('[DEBUG] Rules template response received, success:', rulesResponse.success)

    if (rulesResponse.success && rulesResponse.data) {
      const rulesCount = Array.isArray(rulesResponse.data) ? rulesResponse.data.length : 0
      console.log(`✅ Loaded ${rulesCount} validation rules template (not applied yet)`)
      // Pravidlá sa aplikujú len keď user klikne na tlačidlo
    } else {
      console.warn('⚠️ No validation rules template found (this is OK)')
    }
  } catch (rulesError) {
    console.error('❌ Failed to load validation rules template (non-critical):', rulesError)
    // Continue - validation rules are optional
  }
  console.log('[DEBUG] Step 3 COMPLETE')

  ---
  Zhrnutie architektúry PO refactoringu

  NOVÁ ARCHITEKTÚRA:
  ┌────────────────────────────────────────────────────────────────┐
  │ VALIDATION RULES - CENTRALIZOVANÝ BACKEND SYSTÉM              │
  ├────────────────────────────────────────────────────────────────┤
  │                                                                │
  │ JEDNA VŠEOBECNÁ METÓDA: SetTableValidationRules()            │
  │ ┌──────────────────────────────────────────────────────────┐ │
  │ │ User klikne "✓ Pridať Validation Rules"                │ │
  │ │   ↓                                                      │ │
  │ │ addValidationRulesToTable1()                            │ │
  │ │   ↓                                                      │ │
  │ │ Pravidlá definované v kóde ALEBO načítané z template    │ │
  │ │   ↓                                                      │ │
  │ │ gridApi.setTableValidationRules(                        │ │
  │ │     'table1',          ← tableId (ARGUMENT!)            │ │
  │ │     rules[]            ← pravidlá (ARGUMENT!)           │ │
  │ │ )                                                        │ │
  │ │   ↓                                                      │ │
  │ │ C# GridApi.SetTableValidationRules(jsonParams)          │ │
  │ │   ↓                                                      │ │
  │ │ Parse input:                                            │ │
  │ │   - tableId = "table1"                                  │ │
  │ │   - rules = [...]                                       │ │
  │ │   ↓                                                      │ │
  │ │ Backend validuje pravidlá                               │ │
  │ │   ↓                                                      │ │
  │ │ Backend môže: log, uložiť, notifikovať, atď.           │ │
  │ │   ↓                                                      │ │
  │ │ Vráti success + potvrdenie                              │ │
  │ │   ↓                                                      │ │
  │ │ Frontend aplikuje pravidlá do KONKRÉTNEJ tabuľky        │ │
  │ │   ↓                                                      │ │
  │ │ table1Ref.value.validation.addValidationRule(rule)      │ │
  │ │   ↓                                                      │ │
  │ │ ✅ Pravidlá fungujú v tabuľke "table1"                 │ │
  │ └──────────────────────────────────────────────────────────┘ │
  │                                                                │
  │ VOLITEĽNÁ POMOCNÁ METÓDA: GetValidationRulesTemplate()       │
  │ (len pre testing/development)                                 │
  │ ┌──────────────────────────────────────────────────────────┐ │
  │ │ gridApi.getValidationRulesTemplate('table1')            │ │
  │ │   ↓                                                      │ │
  │ │ C# GridApi.GetValidationRulesTemplate(jsonParams)       │ │
  │ │   ↓                                                      │ │
  │ │ Načíta z: config/validation-rules.json                  │ │
  │ │   ↓                                                      │ │
  │ │ Vráti pravidlá (bez aplikácie)                          │ │
  │ │   ↓                                                      │ │
  │ │ Frontend použije pravidlá pre SetTableValidationRules() │ │
  │ └──────────────────────────────────────────────────────────┘ │
  │                                                                │
  └────────────────────────────────────────────────────────────────┘

  KĽÚČOVÉ BODY:
  1. ✅ SetTableValidationRules(tableId, rules) - HLAVNÁ metóda
    - Prijíma tableId (vie pre ktorú tabuľku)
    - Prijíma rules[] (ARGUMENT, nie hardcoded)
    - Všeobecná, reusable pre akúkoľvek tabuľku
  2. ✅ GetValidationRulesTemplate(tableId?) - VOLITEĽNÁ pomocná metóda
    - Len pre testing/development
    - Načíta predpripravené pravidlá z JSON
    - NEaplikuje ich - len vráti template
  3. ✅ Backend má plnú kontrolu:
    - Validuje pravidlá
    - Loguje operácie
    - Môže uložiť do databázy
    - Môže notifikovať iné komponenty
  4. ✅ Frontend hardcoded rules presunuté do backend flow
    - Pravidlá idú cez backend API
    - Backend vie o všetkých pravidlách
    - Centralizovaná správa

  ---
  RIEŠENIE #2: Opraviť WHILE LOOP - Použiť async polling (PRIORITA 1)

  DataGrid.vue:994-1004 - Nahradiť:
  // ❌ PRED (synchronous while loop)
  while (isValidating.value && Date.now() - startWait < 5000) {
    await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 100))
  }

  // ✅ PO (async polling s lepšou diagnostikou)
  const waitForValidation = async (maxWaitMs: number = 5000): Promise<boolean> => {
    const startWait = Date.now()
    let iterations = 0

    while (isValidating.value && Date.now() - startWait < maxWaitMs) {
      iterations++
      console.log(`[validateRequired] Waiting for validation (iteration ${iterations}, elapsed: ${Date.now() - startWait}ms)`)

      // Yield to UI thread
      await nextTick()
      await new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, 100))

      // ✅ Safety check - ak stále validating po 5s, force reset
      if (Date.now() - startWait >= maxWaitMs && isValidating.value) {
        console.error(`[validateRequired] ❌ DEADLOCK DETECTED - forcing isValidating=false`)
        isValidating.value = false  // Force reset deadlock
        return false
      }
    }

    return !isValidating.value  // true ak validation skončila normálne
  }

  // Use it
  const validationReady = await waitForValidation(5000)
  if (!validationReady) {
    console.error('[validateRequired] ❌ Validation timeout or deadlock')
    return false
  }

  ---
  RIEŠENIE #3: WebView2 Crash Recovery (PRIORITA 2)

  MainWindow.xaml.cs:766-792 - Vylepšiť:
  private void CoreWebView2_ProcessFailed(object sender, CoreWebView2ProcessFailedEventArgs e)
  {
      _fileLogger.Error("=================================================================");
      _fileLogger.Error("[WebView2 PROCESS FAILED]");
      _fileLogger.Error($"Process Kind: {e.ProcessFailedKind}");
      _fileLogger.Error($"Reason: {e.Reason}");
      _fileLogger.Error($"Exit Code: {e.ExitCode}");
      _fileLogger.Error($"Process Description: {e.ProcessDescription}");
      _fileLogger.Error("=================================================================");

      // ✅ IMMEDIATE log flush - ensure logs are written before recovery attempt
      Serilog.Log.CloseAndFlush();

      // ✅ Show error dialog to user
      this.DispatcherQueue?.TryEnqueue(async () =>
      {
          try
          {
              var dialog = new ContentDialog
              {
                  Title = "WebView2 Process Failed",
                  Content = $"The application encountered a critical error:\n\n" +
                            $"Kind: {e.ProcessFailedKind}\n" +
                            $"Reason: {e.Reason}\n" +
                            $"Exit Code: {e.ExitCode}\n\n" +
                            $"The application will attempt to restart.",
                  PrimaryButtonText = "Restart",
                  CloseButtonText = "Exit",
                  XamlRoot = this.Content.XamlRoot
              };

              var result = await dialog.ShowAsync();

              if (result == ContentDialogResult.Primary)
              {
                  // ✅ Attempt restart
                  _fileLogger.Information("[ProcessFailed] User chose to restart");
                  Application.Current.Exit();  // Clean exit - OS will restart if configured
                  // Or implement in-process restart logic
              }
              else
              {
                  // ✅ User chose to exit
                  _fileLogger.Information("[ProcessFailed] User chose to exit");
                  Application.Current.Exit();
              }
          }
          catch (Exception ex)
          {
              _fileLogger.Error($"[ProcessFailed] Failed to show dialog: {ex.Message}");
              // Force exit as last resort
              Application.Current.Exit();
          }
      });
  }

  ---
  RIEŠENIE #4: Crash-Safe Logging (PRIORITA 2)

  App.xaml.cs - Vylepšiť UnhandledException handler:
  private void App_UnhandledException(object sender, Microsoft.UI.Xaml.UnhandledExceptionEventArgs e)
  {
      _appLogger.Error("=================================================================");
      _appLogger.Error("[App] !!! UNHANDLED EXCEPTION CAUGHT !!!");
      _appLogger.Error($"[App] Exception Type: {e.Exception?.GetType().FullName}");
      _appLogger.Error($"[App] Exception Message: {e.Exception?.Message}");
      _appLogger.Error($"[App] Stack Trace: {e.Exception?.StackTrace}");
      _appLogger.Error("=================================================================");

      // ✅ CRITICAL: Flush logs IMMEDIATELY before app crashes
      try
      {
          Serilog.Log.CloseAndFlush();
          System.Threading.Thread.Sleep(500);  // Give time for flush
      }
      catch { }

      // ✅ Show error to user before crash
      e.Handled = true;  // Try to prevent crash

      // ✅ Try to show error dialog (may fail if UI thread is dead)
      try
      {
          var dialog = new ContentDialog
          {
              Title = "Critical Error",
              Content = $"The application encountered a critical error and must close:\n\n{e.Exception?.Message}",
              CloseButtonText = "Exit"
          };
          // Note: ShowAsync may not work here, use MessageBox alternative
      }
      catch { }
  }

  Pridať Serilog AutoFlush:
  // Static constructor in App.xaml.cs
  Log.Logger = new LoggerConfiguration()
      .WriteTo.File(
          logPath,
          rollingInterval: RollingInterval.Day,
          outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
          flushToDiskInterval: TimeSpan.FromSeconds(1)  // ✅ Flush every 1 second
      )
      .CreateLogger();

  ---
  RIEŠENIE #5: Frontend Error Boundary (PRIORITA 3)

  App.vue:69-176 - Wrap onMounted v try-catch:
  onMounted(async () => {
    try {
      console.log('🚀 Loading data from backend...')

      // ... existing code ...

      // 3. Validation rules - managed manually
      console.log('[DEBUG] Step 3: Validation rules - managed manually via button')
      console.log('[DEBUG] Step 3 COMPLETE')

      // ... rest of code ...

    } catch (error) {
      // ✅ TOP-LEVEL error handler - NEVER let errors escape onMounted
      console.error('❌ CRITICAL ERROR during initialization:', error)
      alert(`Failed to initialize application: ${error}`)
      isLoading.value = false
    }
  })

  ---
  RIEŠENIE #6: Enhanced Diagnostic Logging (PRIORITA 3)

  Pridať do MainWindow.xaml.cs onMounted:
  // After navigation complete
  Log.Information("=================================================================");
  Log.Information("[Initialization Complete]");
  Log.Information($"WebView2 Version: {webView.CoreWebView2.Environment.BrowserVersionString}");
  Log.Information($"Process ID: {System.Diagnostics.Process.GetCurrentProcess().Id}");
  Log.Information($"Memory Usage: {System.Diagnostics.Process.GetCurrentProcess().WorkingSet64 / 1024 / 1024} MB");
  Log.Information("=================================================================");

  // ✅ Periodic health check logging
  var healthCheckTimer = new System.Threading.Timer(_ =>
  {
      try
      {
          Log.Information("[Health] App running, Memory: {0} MB",
              System.Diagnostics.Process.GetCurrentProcess().WorkingSet64 / 1024 / 1024);
      }
      catch { }
  }, null, TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(30));

  Pridať do frontend gridApi.ts:
  private async callHostApi<T>(method: string, ...args: any[]): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    console.log(`[GridAPI] → Calling ${method}`, args.length > 0 ? args : '')

    try {
      // ... existing code ...

      console.log(`[GridAPI] ← ${method} completed in ${Date.now() - startTime}ms`)
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`[GridAPI] ✘ ${method} FAILED after ${duration}ms:`, error)

      // ✅ Log to C# backend for centralized crash analysis
      try {
        await this.logError(method, error)
      } catch { }

      return { success: false, error: String(error) }
    }
  }

  private async logError(method: string, error: any) {
    // Call C# logging endpoint
    if (window.chrome?.webview) {
      window.chrome.webview.postMessage({
        type: 'error',
        method,
        error: error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }
  }

  ---
  ZHRNUTIE RIEŠENÍ - IMPLEMENTAČNÝ PLÁN

  Priorita 1 (KRITICKÉ - Crash/Freeze):
  1. ✅ Implementovať SetTableValidationRules(tableId, rules) v C# GridApi
    - Prijíma tableId + rules[] ako ARGUMENTY
    - Všeobecná metóda, NIE generuje pravidlá vnútri
  2. ✅ Voliteľne: GetValidationRulesTemplate(tableId?) pre testing
    - Načíta pravidlá z JSON template
    - Nevie o konkrétnej tabuľke (alebo vie ak poskytneme tableId)
  3. ✅ Vytvoriť config/validation-rules.json (voliteľné)
  4. ✅ Prepísať App.vue addValidationRulesToTable1() - použiť backend API
    - Pravidlá poslané ako argument do setTableValidationRules('table1', rules)
  5. ✅ Opraviť App.vue onMounted - odstrániť volanie neexistujúcej metódy
  6. ✅ Opraviť while loop v DataGrid validateRequired()
  7. ✅ Wrap App.vue onMounted v try-catch

  Priorita 2 (Dôležité - Recovery):
  8. ✅ WebView2 ProcessFailed recovery dialog
  9. ✅ Crash-safe logging (flush before crash)

  Priorita 3 (Diagnostika):
  10. ✅ Enhanced logging (health checks, performance metrics)
  11. ✅ Frontend → Backend error reporting

  Chceš aby som:
  - A) Implementoval všetky riešenia (Priorita 1 + 2 + 3)?
  - B) Len Priorita 1 (kritické opravy)?
  - C) Niečo iné?

  DÔLEŽITÉ: Nebudem nič meniť, kým mi nepovieš!

> implementuj to presne ako navrhujes pricom ale pri tom bode s validation vobec negeneruj na backend GetValidationRulesTemplate(tableId?)  ale pouzi SetTableValidationRules(tableId, rules) kde
ako tableid zadas id prvej tabulky a ako rules zadas tie rules data z json suboru ktore si si predtym nacital do premennej a sem uz zasielas tu premennu ako parameter. to hardcoded tie pravidla
vo App.vue to odstran. ostatne riesenia aplikuj tak ako navrhujes (cize jedina zmena je len v tom bode s validation a aj to len to co som ti sem teraz napisal.