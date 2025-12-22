<!--
  ✅ RIEŠENIE #5: DEMO APP.VUE JE ZAKOMENTOVANÉ

  Toto je DEMO App.vue pre vývoj knižnice rpa-web-ui.
  Produkčná aplikácia je v: RB0120Desktop/frontend/src/App.vue

  Všetok demo kód je zakomentovaný aby knižnica nemala vlastný "default template".
  Ak potrebuješ spustiť demo pre vývoj/testovanie, odkomentuj kód nižšie.
-->
<template>
  <div class="demo-disabled">
    <h1>📦 RPA Web UI Library - Demo</h1>
    <div class="info-box">
      <h2>ℹ️ Demo App is Disabled</h2>
      <p><strong>This is the library demo App.vue (NOT production!)</strong></p>
      <p>🎯 Production app is located at:</p>
      <code>RB0120Desktop/frontend/src/App.vue</code>
      <p class="note">💡 Uncomment code in this file to enable demo for development/testing</p>
    </div>
  </div>
</template>

<style>
.demo-disabled {
  padding: 60px 40px;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

.demo-disabled h1 {
  font-size: 36px;
  margin-bottom: 40px;
  font-weight: 700;
}

.info-box {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 40px;
  border-radius: 12px;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.info-box h2 {
  margin-bottom: 20px;
  color: #667eea;
}

.info-box p {
  margin: 15px 0;
  font-size: 16px;
  line-height: 1.6;
}

.info-box code {
  display: block;
  background: #f5f5f5;
  padding: 12px 20px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin: 20px 0;
  color: #d63384;
  font-weight: 600;
}

.info-box .note {
  margin-top: 30px;
  font-style: italic;
  color: #666;
  font-size: 14px;
}
</style>
<!--
═══════════════════════════════════════════════════════════════════════════════
ZAKOMENTOVANÝ DEMO KÓD - Odkomentuj ak potrebuješ spustiť demo
═══════════════════════════════════════════════════════════════════════════════

<template>
  <div id="app">
    <h1>RPA Advanced Data Grid - Demo</h1>

    ... celý template ...

  </div>
</template>

<script setup lang="ts">
// Demo imports
// import { ref, onMounted, onUnmounted } from 'vue'
// import DataGrid from './components/DataGrid.vue'
// import SearchPanel from './components/SearchPanel.vue'
// import FilterRow from './components/FilterRow.vue'
// import ListBox, { type ListBoxItem } from './components/ListBox.vue'
// import { useDataGridStore } from './stores/dataGridStore'
// import { gridApi } from './services/gridApi'

// ... celý script ...

</script>

<style>
// ... celý style ...
</style>

═══════════════════════════════════════════════════════════════════════════════
KONIEC ZAKOMENTOVANÉHO KÓDU
═══════════════════════════════════════════════════════════════════════════════
-->
