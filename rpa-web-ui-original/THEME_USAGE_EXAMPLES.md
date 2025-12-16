# Theme Usage Examples

This document shows how to use the theming system in the DataGrid and ListBox components.

## Basic Usage - Using Default Theme

```vue
<template>
  <!-- DataGrid will use default light theme -->
  <DataGrid :config="gridConfig" grid-id="my-grid" />

  <!-- ListBox will use default light theme -->
  <ListBox :items="items" title="My List" />
</template>
```

## Using Predefined Themes

### Dark Theme

```vue
<script setup lang="ts">
import { darkDataGridTheme, darkListBoxTheme } from '@/composables/useTheme'

const customGridTheme = darkDataGridTheme
const customListTheme = darkListBoxTheme
</script>

<template>
  <DataGrid :config="gridConfig" :theme="customGridTheme" grid-id="dark-grid" />
  <ListBox :items="items" :theme="customListTheme" title="Dark List" />
</template>
```

### High Contrast Theme

```vue
<script setup lang="ts">
import { highContrastDataGridTheme, highContrastListBoxTheme } from '@/composables/useTheme'

const customGridTheme = highContrastDataGridTheme
const customListTheme = highContrastListBoxTheme
</script>

<template>
  <DataGrid :config="gridConfig" :theme="customGridTheme" grid-id="hc-grid" />
  <ListBox :items="items" :theme="customListTheme" title="HC List" />
</template>
```

## Customizing Specific Colors

### Override Cell Colors Only

```vue
<script setup lang="ts">
import type { DataGridTheme } from '@/types/theme'

const customGridTheme: Partial<DataGridTheme> = {
  cellColors: {
    defaultBackground: '#fff5f5',
    defaultForeground: '#333333',
    hoverBackground: '#ffe0e0',
    hoverForeground: '#000000',
    focusedBackground: '#ffcccc',
    focusedForeground: '#990000',
    disabledBackground: '#f0f0f0',
    disabledForeground: '#999999',
    readOnlyBackground: '#fafafa',
    readOnlyForeground: '#666666'
  }
}
</script>

<template>
  <DataGrid :config="gridConfig" :theme="customGridTheme" grid-id="custom-cells" />
</template>
```

### Override Validation Colors

```vue
<script setup lang="ts">
import type { DataGridTheme } from '@/types/theme'

const customGridTheme: Partial<DataGridTheme> = {
  validationColors: {
    errorBackground: '#ff0000',
    errorForeground: '#ffffff',
    errorBorder: '#990000',
    warningBackground: '#ffaa00',
    warningForeground: '#000000',
    warningBorder: '#cc8800',
    infoBackground: '#0099ff',
    infoForeground: '#ffffff',
    infoBorder: '#0066cc'
  }
}
</script>

<template>
  <DataGrid :config="gridConfig" :theme="customGridTheme" grid-id="custom-validation" />
</template>
```

### Override Special Column Colors

```vue
<script setup lang="ts">
import type { DataGridTheme } from '@/types/theme'

const customGridTheme: Partial<DataGridTheme> = {
  specialColumnColors: {
    rowNumberBackground: '#e0e0e0',
    rowNumberForeground: '#000000',
    checkboxBorder: '#999999',
    checkboxBackground: '#ffffff',
    checkboxForeground: '#333333',
    deleteRowBackground: 'transparent',
    deleteRowForeground: '#ff0000',
    deleteRowHoverBackground: '#ffcccc',
    insertRowBackground: 'transparent',
    insertRowForeground: '#00aa00',
    insertRowBorder: 'transparent',
    insertRowHoverBackground: '#ccffcc',
    insertRowHoverForeground: '#006600',
    validationAlertsErrorBackground: '#ffeeee',
    validationAlertsErrorForeground: '#cc0000'
  }
}
</script>

<template>
  <DataGrid :config="gridConfig" :theme="customGridTheme" grid-id="custom-special" />
</template>
```

### Combining Multiple Color Groups

