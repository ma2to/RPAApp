# Theming System Documentation

## Overview

The theming system provides comprehensive color customization for both DataGrid and ListBox components. It is inspired by the WinUI3 AdvancedDataGrid theming system and offers two levels of API:

1. **Simple API** - Easy-to-use theme objects organized by component area
2. **Advanced API** - Comprehensive state-based theming (future enhancement)

## Features

✅ **Default Themes**
- Light (default)
- Dark
- High Contrast

✅ **Customizable Colors**
- All colors have sensible defaults
- All colors can be overridden via props
- Partial theme objects supported (only override what you need)

✅ **CSS Variables**
- All colors are exposed as CSS custom properties
- Themes are applied via inline styles on root elements
- Child components automatically inherit theme

✅ **Independent Instances**
- Each DataGrid instance can have its own theme
- Each ListBox instance can have its own theme
- No shared theme state between components

## Implementation

### Files Created

1. **`src/types/theme.ts`** - TypeScript interfaces for all theme types
   - `DataGridTheme` - Simple API for DataGrid
   - `ListBoxTheme` - Simple API for ListBox
   - `ComprehensiveDataGridTheme` - Advanced state-based API (for future)
   - `ComprehensiveListBoxTheme` - Advanced state-based API (for future)

2. **`src/composables/useTheme.ts`** - Theme composable with defaults
   - `defaultDataGridTheme` - Light theme for DataGrid
   - `defaultListBoxTheme` - Light theme for ListBox
   - `darkDataGridTheme` - Dark theme for DataGrid
   - `darkListBoxTheme` - Dark theme for ListBox
   - `highContrastDataGridTheme` - High contrast theme for DataGrid
   - `highContrastListBoxTheme` - High contrast theme for ListBox
   - `generateDataGridCSSVariables()` - Converts theme to CSS variables
   - `generateListBoxCSSVariables()` - Converts theme to CSS variables

3. **Documentation**
   - `THEME_USAGE_EXAMPLES.md` - Comprehensive examples
   - `THEMING_SYSTEM.md` - This file

### Components Updated

All components now use CSS variables instead of hard-coded colors:

- ✅ `DataGrid.vue` - Accepts `theme` prop, generates CSS variables
- ✅ `DataGridCell.vue` - Uses CSS variables for all states
- ✅ `DataGridHeader.vue` - Uses CSS variables for header colors
- ✅ `DataGridRow.vue` - Inherits colors from parent
- ✅ `SpecialColumnCell.vue` - Uses CSS variables for special columns
- ✅ `PaginationControl.vue` - Uses CSS variables for pagination
- ✅ `ListBox.vue` - Accepts `theme` prop, generates CSS variables

### Components NOT Updated (Yet)

These components don't have theming yet:
- ⏳ `FilterRow.vue` - TODO
- ⏳ `SearchPanel.vue` - TODO

## Usage

### Basic Usage (Default Theme)

```vue
<template>
  <DataGrid :config="config" grid-id="my-grid" />
  <ListBox :items="items" title="My List" />
</template>
```

### Using Dark Theme

```vue
<script setup>
import { darkDataGridTheme, darkListBoxTheme } from '@/composables/useTheme'
</script>

<template>
  <DataGrid :config="config" :theme="darkDataGridTheme" grid-id="dark-grid" />
  <ListBox :items="items" :theme="darkListBoxTheme" title="Dark List" />
</template>
```

### Custom Colors

```vue
<script setup>
const customTheme = {
  cellColors: {
    defaultBackground: '#f0f8ff',
    focusedBackground: '#e0e8ff'
  },
  headerColors: {
    background: '#2c3e50',
    foreground: '#ffffff'
  }
}
</script>

<template>
  <DataGrid :config="config" :theme="customTheme" grid-id="custom-grid" />
</template>
```

See `THEME_USAGE_EXAMPLES.md` for more examples.

## Color Properties

### DataGrid Theme Structure

```typescript
{
  cellColors: { /* 10 properties */ },
  rowColors: { /* 7 properties */ },
  headerColors: { /* 5 properties */ },
  validationColors: { /* 9 properties */ },
  selectionColors: { /* 4 properties */ },
  borderColors: { /* 5 properties */ },
  specialColumnColors: { /* 14 properties */ },
  uiControlColors: { /* 18 properties */ }
}
```

**Total: 72 customizable color properties for DataGrid**

### ListBox Theme Structure

```typescript
{
  itemColors: { /* 10 properties */ },
  containerColors: { /* 4 properties */ },
  checkboxColors: { /* 5 properties */ },
  scrollbarColors: { /* 3 properties */ }
}
```

**Total: 22 customizable color properties for ListBox**

## CSS Variables

All colors are mapped to CSS custom properties with fallback values:

### DataGrid Variables

