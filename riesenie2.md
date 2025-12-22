IDENTIFIKÁCIA PROBLÉMOV - Náhodné ukončenia a zamrznutia

    Našiel som KRITICKÉ PROBLÉMY ktoré spôsobujú crash a freeze aplikácie.

  ---  PROBLÉM #1: VOLANIE NEEXISTUJÚCEJ METÓDY GetValidationRules()

    Dôkaz v log súbore (line 65-67):
    [ERR] [Frontend ERROR] Grid API call failed:
    [Frontend LOG] [DEBUG] Rules response received, success: false
    [WRN] [Frontend WARNING] ⚠️ Validation rules failed: o[e] is not a function

    Root Cause:
  - Frontend volá gridApi.getValidationRules() (App.vue:116)
  - Backend C# NEMÁ túto metódu! (GridApi.cs:203-205)

    // GridApi.cs line 203-205
    // ===== REMOVED: Validation and column methods =====
    // - GetValidationRules() → Managed in frontend store

    Frontend TypeScript (gridApi.ts:189-193):
    async getValidationRules(): Promise<ApiResponse<ValidationRule[]>> {
      if (!this.isHostMode) {
        return { success: false, error: 'Grid API not available' }
      }
      return this.callHostApi<ValidationRule[]>('GetValidationRules')  // Volá neexistujúcu metódu!
    }

    Čo sa stane:
  1. Frontend zavolá window.gridApi.GetValidationRules()
  2. C# GridApi NEMÁ túto metódu
  3. JavaScript error: o[e] is not a function (minified)
  4. Uncaught exception môže crashnúť WebView2 proces
  5. Aplikácia sa náhle ukončí

    Impact:
  - ❌ Frontend kód volá neexistujúcu metódu → error
  - Správne riešenie: Validácia nebude automaticky vyžadovaná. Ak je potrebné validovať data hned od začiatku, validačné pravidlá sa zašlú do tabuľky hned po inicializácii. Ak sa pravidlá nezašlú, žiadna validácia sa nevykonáva - metóda GetValidationRules() nie je potrebná.

    📋 DETAILNÉ INFO: Ako fungujú Validation Rules v aplikácii

    Dva spôsoby ako pridať validation rules:

    SPÔSOB #1: Automatické načítanie pri štarte (BROKEN - NEBUDE SA POUŽÍVAŤ)
    // App.vue:112-129
    onMounted(async () => {
      // ...
      // 3. Load validation rules
      const rulesResponse = await gridApi.getValidationRules()  // ❌ Volá GetValidationRules() ktorá neexistuje!
      // Toto ZLYHÁ lebo C# GridApi nemá túto metódu
    })

    SPÔSOB #2: Zasielanie validation rules z backendu do tabuľky (SPRÁVNY SPÔSOB)
    // Backend metódy budú zasielať validačné pravidlá do tabuľky
    // Frontend komponenty prijmú pravidlá a aplikujú ich

    Ako to funguje:
  1. Backend zavolá gridApi.addValidationRules(tableId, rules) - zasiela všetky pravidlá
  2. Backend zavolá gridApi.addValidationRule(tableId, rule) - zasiela jedno pravidlo
  3. Frontend komponenty prijmú pravidlá a aplikujú ich do validation systému

    Architektonický detail:

  1. Vue Component Ref:
    const table1Ref = ref<InstanceType | null>(null)
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
   addValidationRule,  // ← Frontend metóda na aplikáciu pravidla
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
  - A: Backend zasie validation rules do tabuľky pomocou gridApi metód
  - Backend zavolá gridApi.addValidationRules(tableId, rules) alebo gridApi.addValidationRule(tableId, rule)
  - Frontend komponenty prijmú pravidlá a aplikujú ich

    Q2: "ako ich zasielam do tabulky ?"
  - A: Pomocou backend gridApi metód:
    await gridApi.addValidationRules('table1', rules)  // Zasiela všetky pravidlá
    await gridApi.addValidationRule('table1', rule)   // Zasiela jedno pravidlo

    Q3: "Čo je potom gridApi.getValidationRules() čo zlyhalo?"
  - A: To bol pokus načítať pravidlá Z BACKENDU pri štarte
  - Metóda GetValidationRules() bola ODSTRÁNENÁ z C# backendu
  - PROBLÉM: Frontend kód stále volá túto metódu → crash!
  - RIEŠENIE: Odstrániť volanie GetValidationRules(), používať len addValidationRules/addValidationRule

    AKTUÁLNY STAV ARCHITEKTÚRY:

    ┌─────────────────────────────────────────────────────────────┐
    │ VALIDATION RULES - BACKEND → FRONTEND SYSTÉM              │
    ├─────────────────────────────────────────────────────────────┤
    │                                                             │
    │ NOVÝ SYSTÉM: Backend zasiela pravidlá do tabuľky          │
    │ ┌─────────────────────────────────────────────────────┐   │
    │ │ Backend má validation rules (JSON / database)       │   │
    │ │   ↓                                                  │   │
    │ │ Backend zavolá:                                     │   │
    │ │   gridApi.addValidationRules(tableId, rules)       │   │
    │ │   alebo                                             │   │
    │ │   gridApi.addValidationRule(tableId, rule)         │   │
    │ │   ↓                                                  │   │
    │ │ Frontend komponenty prijmú pravidlá                │   │
    │ │   ↓                                                  │   │
    │ │ Pravidlá sa aplikujú do useValidation store        │   │
    │ │   ↓                                                  │   │
    │ │ ✅ Validation funguje v tabuľke                    │   │
    │ └─────────────────────────────────────────────────────┘   │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘

    DÔLEŽITÉ ZISTENIE:
  - Validácia nebude automaticky vyžadovaná pri štarte
  - Ak je potrebné validovať data hned od začiatku, validačné pravidlá sa zašlú do tabuľky hned po inicializácii
  - Ak sa pravidlá nezašlú, žiadna validácia sa nevykonáva
  - GetValidationRules() nie je potrebná

  ---  PROBLÉM #2: WHILE LOOP BEZ ESCAPEHATCH (FREEZE!)

    Lokácia: DataGrid.vue:994-998

    // Wait for previous validation to finish (max 5 seconds)
    const startWait = Date.now()
    while (isValidating.value && Date.now() - startWait < 5000) {
      await new Promise((resolve: (value: void | PromiseLike) => void) => setTimeout(resolve, 100))
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

  ---  PROBLÉM #3: CHÝBAJÚCE ERROR HANDLING PRE WebView2 ProcessFailed

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

  ---  PROBLÉM #4: DIAGNOSTIC LOGS SA NEZAPÍŠU PRI CRASH

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

  ---  PROBLÉM #5: UNHANDLED PROMISE REJECTIONS

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

  ---  NAVRHOVANÉ RIEŠENIA

    RIEŠENIE #1: Implementovať backend metódy pre zasielanie validation rules do tabuľky (PRIORITA 1)

    DÔLEŽITÉ ZISTENIE:
  - GetValidationRules() sa nebude používať vôbec
  - Validácia nebude automaticky vyžadovaná
  - Ak je potrebné validovať data hned od začiatku, validačné pravidlá sa zašlú do tabuľky hned po inicializácii
  - Ak sa pravidlá nezašlú, žiadna validácia sa nevykonáva

    NÁVRH RIEŠENIA:
    Vytvoríme všeobecné backend metódy ktoré:
  - Prijímajú tableId (povinné) - vie pre ktorú tabuľku
  - Prijímajú rules/rule (povinné) - pravidlá ako ARGUMENT, nie hardcoded
  - Zasielaj pravidlá z backendu do frontendu
  - Sú všeobecné, nie na mieru pre jednu tabuľku

  ---  IMPLEMENTÁCIA: Backend metódy pre validation rules

    GridApi.cs - Pridať metódy:

    ///
    /// ✅ Zasiela všetky validation rules do tabuľky
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    ///
    /// ID tabuľky (napr. "table1", "table2")
    /// JSON array s validation rules
    public async Task AddValidationRulesAsync(string tableId, string rulesJson)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] AddValidationRulesAsync called for table: {tableId}");
            _logger?.LogDebug($"[GridApi] Rules JSON: {rulesJson}");

        // Parse rules
        var rules = JsonSerializer.Deserialize<List<ValidationRule>>(rulesJson);

        if (rules == null || rules.Count == 0)
        {
            return JsonSerializer.Serialize(new { success = false, error = "No rules provided" });
        }

        // Zaslať pravidlá do frontendu
        var jsCode = $@"
            (function() {{
                const tableId = {JsonSerializer.Serialize(tableId)};
                const rules = {rulesJson};

                // Nájsť tabuľku podľa ID
                const gridComponent = window.__grids?.[tableId];
                if (!gridComponent || !gridComponent.validation) {{
                    console.error('[AddValidationRules] Grid not found:', tableId);
                    return false;
                }}

                // Pridať všetky pravidlá
                rules.forEach(rule => {{
                    gridComponent.validation.addValidationRule(rule);
                }});

                console.log('[AddValidationRules] Added', rules.length, 'rules to', tableId);
                return true;
            }})()
        ";

        var result = await _webView.ExecuteScriptAsync(jsCode);

        return JsonSerializer.Serialize(new {
            success = true,
            message = $"Added {rules.Count} validation rules to table {tableId}"
        });
    }
    catch (Exception ex)
    {
        _logger?.LogError(ex, "[GridApi] AddValidationRulesAsync failed");
        return JsonSerializer.Serialize(new { success = false, error = ex.Message });
    }
    }

    ///
    /// ✅ Zasiela jedno validation rule do tabuľky
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    ///
    /// ID tabuľky
    /// JSON s validation rule
    public async Task AddValidationRuleAsync(string tableId, string ruleJson)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] AddValidationRuleAsync called for table: {tableId}");

        // Zaslať pravidlo do frontendu
        var jsCode = $@"
            (function() {{
                const tableId = {JsonSerializer.Serialize(tableId)};
                const rule = {ruleJson};

                const gridComponent = window.__grids?.[tableId];
                if (!gridComponent || !gridComponent.validation) {{
                    console.error('[AddValidationRule] Grid not found:', tableId);
                    return false;
                }}

                gridComponent.validation.addValidationRule(rule);
                console.log('[AddValidationRule] Added rule to', tableId, rule);
                return true;
            }})()
        ";

        var result = await _webView.ExecuteScriptAsync(jsCode);

        return JsonSerializer.Serialize(new {
            success = true,
            message = $"Added validation rule to table {tableId}"
        });
    }
    catch (Exception ex)
    {
        _logger?.LogError(ex, "[GridApi] AddValidationRuleAsync failed");
        return JsonSerializer.Serialize(new { success = false, error = ex.Message });
    }
    }

    ///
    /// ✅ Zruší všetky validation rules na tabuľke
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    ///
    /// ID tabuľky
    public async Task DeleteValidationRulesAsync(string tableId)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] DeleteValidationRulesAsync called for table: {tableId}");

        var jsCode = $@"
            (function() {{
                const tableId = {JsonSerializer.Serialize(tableId)};

                const gridComponent = window.__grids?.[tableId];
                if (!gridComponent || !gridComponent.validation) {{
                    console.error('[DeleteValidationRules] Grid not found:', tableId);
                    return false;
                }}

                gridComponent.validation.validationRules.value.clear();
                gridComponent.validation.ruleCount.value++;
                console.log('[DeleteValidationRules] Cleared all rules from', tableId);
                return true;
            }})()
        ";

        var result = await _webView.ExecuteScriptAsync(jsCode);

        return JsonSerializer.Serialize(new {
            success = true,
            message = $"Deleted all validation rules from table {tableId}"
        });
    }
    catch (Exception ex)
    {
        _logger?.LogError(ex, "[GridApi] DeleteValidationRulesAsync failed");
        return JsonSerializer.Serialize(new { success = false, error = ex.Message });
    }
    }

    ///
    /// ✅ Zruší konkrétne validation rule z tabuľky podľa názvu stĺpca
    /// Všeobecná metóda - funguje pre akúkoľvek tabuľku
    ///
    /// ID tabuľky
    /// Názov pravidla (column name)
    public async Task DeleteValidationRuleAsync(string tableId, string ruleName)
    {
        try
        {
            _logger?.LogInformation($"[GridApi] DeleteValidationRuleAsync called for table: {tableId}, rule: {ruleName}");

        var jsCode = $@"
            (function() {{
                const tableId = {JsonSerializer.Serialize(tableId)};
                const ruleName = {JsonSerializer.Serialize(ruleName)};

                const gridComponent = window.__grids?.[tableId];
                if (!gridComponent || !gridComponent.validation) {{
                    console.error('[DeleteValidationRule] Grid not found:', tableId);
                    return false;
                }}

                gridComponent.validation.validationRules.value.delete(ruleName);
                gridComponent.validation.ruleCount.value++;
                console.log('[DeleteValidationRule] Deleted rule', ruleName, 'from', tableId);
                return true;
            }})()
        ";

        var result = await _webView.ExecuteScriptAsync(jsCode);

        return JsonSerializer.Serialize(new {
            success = true,
            message = $"Deleted validation rule '{ruleName}' from table {tableId}"
        });
    }
    catch (Exception ex)
    {
        _logger?.LogError(ex, "[GridApi] DeleteValidationRuleAsync failed");
        return JsonSerializer.Serialize(new { success = false, error = ex.Message });
    }
    }

    // ===== Model =====
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

  ---  Frontend - Registrácia grid komponentov

    App.vue - Pridať do onMounted:
    // Registrovať grid komponenty do window.__grids aby backend mohol pristupovať k nim
    onMounted(async () => {
      try {
        // Inicializácia grids registry
        if (!window.__grids) {
          window.__grids = {}
        }

    // Registrovať table1
    if (table1Ref.value) {
      window.__grids['table1'] = table1Ref.value
      console.log('[App] Registered table1 to window.__grids')
    }

    // Registrovať table2
    if (table2Ref.value) {
      window.__grids['table2'] = table2Ref.value
      console.log('[App] Registered table2 to window.__grids')
    }

    // ... zvyšok inicializácie ...
  } catch (error) {
    console.error('❌ CRITICAL ERROR during initialization:', error)
  }
    })

  ---  Opraviť App.vue onMounted - Odstrániť volanie GetValidationRules()

    App.vue:112-129 - Zmazať:
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
    // 3. Validation rules - not required automatically
    // Backend will send validation rules to table if needed using AddValidationRulesAsync
    console.log('[DEBUG] Step 3: Validation rules - waiting for backend to send rules if needed')
    console.log('[DEBUG] Step 3 COMPLETE')

  ---  Zhrnutie architektúry PO refactoringu

    NOVÁ ARCHITEKTÚRA:
    ┌────────────────────────────────────────────────────────────────┐
    │ VALIDATION RULES - BACKEND → FRONTEND SYSTÉM                  │
    ├────────────────────────────────────────────────────────────────┤
    │                                                                │
    │ Backend metódy:                                                │
    │ ┌──────────────────────────────────────────────────────────┐ │
    │ │ AddValidationRulesAsync(tableId, rules[])               │ │
    │ │   - Zasiela všetky validation rules do tabuľky          │ │
    │ │   - tableId: ID tabuľky (napr. "table1")                │ │
    │ │   - rules: Array validation rules                       │ │
    │ │                                                          │ │
    │ │ AddValidationRuleAsync(tableId, rule)                   │ │
    │ │   - Zasiela jedno validation rule do tabuľky            │ │
    │ │                                                          │ │
    │ │ DeleteValidationRulesAsync(tableId)                     │ │
    │ │   - Zruší všetky validation rules na tabuľke            │ │
    │ │                                                          │ │
    │ │ DeleteValidationRuleAsync(tableId, ruleName)            │ │
    │ │   - Zruší konkrétne rule podľa názvu stĺpca             │ │
    │ └──────────────────────────────────────────────────────────┘ │
    │                                                                │
    │ Flow:                                                          │
    │ ┌──────────────────────────────────────────────────────────┐ │
    │ │ 1. Inicializácia:                                       │ │
    │ │    - Tabuľka funguje BEZ validácie                      │ │
    │ │    - Validácia nie je automaticky vyžadovaná            │ │
    │ │                                                          │ │
    │ │ 2. Ak potrebuješ validáciu:                             │ │
    │ │    Backend zavolá:                                      │ │
    │ │    await gridApi.AddValidationRulesAsync(               │ │
    │ │        "table1",                                        │ │
    │ │        rulesJson                                        │ │
    │ │    )                                                     │ │
    │ │    ↓                                                     │ │
    │ │    Backend zasiela pravidlá do frontendu                │ │
    │ │    ↓                                                     │ │
    │ │    Frontend prijme pravidlá                             │ │
    │ │    ↓                                                     │ │
    │ │    Pravidlá sa aplikujú do validation store             │ │
    │ │    ↓                                                     │ │
    │ │    ✅ Validation funguje v tabuľke                     │ │
    │ │                                                          │ │
    │ │ 3. Ak pravidlá NEZAŠLEŠ:                                │ │
    │ │    ✅ Tabuľka funguje BEZ validácie (normálne)         │ │
    │ └──────────────────────────────────────────────────────────┘ │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘

    KĽÚČOVÉ BODY:
  1. ✅ AddValidationRulesAsync(tableId, rules) - Zasiela všetky pravidlá
  - tableId: ID tabuľky (vie pre ktorú tabuľku)
  - rules: Array pravidiel (ARGUMENT, nie hardcoded)
  - Všeobecná, funguje pre akúkoľvek tabuľku
  2. ✅ AddValidationRuleAsync(tableId, rule) - Zasiela jedno pravidlo
  - tableId: ID tabuľky
  - rule: Jedno pravidlo (ARGUMENT)
  3. ✅ DeleteValidationRulesAsync(tableId) - Zruší všetky pravidlá
  - tableId: ID tabuľky
  4. ✅ DeleteValidationRuleAsync(tableId, ruleName) - Zruší jedno pravidlo
  - tableId: ID tabuľky
  - ruleName: Názov stĺpca pravidla ktoré sa má zrušiť
  5. ✅ GetValidationRules() - NEPOUŽÍVA SA VÔBEC
  - Táto metóda nie je potrebná
  6. ✅ Automaticky sa NEVYŽADUJE nič
  - Tabuľka funguje bez validácie defaultne
  - Validácia je voliteľná
  7. ✅ Ak potrebuješ validáciu od začiatku
  - Backend zasiela pravidlá hned po inicializácii
  - Použiješ AddValidationRulesAsync('table1', rulesJson)
  8. ✅ Backend má plnú kontrolu:
  - Zasiela pravidlá do tabuľky
  - Môže pridávať/mazať pravidlá dynamicky
  - Všeobecné metódy fungujú pre akúkoľvek tabuľku

  ---  RIEŠENIE #2: Opraviť WHILE LOOP - Použiť async polling (PRIORITA 1)

    DataGrid.vue:994-1004 - Nahradiť:
    // ❌ PRED (synchronous while loop)
    while (isValidating.value && Date.now() - startWait < 5000) {
      await new Promise((resolve: (value: void | PromiseLike) => void) => setTimeout(resolve, 100))
    }

    // ✅ PO (async polling s lepšou diagnostikou)
    const waitForValidation = async (maxWaitMs: number = 5000): Promise => {
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

  ---  RIEŠENIE #3: WebView2 Crash Recovery (PRIORITA 2)

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

  ---  RIEŠENIE #4: Crash-Safe Logging (PRIORITA 2)

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

  ---  RIEŠENIE #5: Frontend Error Boundary (PRIORITA 3)

    App.vue:69-176 - Wrap onMounted v try-catch:
    onMounted(async () => {
      try {
        console.log('🚀 Loading data from backend...')

    // ... existing code ...

    // 3. Validation rules - not required automatically
    console.log('[DEBUG] Step 3: Validation rules - waiting for backend to send rules if needed')
    console.log('[DEBUG] Step 3 COMPLETE')

    // ... rest of code ...

  } catch (error) {
    // ✅ TOP-LEVEL error handler - NEVER let errors escape onMounted
    console.error('❌ CRITICAL ERROR during initialization:', error)
    alert(`Failed to initialize application: ${error}`)
    isLoading.value = false
  }
    })

  ---  RIEŠENIE #6: Enhanced Diagnostic Logging (PRIORITA 3)

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
    private async callHostApi(method: string, ...args: any[]): Promise<ApiResponse> {
      const startTime = Date.now()
      console.log([GridAPI] → Calling ${method}, args.length > 0 ? args : '')

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

  ---  ZHRNUTIE RIEŠENÍ - IMPLEMENTAČNÝ PLÁN

    Priorita 1 (KRITICKÉ - Crash/Freeze):
  1. ✅ Implementovať backend metódy pre validation rules v C# GridApi
  - AddValidationRulesAsync(tableId, rules) - zasiela všetky pravidlá
  - AddValidationRuleAsync(tableId, rule) - zasiela jedno pravidlo
  - DeleteValidationRulesAsync(tableId) - zruší všetky pravidlá
  - DeleteValidationRuleAsync(tableId, ruleName) - zruší jedno pravidlo
  2. ✅ NEIMPLEMENTOVAŤ GetValidationRules() - nebude sa používať
  - Môžeme zmazať getValidationRules() z frontendu (opatrne tak aby sme nič nepokazili)
  3. ✅ Upraviť App.vue - registrovať grid komponenty do window.__grids
  4. ✅ Opraviť App.vue onMounted - odstrániť volanie neexistujúcej metódy
  - Validácia sa nevyžaduje automaticky
  - Backend zasiela pravidlá ak sú potrebné
  5. ✅ Opraviť while loop v DataGrid validateRequired()
  6. ✅ Wrap App.vue onMounted v try-catch

    Priorita 2 (Dôležité - Recovery):
    7. ✅ WebView2 ProcessFailed recovery dialog
    8. ✅ Crash-safe logging (flush before crash)

    Priorita 3 (Diagnostika):
    9. ✅ Enhanced logging (health checks, performance metrics)
    10. ✅ Frontend → Backend error reporting

    Chceš aby som:
  - A) Implementoval všetky riešenia (Priorita 1 + 2 + 3)?
  - B) Len Priorita 1 (kritické opravy)?
  - C) Niečo iné?

    DÔLEŽITÉ: Nebudem nič meniť, kým mi nepovieš!