```vue
<script setup lang="ts">
import type { DataGridTheme } from '@/types/theme'

const customGridTheme: Partial<DataGridTheme> = {
  cellColors: {
    defaultBackground: '#f9f9f9',
    defaultForeground: '#222222',
    hoverBackground: '#e8e8e8',
    hoverForeground: '#000000',
    focusedBackground: '#d0e8ff',
    focusedForeground: '#003366',
    disabledBackground: '#e0e0e0',
    disabledForeground: '#888888',
    readOnlyBackground: '#f5f5f5',
    readOnlyForeground: '#555555'
  },
  headerColors: {
    background: '#2c3e50',
    foreground: '#ecf0f1',
    hoverBackground: '#34495e',
    pressedBackground: '#1a252f',
    sortIndicatorColor: '#3498db'
  },
  borderColors: {
    cellBorder: '#d0d0d0',
    rowBorder: '#d0d0d0',
    columnBorder: '#b0b0b0',
    gridBorder: '#95a5a6',
    focusedCellBorder: '#3498db'
  }
}
</script>

<template>
  <DataGrid :config="gridConfig" :theme="customGridTheme" grid-id="custom-combined" />
</template>
```

## ListBox Custom Themes

### Custom Item Colors

```vue
<script setup lang="ts">
import type { ListBoxTheme } from '@/types/theme'

const customListTheme: Partial<ListBoxTheme> = {
  itemColors: {
    defaultBackground: '#ffffff',
    defaultForeground: '#333333',
    hoverBackground: '#f0f8ff',
    hoverForeground: '#000000',
    selectedBackground: '#4682b4',
    selectedForeground: '#ffffff',
    selectedHoverBackground: '#5a9bd4',
    selectedHoverForeground: '#ffffff',
    disabledBackground: '#e0e0e0',
    disabledForeground: '#999999'
  }
}
</script>

<template>
  <ListBox :items="items" :theme="customListTheme" title="Custom Items" />
</template>
```

### Custom Container and Borders

```vue
<script setup lang="ts">
import type { ListBoxTheme } from '@/types/theme'

const customListTheme: Partial<ListBoxTheme> = {
  containerColors: {
    background: '#fafafa',
    border: '#cccccc',
    focusedBorder: '#0066cc',
    titleForeground: '#2c3e50'
  },
  scrollbarColors: {
    trackBackground: '#e0e0e0',
    thumbBackground: '#999999',
    thumbHoverBackground: '#666666'
  }
}
</script>

<template>
  <ListBox :items="items" :theme="customListTheme" title="Custom Container" />
</template>
```

## Complete Custom Theme Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { DataGridTheme, ListBoxTheme } from '@/types/theme'