```css
/* Cell Colors */
--dg-cell-bg
--dg-cell-fg
--dg-cell-hover-bg
--dg-cell-hover-fg
--dg-cell-focused-bg
--dg-cell-focused-fg
--dg-cell-disabled-bg
--dg-cell-disabled-fg
--dg-cell-readonly-bg
--dg-cell-readonly-fg

/* Row Colors */
--dg-row-even-bg
--dg-row-odd-bg
--dg-row-hover-bg
--dg-row-selected-bg
--dg-row-selected-fg
--dg-row-selected-inactive-bg
--dg-row-selected-inactive-fg

/* Header Colors */
--dg-header-bg
--dg-header-fg
--dg-header-hover-bg
--dg-header-pressed-bg
--dg-header-sort-indicator

/* Validation Colors */
--dg-validation-error-bg
--dg-validation-error-fg
--dg-validation-error-border
--dg-validation-warning-bg
--dg-validation-warning-fg
--dg-validation-warning-border
--dg-validation-info-bg
--dg-validation-info-fg
--dg-validation-info-border

/* Selection Colors */
--dg-selection-border
--dg-selection-fill
--dg-multi-selection-bg
--dg-multi-selection-fg

/* Border Colors */
--dg-border-cell
--dg-border-row
--dg-border-column
--dg-border-grid
--dg-border-focused-cell

/* Special Column Colors */
--dg-special-rownumber-bg
--dg-special-rownumber-fg
--dg-special-checkbox-border
--dg-special-checkbox-bg
--dg-special-checkbox-fg
--dg-special-delete-bg
--dg-special-delete-fg
--dg-special-delete-hover-bg
--dg-special-insert-bg
--dg-special-insert-fg
--dg-special-insert-border
--dg-special-insert-hover-bg
--dg-special-insert-hover-fg
--dg-special-validation-error-bg
--dg-special-validation-error-fg

/* UI Control Colors */
--dg-ui-resize-grip
--dg-ui-menu-bg
--dg-ui-menu-fg
--dg-ui-menu-hover-bg
--dg-ui-dialog-bg
--dg-ui-dialog-fg
--dg-ui-dialog-border
--dg-ui-placeholder
--dg-ui-search-bg
--dg-ui-search-fg
--dg-ui-search-border
--dg-ui-filter-bg
--dg-ui-filter-fg
--dg-ui-filter-border
--dg-ui-pagination-bg
--dg-ui-pagination-fg
--dg-ui-pagination-border
--dg-ui-pagination-button-hover-bg
```

### ListBox Variables

```css
/* Item Colors */
--lb-item-bg
--lb-item-fg
--lb-item-hover-bg
--lb-item-hover-fg
--lb-item-selected-bg
--lb-item-selected-fg
--lb-item-selected-hover-bg
--lb-item-selected-hover-fg
--lb-item-disabled-bg
--lb-item-disabled-fg

/* Container Colors */
--lb-container-bg
--lb-container-border
--lb-container-focused-border
--lb-title-fg

/* Checkbox Colors */
--lb-checkbox-border
--lb-checkbox-bg
--lb-checkbox-checked-bg
--lb-checkbox-checked-border
--lb-checkbox-hover-border

/* Scrollbar Colors */
--lb-scrollbar-track-bg
--lb-scrollbar-thumb-bg
--lb-scrollbar-thumb-hover-bg
```

## Comparison with WinUI3 Original

### Similarities ✅

- Two-level API (Simple + Advanced)
- Organized by component area (Cell, Row, Header, etc.)
- All states covered (Normal, Hover, Focused, Disabled, etc.)
- Predefined themes (Light, Dark, High Contrast)
- Complete color customization
- Default values provided
- Override mechanism via props

### Differences

- **Implementation**: WinUI3 uses C# ResourceDictionaries, Vue3 uses TypeScript + CSS Variables
- **State Management**: WinUI3 uses dependency properties, Vue3 uses reactive props
- **CSS Integration**: WinUI3 uses XAML styling, Vue3 uses scoped CSS with var()
- **Comprehensive API**: Not yet implemented in Vue3 (planned for future)

## Future Enhancements

1. **Comprehensive State-Based API**
   - Implement `ComprehensiveDataGridTheme`
   - Implement `ComprehensiveListBoxTheme`
   - Add element-specific color sets
   - Add state-specific color sets

2. **Additional Components**
   - Add theming to `FilterRow`
   - Add theming to `SearchPanel`

3. **Theme Builder**
   - Interactive theme editor UI
   - Live preview
   - Export/import theme JSON

4. **Accessibility**
   - WCAG contrast checking
   - High contrast mode auto-detection
   - Screen reader friendly color descriptions

## Notes

- All colors support any valid CSS color format (hex, rgb, rgba, hsl, named colors)
- CSS variables have fallback values matching default light theme
- Theme changes are reactive and update immediately
- Themes are scoped to component instances (no global theme state)
- Partial theme objects are supported (only override what you need)
