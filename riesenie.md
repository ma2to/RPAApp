IDENTIFIKÁCIA PROBLÉMOV (S DÔRAZOM NA COLUMN GROUPING)

  KONCEPT: Čo je COLUMN v DataGrid?

  Column (stĺpec) = Vertikálna skupina buniek:
  Column 1          Column 2          Column 3
  ┌─────────┐       ┌─────────┐       ┌─────────┐
  │ Header1 │       │ Header2 │       │ Header3 │  ← Header bunky
  ├─────────┤       ├─────────┤       ├─────────┤
  │ Cell1-1 │       │ Cell2-1 │       │ Cell3-1 │  ← Dátové bunky riadok 1
  │ Cell1-2 │       │ Cell2-2 │       │ Cell3-2 │  ← Dátové bunky riadok 2
  │ Cell1-3 │       │ Cell2-3 │       │ Cell3-3 │  ← Dátové bunky riadok 3
  └─────────┘       └─────────┘       └─────────┘

  Horizontálny scroll by mal:
  - Scrollovať celé columns doľava/doprava
  - Header1 + Cell1-1 + Cell1-2 + Cell1-3 = scrollujú SPOLOČNE ako jeden column
  - Header2 + Cell2-1 + Cell2-2 + Cell2-3 = scrollujú SPOLOČNE ako jeden column

  Vertikálny scroll by mal:
  - Scrollovať len dátové bunky (nie header)
  - Header zostáva sticky na vrchu
  - Cell1-1, Cell1-2, Cell1-3... scrollujú vertikálne

  ---
  AKTUÁLNA IMPLEMENTÁCIA (CSS Grid Layout)

  Technológia: CSS Grid s grid-template-columns

  Ako funguje:
  // DataGrid.vue line 1186
  const gridTemplateColumns = computed(() => {
    // Example output: "50px 150px 200px 1fr 50px"
    return allColumns.value.map((col: GridColumn) => {
      if (col.autoWidth) return '1fr'
      return `${col.width}px`
    }).join(' ')
  })

  Aplikácia na Header:
  <!-- DataGridHeader.vue line 2 -->
  <div class="grid-header"
       :style="{
         gridTemplateColumns,           // "50px 150px 200px 1fr 50px"
         minWidth: minTableWidth + 'px'  // napr. 450px
       }">
    <div class="header-cell">Header1</div>  <!-- width: 50px -->
    <div class="header-cell">Header2</div>  <!-- width: 150px -->
    <div class="header-cell">Header3</div>  <!-- width: 200px -->
    ...
  </div>

  Aplikácia na Rows:
  <!-- DataGridRow.vue line 1 -->
  <div class="grid-row"
       :style="{
         gridTemplateColumns,           // "50px 150px 200px 1fr 50px"
         minWidth: minTableWidth + 'px'  // napr. 450px
       }">
    <div class="cell">Cell1-1</div>  <!-- width: 50px -->
    <div class="cell">Cell2-1</div>  <!-- width: 150px -->
    <div class="cell">Cell3-1</div>  <!-- width: 200px -->
    ...
  </div>

  Výhoda tejto metódy:
  - ✅ grid-template-columns zabezpečuje, že bunky v rovnakom column majú ROVNAKÚ šírku
  - ✅ Header cell 1 (50px) = Row cell 1 (50px) - automaticky zarovnané
  - ✅ Columns sú implicitne zoskupené cez spoločné grid template

  Nevýhoda:
  - ❌ Columns nie sú DOM elementy - sú len grid tracks
  - ❌ Nemôžeme dať horizontal scroll NA column - len na container

  ---
  PROBLÉM #1: DVA HORIZONTAL SCROLLBARS (KRITICKÝ!)

  Aktuálna DOM štruktúra:
  <div class="table-content">                    <!-- overflow-x: auto ← SCROLL #1 -->
    <div class="grid-header"                      <!-- minWidth: 450px -->
         style="grid-template-columns: 50px 150px 200px 1fr 50px">
      <div>Header1</div>
      <div>Header2</div>
      ...
    </div>

    <div class="scroller">                        <!-- overflow-x: visible → AUTO ← SCROLL #2 -->
                                                  <!-- overflow-y: auto -->
      <div class="grid-row"                       <!-- minWidth: 450px -->
           style="grid-template-columns: 50px 150px 200px 1fr 50px">
        <div>Cell1-1</div>
        <div>Cell2-1</div>
        ...
      </div>
      <div class="grid-row" ...>...</div>
      <div class="grid-row" ...>...</div>
    </div>
  </div>

  Problém:
  1. .table-content má overflow-x: auto (line 2901)
    - Toto je SCROLL #1 - scrolluje header aj .scroller element
  2. .scroller má overflow-x: visible + overflow-y: auto (line 2907-2908)
    - CSS SPEC LIMITÁCIA: overflow-x: visible + overflow-y: auto je NEPLATNÉ!
    - Browser AUTOMATICKY KONVERTUJE overflow-x: visible → overflow-x: auto
    - Toto vytvára SCROLL #2 - scrolluje rows vnútri .scroller

  Výsledok:
  User scrollne SCROLL #1 o 100px doprava:
    ├─ .grid-header scrollne o -100px         ✓ (správne)
    ├─ .scroller element scrollne o -100px    ✓ (správne)
    │
    │  Ale rows VNÚTRI .scroller majú minWidth: 450px
    │  a .scroller má overflow-x: auto (konvertované)
    │  → rows vytvárajú VNÚTORNÝ horizontal overflow
    │
    └─ rows scrollujú o -100px v rámci .scroller   ✗ (EXTRA scroll!)

  CELKOVÝ POSUN:
    - Header: -100px (od .table-content scroll)
    - Rows: -100px (od .table-content) + -100px (od .scroller) = -200px

  → Header a rows ROZCHODENÉ o 100px!

  Prečo progresívne väčší rozdiel?
  - Čím viac scrollneš .table-content, tým väčší vnútorný scroll v .scroller
  - Misalignment rastie LINEÁRNE s scroll pozíciou

  ---
  PROBLÉM #2: COLUMN GROUPING PORUŠENÉ

  Očakávanie: Column = Header + všetky bunky pod ním scrollujú SPOLOČNE

  Realita:
  - Header bunky scrollujú v kontexte .table-content
  - Dátové bunky scrollujú v kontexte .scroller (vnorený scroll)
  - → Columns sa ROZPADAJÚ pri horizontal scroll!

  Príklad:
  Pred scrollom:
  Column "Name" (150px šírka)
  ┌──────────────┐
  │ Name         │  ← Header (v .table-content)
  ├──────────────┤
  │ John Smith   │  ← Row 1 cell (v .scroller)
  │ Jane Doe     │  ← Row 2 cell (v .scroller)
  └──────────────┘

  Po scroll #1 doprava o 100px:
  ┌──────────────┐
  │ Name         │  ← scrollnuté o -100px
  ├──────────────┤
  │    John Smith│  ← scrollnuté o -200px (double!)
  │    Jane Doe  │
  └──────────────┘
           ↑
      100px gap!  ← COLUMN ROZBITÝ!

  ---
  PROBLÉM #3: minWidth NA NESPRÁVNYCH ELEMENTOCH

  Aktuálne:
  /* DataGridHeader.vue line 2 */
  .grid-header {
    min-width: 450px;  /* inline style */
  }

  /* DataGridRow.vue line 1 */
  .grid-row {
    min-width: 450px;  /* inline style */
  }

  /* DataGrid.vue line 2905 */
  .scroller {
    min-width: 0;  /* ← PROBLÉM! Nema minWidth! */
  }

  Dôsledok:
  - .grid-header má minWidth: 450px → šírka 450px
  - .scroller má minWidth: 0 → šírka podľa parent (napr. 300px viewport)
  - .grid-row (vnútri .scroller) má minWidth: 450px → šírka 450px
  - → Rows (450px) sú ŠIRŠIE ako .scroller (300px)
  - → Horizontal overflow v .scroller → scrollbar!

  ---
  PROBLÉM #4: CSS VALIDITA

  Aktuálny CSS:
  .scroller {
    overflow-y: auto;      /* Vertical scroll - VALID */
    overflow-x: visible;   /* INVALID! Cannot be 'visible' when overflow-y is 'auto' */
  }

  CSS Specification (CSS 2.1 Section 11.1.1):
  "If one is specified as 'visible' and the other is 'scroll' or 'auto', then 'visible' is set to 'auto'."

  Skutočné computed value:
  // Browser automaticky zmení:
  overflow-x: visible  →  overflow-x: auto

  Dôkaz: Vidíš dva horizontal scrollbars = oba elementy majú overflow-x: auto!

  ---
  NAVRHOVANÉ RIEŠENIA

  RIEŠENIE A: Wrapper element pre COLUMN GROUPING (ODPORÚČANÉ)

  Koncept:
  - Vytvoriť spoločný wrapper pre header + rows
  - Wrapper má minWidth (reprezentuje šírku všetkých columns)
  - Horizontal scroll je NA wrapperi → header aj rows scrollujú SPOLOČNE
  - Columns zostávajú zoskupené pri scroll

  Nová DOM štruktúra:
  <div class="table-content">             <!-- overflow-x: auto, overflow-y: hidden -->

    <div class="table-inner">             <!-- ← NOVÝ WRAPPER -->
                                          <!-- minWidth: 450px (suma column widths) -->
                                          <!-- width: fit-content -->
                                          <!-- display: flex, flex-direction: column -->

      <div class="grid-header"            <!-- position: sticky, top: 0 -->
           style="grid-template-columns: 50px 150px 200px 1fr 50px">
        <div>Header1</div>
        <div>Header2</div>
        ...
      </div>

      <div class="scroller">              <!-- overflow-y: auto -->
                                          <!-- overflow-x: hidden (nie visible!) -->
        <div class="grid-row"
             style="grid-template-columns: 50px 150px 200px 1fr 50px">
          <div>Cell1-1</div>
          <div>Cell2-1</div>
          ...
        </div>
        <div class="grid-row">...</div>
        <div class="grid-row">...</div>
      </div>

    </div>  <!-- end .table-inner -->

  </div>  <!-- end .table-content -->

  CSS zmeny:
  /* Horizontal scroll container */
  .table-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    overflow-x: auto;      /* ✅ Horizontal scroll pre CELÝ wrapper */
    overflow-y: hidden;    /* ✅ Vertical scroll je v .scroller */
  }

  /* ✅ NOVÝ - Wrapper pre column grouping */
  .table-inner {
    min-width: var(--min-table-width);  /* 450px - suma column widths */
    width: fit-content;                 /* Shrink to content ak je menší ako viewport */
    display: flex;
    flex-direction: column;
    flex: 1;                            /* Fill vertical space */
  }

  /* Header - sticky v rámci .table-inner */
  .grid-header {
    display: grid;
    /* grid-template-columns from inline style */
    position: sticky;      /* ✅ Sticky pri vertical scroll v .scroller */
    top: 0;
    z-index: 10;
    background-color: var(--dg-header-bg, #f5f5f5);
    border-bottom: 2px solid var(--dg-border-column, #ccc);
    /* ❌ REMOVE min-width - zdedí od .table-inner parent */
  }

  /* Vertical scroll container */
  .scroller {
    flex: 1;
    overflow-y: auto;      /* ✅ Vertical scroll pre rows */
    overflow-x: hidden;    /* ✅ HIDDEN (nie visible!) - no horizontal scroll */
    /* ❌ REMOVE min-width - zdedí od .table-inner parent */
  }

  /* Row - width zdedená od .table-inner */
  .grid-row {
    display: grid;
    /* grid-template-columns from inline style */
    /* ❌ REMOVE min-width - zdedí od .table-inner parent */
  }

  Vue Template zmeny:
  <!-- DataGrid.vue -->
  <div class="table-content">

    <!-- ✅ NOVÝ wrapper element -->
    <div class="table-inner" :style="{ minWidth: minTableWidth ? `${minTableWidth}px` : undefined }">

      <DataGridHeader
        :columns="allColumns"
        :grid-template-columns="gridTemplateColumns"
        <!-- ❌ REMOVE :min-table-width prop -->
        :grid-id="instanceId"
        ...
      />

      <div ref="scrollerRef" class="scroller">
        <LazyRow
          v-for="item in visibleRows"
          :key="item.rowId"
          :row="item"
          :columns="allColumns"
          :grid-template-columns="gridTemplateColumns"
          <!-- ❌ REMOVE :min-table-width prop -->
          :grid-id="instanceId"
          ...
        />
      </div>

    </div>  <!-- end .table-inner -->

  </div>

  Výhody:
  - ✅ Jeden horizontal scroll - len na .table-content
  - ✅ Column grouping zachované - header + rows v .table-inner scrollujú spoločne
  - ✅ CSS validné - overflow-x: hidden + overflow-y: auto je OK
  - ✅ minWidth len raz - na .table-inner (DRY princíp)
  - ✅ Header sticky - zostáva na vrchu pri vertical scroll
  - ✅ Grid alignment - grid-template-columns stále zabezpečuje column width sync

  Ako to rieši column grouping:
  User scrollne .table-content o 100px doprava:
    │
    └─ .table-inner scrollne o -100px
         ├─ .grid-header scrollne o -100px        ✓
         └─ .scroller scrollne o -100px
              └─ rows scrollujú o -100px          ✓

  → Header a rows na ROVNAKEJ pozícii!
  → Columns zostávajú ZOSKUPENÉ!

  ---
  RIEŠENIE B: Diagnostické LOGY

  Pridať do onMounted v DataGrid.vue (line ~350):
  onMounted(async () => {
    // ... existing code ...

    // 🔍 DIAGNOSTIC LOGS - Column grouping debug
    await nextTick()
    const tableContent = document.querySelector('.table-content')
    const headerEl = document.querySelector('.grid-header')
    const scrollerEl = scrollerRef.value
    const firstRow = document.querySelector('.grid-row')

    console.group('🔍 HORIZONTAL SCROLL DIAGNOSTIC')

    console.log('📊 .table-content:', {
      offsetWidth: tableContent?.offsetWidth,
      scrollWidth: tableContent?.scrollWidth,
      'overflow-x (CSS)': 'auto',
      'overflow-x (computed)': tableContent ? getComputedStyle(tableContent).overflowX : null,
      hasHorizontalScroll: (tableContent?.scrollWidth || 0) > (tableContent?.offsetWidth || 0)
    })

    console.log('📊 .grid-header:', {
      offsetWidth: headerEl?.offsetWidth,
      scrollWidth: headerEl?.scrollWidth,
      minWidth: headerEl?.style.minWidth,
      gridTemplateColumns: headerEl?.style.gridTemplateColumns
    })

    console.log('📊 .scroller:', {
      offsetWidth: scrollerEl?.offsetWidth,
      scrollWidth: scrollerEl?.scrollWidth,
      'overflow-x (CSS)': 'visible',
      'overflow-x (computed)': scrollerEl ? getComputedStyle(scrollerEl).overflowX : null,
      'overflow-y (computed)': scrollerEl ? getComputedStyle(scrollerEl).overflowY : null,
      hasHorizontalScroll: (scrollerEl?.scrollWidth || 0) > (scrollerEl?.offsetWidth || 0)
    })

    console.log('📊 .grid-row (first):', {
      offsetWidth: firstRow?.offsetWidth,
      scrollWidth: firstRow?.scrollWidth,
      minWidth: firstRow?.style.minWidth,
      gridTemplateColumns: firstRow?.style.gridTemplateColumns
    })

    console.log('🎯 COLUMN GROUPING CHECK:')
    console.log('  Header width === Row width?',
      headerEl?.offsetWidth === firstRow?.offsetWidth ? '✅' : '❌',
      `(${headerEl?.offsetWidth} vs ${firstRow?.offsetWidth})`
    )
    console.log('  Header minWidth === Row minWidth?',
      headerEl?.style.minWidth === firstRow?.style.minWidth ? '✅' : '❌',
      `(${headerEl?.style.minWidth} vs ${firstRow?.style.minWidth})`
    )
    console.log('  Scroller has horizontal scroll?',
      (scrollerEl?.scrollWidth || 0) > (scrollerEl?.offsetWidth || 0) ? '❌ PROBLÉM!' : '✅ OK'
    )

    console.log('⚠️ CSS SPEC VIOLATION CHECK:')
    if (scrollerEl) {
      const computed = getComputedStyle(scrollerEl)
      const overflowX = computed.overflowX
      const overflowY = computed.overflowY
      console.log(`  overflow-x: ${overflowX}, overflow-y: ${overflowY}`)
      if (overflowX === 'auto' && overflowY === 'auto') {
        console.log('  ❌ PROBLÉM: overflow-x konvertované z "visible" na "auto"!')
        console.log('  → Toto vytvára DRUHÝ horizontal scrollbar!')
      }
    }

    console.groupEnd()
  })

  ---
  RIEŠENIE C: Event listener na scroll (debug)

  Pridať scroll listener pre diagnostiku:
  // V onMounted po existing setup
  if (tableContent && scrollerRef.value) {
    let lastScrollLeft = 0

    tableContent.addEventListener('scroll', () => {
      const scrollLeft = tableContent.scrollLeft
      const scrollDelta = scrollLeft - lastScrollLeft
      lastScrollLeft = scrollLeft

      console.log('🔄 .table-content scroll:', {
        scrollLeft,
        scrollDelta,
        headerOffsetLeft: document.querySelector('.grid-header')?.getBoundingClientRect().left,
        rowOffsetLeft: document.querySelector('.grid-row')?.getBoundingClientRect().left,
        misalignment: Math.abs(
          (document.querySelector('.grid-header')?.getBoundingClientRect().left || 0) -
          (document.querySelector('.grid-row')?.getBoundingClientRect().left || 0)
        )
      })
    })

    scrollerRef.value.addEventListener('scroll', () => {
      if (scrollerRef.value!.scrollLeft !== 0) {
        console.warn('⚠️ .scroller horizontal scroll DETECTED:', {
          scrollLeft: scrollerRef.value!.scrollLeft,
          message: 'This should NOT happen! Rows should not scroll horizontally inside .scroller'
        })
      }
    })
  }

  ---
  ZHRNUTIE RIEŠENÍ

  Pre COLUMN GROUPING (Header + Data bunky scrollujú spoločne):

  1. RIEŠENIE A - Wrapper element .table-inner:
    - ✅ ODPORÚČANÉ - najčistejšie riešenie
    - Zachováva column grouping
    - Jeden horizontal scroll
    - CSS validné
  2. RIEŠENIE B - Diagnostické logy:
    - Potvrdia problém s dvojitým scrollom
    - Ukážu CSS spec violation (overflow-x: auto conversion)
    - Ukážu misalignment medzi header a rows
  3. RIEŠENIE C - Scroll event listeners:
    - Real-time monitoring misalignmentu
    - Detekcia nežiadúceho .scroller horizontal scroll

  ---
  Čo teraz potrebujem:
  - Mám implementovať RIEŠENIE A (wrapper)?
  - Alebo najprv pridať logy (RIEŠENIE B + C) na potvrdenie diagnózy?

  DÔLEŽITÉ: Nebudem nič meniť, kým mi nepovieš!