// Corporate Blue Theme
const corporateBlueGridTheme: Partial<DataGridTheme> = {
  cellColors: {
    defaultBackground: '#ffffff',
    defaultForeground: '#2c3e50',
    hoverBackground: '#ecf0f1',
    hoverForeground: '#2c3e50',
    focusedBackground: '#d6eaf8',
    focusedForeground: '#1a5490',
    disabledBackground: '#ecf0f1',
    disabledForeground: '#95a5a6',
    readOnlyBackground: '#f8f9fa',
    readOnlyForeground: '#7f8c8d'
  },
  rowColors: {
    evenRowBackground: '#ffffff',
    oddRowBackground: '#f8f9fa',
    hoverBackground: '#ecf0f1',
    selectedBackground: '#3498db',
    selectedForeground: '#ffffff',
    selectedInactiveBackground: '#bdc3c7',
    selectedInactiveForeground: '#34495e'
  },
  headerColors: {
    background: '#2c3e50',
    foreground: '#ecf0f1',
    hoverBackground: '#34495e',
    pressedBackground: '#1a252f',
    sortIndicatorColor: '#3498db'
  },
  validationColors: {
    errorBackground: '#fadbd8',
    errorForeground: '#c0392b',
    errorBorder: '#e74c3c',
    warningBackground: '#fcf3cf',
    warningForeground: '#d68910',
    warningBorder: '#f39c12',
    infoBackground: '#d6eaf8',
    infoForeground: '#1a5490',
    infoBorder: '#3498db'
  },
  selectionColors: {
    selectionBorder: '#3498db',
    selectionFill: 'rgba(52, 152, 219, 0.1)',
    multiSelectionBackground: '#d6eaf8',
    multiSelectionForeground: '#1a5490'
  },
  borderColors: {
    cellBorder: '#dfe6e9',
    rowBorder: '#dfe6e9',
    columnBorder: '#b2bec3',
    gridBorder: '#95a5a6',
    focusedCellBorder: '#3498db'
  },
  specialColumnColors: {
    rowNumberBackground: '#ecf0f1',
    rowNumberForeground: '#7f8c8d',
    checkboxBorder: '#95a5a6',
    checkboxBackground: '#ffffff',
    checkboxForeground: '#2c3e50',
    deleteRowBackground: 'transparent',
    deleteRowForeground: '#e74c3c',
    deleteRowHoverBackground: '#fadbd8',
    insertRowBackground: 'transparent',
    insertRowForeground: '#27ae60',
    insertRowBorder: 'transparent',
    insertRowHoverBackground: '#d5f4e6',
    insertRowHoverForeground: '#1e8449',
    validationAlertsErrorBackground: '#fadbd8',
    validationAlertsErrorForeground: '#c0392b'
  },
  uiControlColors: {
    resizeGripColor: '#3498db',
    menuBackground: '#ffffff',
    menuForeground: '#2c3e50',
    menuHoverBackground: '#ecf0f1',
    dialogBackground: '#ffffff',
    dialogForeground: '#2c3e50',
    dialogBorder: '#95a5a6',
    placeholderColor: '#95a5a6',
    searchPanelBackground: '#ecf0f1',
    searchPanelForeground: '#2c3e50',
    searchPanelBorder: '#95a5a6',
    filterRowBackground: '#ecf0f1',
    filterRowForeground: '#2c3e50',
    filterRowBorder: '#95a5a6',
    paginationBackground: '#f8f9fa',
    paginationForeground: '#2c3e50',
    paginationBorder: '#dfe6e9',
    paginationButtonHoverBackground: '#3498db'
  }
}

const corporateBlueListTheme: Partial<ListBoxTheme> = {
  itemColors: {
    defaultBackground: '#ffffff',
    defaultForeground: '#2c3e50',
    hoverBackground: '#ecf0f1',
    hoverForeground: '#2c3e50',
    selectedBackground: '#3498db',
    selectedForeground: '#ffffff',
    selectedHoverBackground: '#5dade2',
    selectedHoverForeground: '#ffffff',
    disabledBackground: '#ecf0f1',
    disabledForeground: '#95a5a6'
  },
  containerColors: {
    background: '#ffffff',
    border: '#95a5a6',
    focusedBorder: '#3498db',
    titleForeground: '#2c3e50'
  },
  checkboxColors: {
    border: '#95a5a6',
    background: '#ffffff',
    checkedBackground: '#3498db',
    checkedBorder: '#3498db',
    hoverBorder: '#7f8c8d'
  },
  scrollbarColors: {
    trackBackground: '#ecf0f1',
    thumbBackground: '#95a5a6',
    thumbHoverBackground: '#7f8c8d'
  }
}
</script>

<template>
  <div>
    <h2>Corporate Blue Theme</h2>
    <DataGrid
      :config="gridConfig"
      :theme="corporateBlueGridTheme"
      grid-id="corporate-grid"
    />

    <ListBox
      :items="items"
      :theme="corporateBlueListTheme"
      title="Corporate List"
    />
  </div>
