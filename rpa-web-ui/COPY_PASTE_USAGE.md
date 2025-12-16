# Copy/Paste & Keyboard Shortcuts Usage

## Overview

The DataGrid now has Excel-like Copy/Paste functionality with Tab-Separated Values (TSV) format and comprehensive keyboard shortcut support.

## Features

### ✅ Excel-like TSV Format
- Normal cells: separated by `\t` (no quotes)
- Multiline cells: wrapped in quotes `"Multi\nLine\nCell"`
- Cells with tabs: wrapped in quotes `"Cell\tWith\tTabs"`
- Cells with quotes: quotes doubled AND wrapped `"Cell with ""quote"""`

### ✅ Keyboard Shortcuts
- **Ctrl+C**: Copy selected cells
- **Ctrl+V**: Paste from clipboard
- **Ctrl+X**: Cut selected cells (copy + delete content)
- **Delete**: Delete content of selected cells
- **Ctrl+A**: Select all cells
- **Ctrl+F**: Open find dialog (pending implementation)

## How to Test

### 1. Basic Copy/Paste

1. **Open the application** in your browser: http://localhost:5173/
2. **Select cells** by clicking and dragging over multiple cells in the main grid
3. **Press Ctrl+C** to copy selected cells
4. **Click on a target cell** to select paste location
5. **Press Ctrl+V** to paste

You should see the data pasted at the target location.

### 2. Testing Multiline Cells

1. **Edit a cell** by double-clicking it
2. **Enter multiline text** by typing text with line breaks (Shift+Enter if in textarea)
3. **Press Ctrl+C** to copy the cell
4. **Press Ctrl+V** to paste elsewhere

The multiline content should be preserved exactly as entered.

### 3. Testing Cells with Tabs

1. **Edit a cell** and enter text containing tab characters
2. **Copy the cell** with Ctrl+C
3. **Paste it** with Ctrl+V

The tab characters should be preserved within the cell.

### 4. Testing Cells with Quotes

1. **Edit a cell** and enter text like: `My text with "quoted" words`
2. **Copy the cell** with Ctrl+C
3. **Paste it** with Ctrl+V

The quotes should be preserved exactly as entered.

### 5. Testing Copy/Paste Between Excel and DataGrid

#### From DataGrid to Excel:
1. **Select cells** in the DataGrid
2. **Press Ctrl+C**
3. **Open Microsoft Excel** or Google Sheets
4. **Click on a cell** in Excel
5. **Press Ctrl+V**

The data should paste correctly into Excel with proper formatting.

#### From Excel to DataGrid:
1. **Open Microsoft Excel** with some data
2. **Select cells** in Excel (including cells with multiline text, tabs, etc.)
3. **Press Ctrl+C** in Excel
4. **Go to the DataGrid** in your browser
5. **Click on a target cell**
6. **Press Ctrl+V**

The data from Excel should paste correctly into the DataGrid.

### 6. Testing Cut Operation

1. **Select cells** in the DataGrid
2. **Press Ctrl+X** to cut
3. Selected cells should be cleared
4. **Click elsewhere** and press Ctrl+V
5. The data should appear at the new location

### 7. Testing Delete

1. **Select cells** in the DataGrid
2. **Press Delete**
3. The selected cells should be cleared (content deleted)

### 8. Testing Select All

1. **Press Ctrl+A** anywhere in the grid
2. All cells should become selected

## Browser Console Messages

When testing, open the browser console (F12) to see operation messages:

```
Copied 3 rows to clipboard
Pasted 3 rows from clipboard
```

## Technical Details

### TSV Escaping Rules

The implementation follows Excel's TSV format exactly:

1. **Check if quoting needed**: If value contains `\t`, `\n`, `\r`, or `"`
2. **Escape quotes**: Replace `"` with `""`
3. **Wrap in quotes**: Add quotes around the escaped value

### TSV Parsing Rules

Character-by-character parsing (not split-based) to handle embedded delimiters:

1. **Quote tracking**: Maintains `inQuotes` state
2. **Inside quotes**: Tabs and newlines are part of cell content
3. **Outside quotes**: Tabs = column separator, newlines = row separator
4. **Escaped quotes**: `""` becomes `"`

### Example TSV Format

**Input data:**
```
Name           | Description
John Doe       | Works at "Company\nInc."
Jane Smith     | Uses\ttabs
```

**TSV format (copied to clipboard):**
```tsv
Name	Description
John Doe	"Works at ""Company\nInc."""
Jane Smith	Uses\ttabs
```

**After pasting:**
- Cell "Description" for John: `Works at "Company\nInc."` (preserved quotes and newline)
- Cell "Description" for Jane: `Uses\ttabs` (preserved tab character)

## Known Limitations

1. **Read-only cells** cannot be modified via paste (they are skipped)
2. **Special columns** (row number, checkbox, validation alerts, delete, insert) are not included in copy/paste
3. **Paste extends grid**: If pasting more rows than available, new rows are automatically added

## Programmatic API

You can also use copy/paste programmatically:

```vue
<script setup>
import { ref } from 'vue'

const gridRef = ref(null)

function copyData() {
  gridRef.value?.handleCopy()
}

function pasteData() {
  gridRef.value?.handlePaste()
}

function cutData() {
  gridRef.value?.handleCut()
}
</script>

<template>
  <div>
    <button @click="copyData">Copy</button>
    <button @click="pasteData">Paste</button>
    <button @click="cutData">Cut</button>

    <DataGrid ref="gridRef" :config="config" grid-id="my-grid" />
  </div>
</template>
```

## Troubleshooting

### Copy doesn't work
- **Solution**: Make sure cells are selected before pressing Ctrl+C
- Check browser console for "No rows selected for copy" warning

### Paste doesn't work
- **Solution**: Make sure you've copied something first
- Check browser permissions for clipboard access

### Multiline text not preserved
- **Solution**: This is a browser clipboard limitation in some cases
- Try pasting into Excel first to verify the clipboard format

### Paste overwrites wrong cells
- **Solution**: Click on the target cell first before pasting
- The paste operation starts at the first selected cell

## Future Enhancements

- [ ] Paste mode selection (Insert vs Overwrite vs Append)
- [ ] Copy with/without headers option in UI
- [ ] Visual feedback during copy (selected cells highlight)
- [ ] Clipboard preview dialog
- [ ] Undo/Redo support for paste operations
- [ ] Copy/Paste of formatting (colors, styles)
- [ ] CSV format support (in addition to TSV)