</template>
```

## Dynamic Theme Switching

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  defaultDataGridTheme,
  darkDataGridTheme,
  highContrastDataGridTheme,
  defaultListBoxTheme,
  darkListBoxTheme,
  highContrastListBoxTheme
} from '@/composables/useTheme'
import type { DataGridTheme, ListBoxTheme } from '@/types/theme'

type ThemeName = 'light' | 'dark' | 'highContrast'

const currentTheme = ref<ThemeName>('light')

const gridThemes: Record<ThemeName, DataGridTheme> = {
  light: defaultDataGridTheme,
  dark: darkDataGridTheme,
  highContrast: highContrastDataGridTheme
}

const listThemes: Record<ThemeName, ListBoxTheme> = {
  light: defaultListBoxTheme,
  dark: darkListBoxTheme,
  highContrast: highContrastListBoxTheme
}

function switchTheme(theme: ThemeName) {
  currentTheme.value = theme
}
</script>

<template>
  <div>
    <div class="theme-switcher">
      <button @click="switchTheme('light')">Light Theme</button>
      <button @click="switchTheme('dark')">Dark Theme</button>
      <button @click="switchTheme('highContrast')">High Contrast</button>
    </div>

    <DataGrid
      :config="gridConfig"
      :theme="gridThemes[currentTheme]"
      grid-id="themed-grid"
    />

    <ListBox
      :items="items"
      :theme="listThemes[currentTheme]"
      title="Themed List"
    />
  </div>
</template>
```

## Available Color Properties

### DataGrid Theme

#### Cell Colors
- `defaultBackground`, `defaultForeground`
- `hoverBackground`, `hoverForeground`
- `focusedBackground`, `focusedForeground`
- `disabledBackground`, `disabledForeground`
- `readOnlyBackground`, `readOnlyForeground`

#### Row Colors
- `evenRowBackground`, `oddRowBackground`
- `hoverBackground`
- `selectedBackground`, `selectedForeground`
- `selectedInactiveBackground`, `selectedInactiveForeground`

#### Header Colors
- `background`, `foreground`
- `hoverBackground`, `pressedBackground`
- `sortIndicatorColor`

#### Validation Colors
- `errorBackground`, `errorForeground`, `errorBorder`
- `warningBackground`, `warningForeground`, `warningBorder`
- `infoBackground`, `infoForeground`, `infoBorder`

#### Selection Colors
- `selectionBorder`, `selectionFill`
- `multiSelectionBackground`, `multiSelectionForeground`

#### Border Colors
- `cellBorder`, `rowBorder`, `columnBorder`
- `gridBorder`, `focusedCellBorder`

#### Special Column Colors
- `rowNumberBackground`, `rowNumberForeground`
- `checkboxBorder`, `checkboxBackground`, `checkboxForeground`
- `deleteRowBackground`, `deleteRowForeground`, `deleteRowHoverBackground`
- `insertRowBackground`, `insertRowForeground`, `insertRowBorder`
- `insertRowHoverBackground`, `insertRowHoverForeground`
- `validationAlertsErrorBackground`, `validationAlertsErrorForeground`

#### UI Control Colors
- `resizeGripColor`
- `menuBackground`, `menuForeground`, `menuHoverBackground`
- `dialogBackground`, `dialogForeground`, `dialogBorder`
- `placeholderColor`
- `searchPanelBackground`, `searchPanelForeground`, `searchPanelBorder`
- `filterRowBackground`, `filterRowForeground`, `filterRowBorder`
- `paginationBackground`, `paginationForeground`, `paginationBorder`
- `paginationButtonHoverBackground`

### ListBox Theme

#### Item Colors
- `defaultBackground`, `defaultForeground`
- `hoverBackground`, `hoverForeground`
- `selectedBackground`, `selectedForeground`
- `selectedHoverBackground`, `selectedHoverForeground`
- `disabledBackground`, `disabledForeground`

#### Container Colors
- `background`, `border`, `focusedBorder`
- `titleForeground`

#### Checkbox Colors
- `border`, `background`
- `checkedBackground`, `checkedBorder`
- `hoverBorder`

#### Scrollbar Colors
- `trackBackground`
- `thumbBackground`, `thumbHoverBackground`
