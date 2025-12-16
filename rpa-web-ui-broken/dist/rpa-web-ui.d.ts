import { App } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { DefineComponent } from 'vue';
import { PromisifyFn } from '@vueuse/shared';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import * as signalR_2 from '@microsoft/signalr';
import { StoreDefinition } from 'pinia';

declare type __VLS_Props = {
    config?: any;
    columns?: GridColumn[];
    gridId?: string;
    theme?: Partial<DataGridTheme>;
    minTableWidth?: number;
    width?: string;
    height?: string;
    autoRowHeightEnabled?: boolean;
};

declare type __VLS_Props_2 = {
    items: ListBoxItem[];
    title?: string;
    multiSelect?: boolean;
    preSelected?: string[];
    height?: number;
    width?: number;
    theme?: Partial<ListBoxTheme>;
};

export declare interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    rowCount?: number;
}

/**
 * Auto Row Height Composable
 *
 * Calculates row heights based on cell content and text wrapping
 */
declare interface AutoRowHeightConfig {
    minHeight: number;
    maxHeight: number;
    fontFamily: string;
    fontSize: number;
    enableWrapping: boolean;
    padding: number;
}

export declare interface BorderColors {
    cellBorder: string;
    rowBorder: string;
    columnBorder: string;
    gridBorder: string;
    focusedCellBorder: string;
}

export declare interface ButtonElementColors {
    normal: ColorSet;
    hover: ColorSet;
    pressed: ColorSet;
    disabled: ColorSet;
}

declare interface CellAddress {
    rowId: string;
    columnName: string;
}

export declare interface CellColors {
    defaultBackground: string;
    defaultForeground: string;
    hoverBackground: string;
    hoverForeground: string;
    focusedBackground: string;
    focusedForeground: string;
    disabledBackground: string;
    disabledForeground: string;
    readOnlyBackground: string;
    readOnlyForeground: string;
}

export declare interface CellElementColors {
    normal: ColorSet;
    hover: ColorSet;
    focused: ColorSet;
    editing: ColorSet;
    readOnly: ColorSet;
    disabled: ColorSet;
    selected: ColorSet;
    error: ColorSet;
    warning: ColorSet;
}

declare function checkBackendConnection(): Promise<void>;

/**
 * Theme Types for DataGrid and ListBox Components
 * Based on WinUI3 AdvancedDataGrid theming system
 */
export declare interface ColorSet {
    background: string;
    foreground: string;
    border: string;
}

export declare interface ComprehensiveDataGridTheme {
    header: HeaderElementColors;
    cell: CellElementColors;
    row: RowElementColors;
    grid: GridElementColors;
    filterRow: FilterRowElementColors;
    searchPanel: SearchPanelElementColors;
    pagination: PaginationElementColors;
    specialColumn: SpecialColumnElementColors;
}

export declare interface ComprehensiveListBoxTheme {
    container: ColorSet;
    item: {
        normal: ColorSet;
        hover: ColorSet;
        selected: ColorSet;
        selectedHover: ColorSet;
        disabled: ColorSet;
    };
    checkbox: {
        normal: ColorSet;
        checked: ColorSet;
        hover: ColorSet;
    };
    scrollbar: {
        track: ColorSet;
        thumb: ColorSet;
        thumbHover: ColorSet;
    };
    title: {
        foreground: string;
    };
}

declare interface CopyPasteOptions {
    includeHeaders?: boolean;
}

declare interface CopyPasteResult {
    success: boolean;
    message?: string;
    processedRows?: number;
}

declare interface DataGridStoreInterface {
    checkedRows: string[];
    isRowChecked(rowId: string): boolean;
}

export declare interface DataGridTheme {
    cellColors: CellColors;
    rowColors: RowColors;
    headerColors: HeaderColors;
    validationColors: ValidationColors;
    selectionColors: SelectionColors;
    borderColors: BorderColors;
    specialColumnColors: SpecialColumnColors;
    uiControlColors: UIControlColors;
}

declare const _default: DefineComponent<__VLS_Props, {
validation: {
/**
* Validates only cells that need validation (changed or unvalidated)
* Returns true if all non-empty cells are valid
* Respects autoValidate config
*/
validateRequired(): Promise<boolean>;
/**
* Checks if all non-empty rows are valid (without running validation)
* Returns true if valid, false if there are errors
*/
isAllValid(): boolean;
/**
* Forces validation of all cells regardless of tracking
* Returns true if all non-empty cells are valid
*/
validateAll(rows?: any[]): Promise<{
isValid: boolean;
totalErrors: number;
}>;
validationRules: Ref<Map<string, {
columnName: string;
ruleType: "Required" | "Regex" | "Range" | "Custom";
errorMessage: string;
regexPattern?: string | undefined;
minValue?: any;
maxValue?: any;
severity: "Info" | "Warning" | "Error" | "Critical";
customValidator?: ((value: any) => boolean) | undefined;
}[]> & Omit<Map<string, ValidationRule_2[]>, keyof Map<any, any>>, Map<string, ValidationRule_2[]> | (Map<string, {
columnName: string;
ruleType: "Required" | "Regex" | "Range" | "Custom";
errorMessage: string;
regexPattern?: string | undefined;
minValue?: any;
maxValue?: any;
severity: "Info" | "Warning" | "Error" | "Critical";
customValidator?: ((value: any) => boolean) | undefined;
}[]> & Omit<Map<string, ValidationRule_2[]>, keyof Map<any, any>>)>;
validationErrors: Record<string, ValidationError[]>;
errorCount: Ref<number, number>;
ruleCount: Ref<number, number>;
addValidationRule: (rule: ValidationRule_2) => void;
validateCell: (rowId: string, columnName: string, value: any) => ValidationResult;
validateCellThrottled: PromisifyFn<(rowId: string, columnName: string, value: any, rowCells?: Array<{
columnName: string;
value: any;
}>) => void>;
getValidationErrors: (rowId: string) => ValidationError[];
clearValidationErrors: () => void;
};
copyPaste: {
copyToClipboard: (rows: GridRow_2[], columnNames: string[], options?: CopyPasteOptions) => Promise<CopyPasteResult>;
copySelectedCells: (selectedCells: Set<string>, allRows: GridRow_2[], allColumns: {
name: string;
}[]) => Promise<CopyPasteResult>;
pasteFromClipboard: () => Promise<CopyPasteResult & {
rows?: Record<string, any>[];
headers?: string[];
}>;
canPaste: () => boolean;
clearClipboard: () => void;
};
shortcuts: {
registerShortcut: (definition: ShortcutDefinition) => void;
registerShortcuts: (definitions: ShortcutDefinition[]) => void;
unregisterShortcut: (key: KeyCombination) => boolean;
unregisterShortcutByName: (name: string) => boolean;
setShortcutEnabled: (name: string, enabled: boolean) => void;
getShortcuts: () => ShortcutDefinition[];
getShortcutsByContext: (context: ShortcutContext) => ShortcutDefinition[];
clearShortcuts: () => void;
handleKeyDown: (event: KeyboardEvent) => Promise<void>;
};
handleCopy: () => Promise<void>;
handlePaste: () => Promise<void>;
handleCut: () => Promise<void>;
loadDataFromBackend: typeof loadDataFromBackend;
saveDataToBackend: typeof saveDataToBackend;
checkBackendConnection: typeof checkBackendConnection;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {
scrollerRef: any;
}, HTMLDivElement>;
export { _default as AdvancedTable }
export { _default as DataGrid }

export declare interface ElementStates {
    normal: ColorSet;
    hover: ColorSet;
    pressed: ColorSet;
    focused: ColorSet;
    editing: ColorSet;
    error: ColorSet;
    warning: ColorSet;
    success: ColorSet;
    readOnly: ColorSet;
    disabled: ColorSet;
    selected: ColorSet;
    active: ColorSet;
    alert: ColorSet;
}

declare interface ExportOptions {
    includeHiddenColumns?: boolean;
    includeSpecialColumns?: boolean;
    onlySelectedRows?: boolean;
    prettify?: boolean;
}

declare interface ExportResult {
    success: boolean;
    rowsExported: number;
    message: string;
}

declare interface FilterExpression {
    type: 'simple' | 'composite';
}

export declare interface FilterRowElementColors {
    container: ColorSet;
    input: ColorSet;
    inputFocused: ColorSet;
    button: ButtonElementColors;
}

export declare const gridApi: GridApiService;

declare class GridApiService {
    private isHostMode;
    constructor();
    /**
     * Detect if running in WebView2 with gridApi bridge
     */
    private detectHostMode;
    /**
     * Call gridApi method (WebView2 mode with postMessage bridge)
     */
    private callHostApi;
    /**
     * HTTP request (development mode)
     */
    private request;
    /**
     * Get grid data from backend
     */
    getData(): Promise<ApiResponse<GridRow[]>>;
    /**
     * Import data to backend (replaces existing data)
     */
    importData(data: GridRow[]): Promise<ApiResponse<void>>;
    /**
     * Export data from backend
     */
    exportData(options?: {
        onlyFiltered?: boolean;
        filteredRowIds?: string[];
        columnNames?: string[];
    }): Promise<ApiResponse<GridRow[]>>;
    /**
     * Get grid configuration
     */
    getConfig(): Promise<ApiResponse<GridConfig>>;
    /**
     * Set validation rules
     */
    setValidationRules(rules: ValidationRule[]): Promise<ApiResponse<void>>;
    /**
     * Get validation rules
     */
    getValidationRules(): Promise<ApiResponse<ValidationRule[]>>;
    /**
     * Get column definitions with full metadata
     */
    getColumns(): Promise<ApiResponse<GridColumn[]>>;
    /**
     * Get current data (alias for getData)
     */
    getCurrentData(): Promise<ApiResponse<GridRow[]>>;
    /**
     * Get all column names (data columns + checkbox special column)
     */
    getColumnNames(): Promise<ApiResponse<string[]>>;
    /**
     * Health check
     */
    healthCheck(): Promise<boolean>;
}

export declare interface GridCell {
    rowId: string;
    columnName: string;
    value: any;
    isSelected: boolean;
    isValidationError: boolean;
    validationMessage?: string;
}

declare interface GridCell_2 {
    rowId: string;
    columnName: string;
    value: any;
    isSelected: boolean;
    isValidationError: boolean;
    validationMessage?: string;
}

export declare interface GridColumn {
    name: string;
    header: string;
    width: number;
    minWidth: number;
    maxWidth: number;
    isVisible: boolean;
    isReadOnly: boolean;
    isSortable: boolean;
    isFilterable: boolean;
    autoWidth?: boolean;
    specialType?: 'RowNumber' | 'Checkbox' | 'ValidationAlerts' | 'DeleteRow' | 'InsertRow';
    dataType?: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time';
    visibleForGrid?: boolean;
}

export declare interface GridConfig {
    pageSize: number;
    enableSort: boolean;
    enableFilter: boolean;
    enableSearch: boolean;
    enableValidation: boolean;
    showRowNumber: boolean;
    showCheckbox: boolean;
    showValidationAlerts: boolean;
    minRowHeight: number;
    maxRowHeight: number;
}

declare interface GridConfig_2 {
    pageSize: number;
    pageSizeOptions?: number[];
    enableSort: boolean;
    enableFilter: boolean;
    enableSearch: boolean;
    enableValidation: boolean;
    autoValidate: boolean;
    showRowNumber: boolean;
    showCheckbox: boolean;
    showValidationAlerts: boolean;
    showDeleteButton: boolean;
    showInsertButton: boolean;
}

export declare interface GridElementColors {
    container: ColorSet;
    border: ColorSet;
    scrollbar: {
        track: ColorSet;
        thumb: ColorSet;
        thumbHover: ColorSet;
    };
}

export declare interface GridRow {
    [key: string]: any;
    Checkbox?: boolean;
}

declare interface GridRow_2 {
    rowId: string;
    rowIndex: number;
    height: number;
    cells: GridCell[];
}

declare interface GridRow_3 {
    rowId: string;
    rowIndex: number;
    height: number;
    cells: GridCell_2[];
    validationErrorCount?: number;
}

export declare interface HeaderColors {
    background: string;
    foreground: string;
    hoverBackground: string;
    pressedBackground: string;
    sortIndicatorColor: string;
}

export declare interface HeaderElementColors {
    normal: ColorSet;
    hover: ColorSet;
    pressed: ColorSet;
    focused: ColorSet;
    sorted: ColorSet;
    filtered: ColorSet;
}

/**
 * Import/Export Composable
 *
 * Provides JSON import/export functionality for grid data
 */
declare enum ImportMode {
    Append = "append",// Add to existing data
    Replace = "replace",// Clear and replace all data
    Merge = "merge"
}

declare interface ImportOptions {
    mode: ImportMode;
    validateSchema?: boolean;
}

declare interface ImportResult {
    success: boolean;
    rowsImported: number;
    rowsSkipped: number;
    errors: string[];
    message: string;
    rows?: Record<string, any>[];
}

declare interface KeyCombination {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}

export declare const ListBox: DefineComponent<__VLS_Props_2, {
getSelectedValues: () => string[];
clearSelection: () => void;
selectValue: (value: string) => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
selectionChange: (selectedValues: string[]) => any;
}, string, PublicProps, Readonly<__VLS_Props_2> & Readonly<{
onSelectionChange?: ((selectedValues: string[]) => any) | undefined;
}>, {
height: number;
width: number;
title: string;
multiSelect: boolean;
preSelected: string[];
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare interface ListBoxCheckboxColors {
    border: string;
    background: string;
    checkedBackground: string;
    checkedBorder: string;
    hoverBorder: string;
}

export declare interface ListBoxContainerColors {
    background: string;
    border: string;
    focusedBorder: string;
    titleForeground: string;
}

declare interface ListBoxItem {
    name: string;
    value: string;
}

export declare interface ListBoxItemColors {
    defaultBackground: string;
    defaultForeground: string;
    hoverBackground: string;
    hoverForeground: string;
    selectedBackground: string;
    selectedForeground: string;
    selectedHoverBackground: string;
    selectedHoverForeground: string;
    disabledBackground: string;
    disabledForeground: string;
}

export declare interface ListBoxScrollbarColors {
    trackBackground: string;
    thumbBackground: string;
    thumbHoverBackground: string;
}

export declare interface ListBoxTheme {
    itemColors: ListBoxItemColors;
    containerColors: ListBoxContainerColors;
    checkboxColors: ListBoxCheckboxColors;
    scrollbarColors: ListBoxScrollbarColors;
}

declare function loadDataFromBackend(): Promise<void>;

export declare interface PaginationElementColors {
    container: ColorSet;
    button: ButtonElementColors;
    currentPage: ColorSet;
    input: ColorSet;
}

export declare interface RowColors {
    evenRowBackground: string;
    oddRowBackground: string;
    hoverBackground: string;
    selectedBackground: string;
    selectedForeground: string;
    selectedInactiveBackground: string;
    selectedInactiveForeground: string;
}

export declare interface RowElementColors {
    even: ColorSet;
    odd: ColorSet;
    hover: ColorSet;
    selected: ColorSet;
    selectedInactive: ColorSet;
}

declare interface RowHeightResult {
    rowId: string;
    calculatedHeight: number;
    isSuccess: boolean;
}

export declare const RpaWebUIPlugin: {
    install(app: App): void;
};

declare function saveDataToBackend(): Promise<void>;

declare interface SearchMatch {
    rowId: string;
    columnName: string;
    value: string;
}

declare type SearchMode = 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith' | 'Regex' | 'Fuzzy';

declare interface SearchOptions {
    caseSensitive?: boolean;
    fuzzyThreshold?: number;
}

export declare interface SearchPanelElementColors {
    container: ColorSet;
    input: ColorSet;
    inputFocused: ColorSet;
    button: ButtonElementColors;
    matchHighlight: ColorSet;
}

export declare interface SelectionColors {
    selectionBorder: string;
    selectionFill: string;
    multiSelectionBackground: string;
    multiSelectionForeground: string;
}

/**
 * Keyboard Shortcuts Composable
 *
 * Provides keyboard shortcut registration and handling with context support
 */
declare enum ShortcutContext {
    Normal = "normal",
    Editing = "editing",
    Selection = "selection",
    Any = "any"
}

declare interface ShortcutDefinition {
    name: string;
    key: KeyCombination;
    handler: (event: KeyboardEvent) => void | Promise<void>;
    context?: ShortcutContext;
    enabled?: boolean;
    priority?: number;
    description?: string;
}

declare interface ShortcutOptions {
    enabled?: boolean;
    context?: ShortcutContext;
}

declare interface SignalROptions {
    hubUrl?: string;
    autoReconnect?: boolean;
}

declare interface SortColumn {
    columnName: string;
    direction: 'asc' | 'desc';
}

export declare interface SpecialColumnColors {
    rowNumberBackground: string;
    rowNumberForeground: string;
    checkboxBorder: string;
    checkboxBackground: string;
    checkboxForeground: string;
    deleteRowBackground: string;
    deleteRowForeground: string;
    deleteRowHoverBackground: string;
    insertRowBackground: string;
    insertRowForeground: string;
    insertRowBorder: string;
    insertRowHoverBackground: string;
    insertRowHoverForeground: string;
    validationAlertsErrorBackground: string;
    validationAlertsErrorForeground: string;
}

export declare interface SpecialColumnElementColors {
    rowNumber: ColorSet;
    checkbox: {
        normal: ColorSet;
        checked: ColorSet;
        hover: ColorSet;
    };
    deleteRow: ButtonElementColors;
    insertRow: ButtonElementColors;
    validationAlerts: {
        normal: ColorSet;
        error: ColorSet;
        warning: ColorSet;
        info: ColorSet;
    };
}

export declare interface ThemeConfig {
    dataGrid?: Partial<DataGridTheme>;
    listBox?: Partial<ListBoxTheme>;
    comprehensiveDataGrid?: Partial<ComprehensiveDataGridTheme>;
    comprehensiveListBox?: Partial<ComprehensiveListBoxTheme>;
}

export declare interface UIControlColors {
    resizeGripColor: string;
    menuBackground: string;
    menuForeground: string;
    menuHoverBackground: string;
    dialogBackground: string;
    dialogForeground: string;
    dialogBorder: string;
    placeholderColor: string;
    searchPanelBackground: string;
    searchPanelForeground: string;
    searchPanelBorder: string;
    filterRowBackground: string;
    filterRowForeground: string;
    filterRowBorder: string;
    paginationBackground: string;
    paginationForeground: string;
    paginationBorder: string;
    paginationButtonHoverBackground: string;
}

export declare function useAutoRowHeight(config?: AutoRowHeightConfig): {
    calculateRowHeight: (row: Record<string, any>, columns: Array<{
        name: string;
        width: number;
        specialType?: string;
    }>) => RowHeightResult;
    calculateRowHeights: (rows: Record<string, any>[], columns: Array<{
        name: string;
        width: number;
        specialType?: string;
    }>) => RowHeightResult[];
    applyAutoRowHeight: (rows: Array<{
        rowId: string;
        height: number;
        [key: string]: any;
    }>, columns: Array<{
        name: string;
        width: number;
        specialType?: string;
    }>) => Promise<{
        totalRowsUpdated: number;
        averageHeight: number;
    }>;
    recalculateRows: (rows: Array<{
        rowId: string;
        height: number;
        [key: string]: any;
    }>, rowIds: string[], columns: Array<{
        name: string;
        width: number;
        specialType?: string;
    }>) => number;
    measureTextHeight: (text: string, width: number) => number;
    updateMaxHeight: (newMaxHeight: number) => void;
};

export declare function useCopyPaste(): {
    copyToClipboard: (rows: GridRow_2[], columnNames: string[], options?: CopyPasteOptions) => Promise<CopyPasteResult>;
    copySelectedCells: (selectedCells: Set<string>, allRows: GridRow_2[], allColumns: {
        name: string;
    }[]) => Promise<CopyPasteResult>;
    pasteFromClipboard: () => Promise<CopyPasteResult & {
        rows?: Record<string, any>[];
        headers?: string[];
    }>;
    canPaste: () => boolean;
    clearClipboard: () => void;
};

export declare const useDataGridStore: (storeId?: string) => StoreDefinition<string, Pick<{
rows: ComputedRef<    {
rowId: string;
rowIndex: number;
height: number;
cells: {
rowId: string;
columnName: string;
value: any;
isSelected: boolean;
isValidationError: boolean;
validationMessage?: string | undefined;
}[];
validationErrorCount?: number | undefined;
}[]>;
columns: Ref<    {
name: string;
header: string;
width: number;
minWidth: number;
maxWidth: number;
isVisible: boolean;
isReadOnly: boolean;
isSortable: boolean;
isFilterable: boolean;
autoWidth?: boolean | undefined;
specialType?: "RowNumber" | "Checkbox" | "ValidationAlerts" | "DeleteRow" | "InsertRow" | undefined;
dataType?: "string" | "number" | "boolean" | "date" | "datetime" | "time" | undefined;
visibleForGrid?: boolean | undefined;
}[], GridColumn[] | {
name: string;
header: string;
width: number;
minWidth: number;
maxWidth: number;
isVisible: boolean;
isReadOnly: boolean;
isSortable: boolean;
isFilterable: boolean;
autoWidth?: boolean | undefined;
specialType?: "RowNumber" | "Checkbox" | "ValidationAlerts" | "DeleteRow" | "InsertRow" | undefined;
dataType?: "string" | "number" | "boolean" | "date" | "datetime" | "time" | undefined;
visibleForGrid?: boolean | undefined;
}[]>;
selectedCells: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
checkedRows: Ref<string[], string[]>;
pageSize: Ref<number, number>;
currentPage: Ref<number, number>;
sortColumns: ComputedRef<    {
columnName: string;
direction: "asc" | "desc";
}[]>;
filterExpression: Ref<    {
type: "simple" | "composite";
} | null, FilterExpression | {
type: "simple" | "composite";
} | null>;
searchQuery: Ref<string, string>;
searchResults: Ref<    {
rowId: string;
columnName: string;
value: string;
}[], SearchMatch[] | {
rowId: string;
columnName: string;
value: string;
}[]>;
config: Ref<    {
pageSize: number;
pageSizeOptions?: number[] | undefined;
enableSort: boolean;
enableFilter: boolean;
enableSearch: boolean;
enableValidation: boolean;
autoValidate: boolean;
showRowNumber: boolean;
showCheckbox: boolean;
showValidationAlerts: boolean;
showDeleteButton: boolean;
showInsertButton: boolean;
}, GridConfig_2 | {
pageSize: number;
pageSizeOptions?: number[] | undefined;
enableSort: boolean;
enableFilter: boolean;
enableSearch: boolean;
enableValidation: boolean;
autoValidate: boolean;
showRowNumber: boolean;
showCheckbox: boolean;
showValidationAlerts: boolean;
showDeleteButton: boolean;
showInsertButton: boolean;
}>;
pressedCell: Ref<    {
rowId: string;
columnName: string;
} | null, {
rowId: string;
columnName: string;
} | {
rowId: string;
columnName: string;
} | null>;
isDragging: Ref<boolean, boolean>;
wasCtrlPressed: Ref<boolean, boolean>;
isAutoRowHeightEnabled: Ref<boolean, boolean>;
visibleRows: ComputedRef<    {
rowId: string;
rowIndex: number;
height: number;
cells: {
rowId: string;
columnName: string;
value: any;
isSelected: boolean;
isValidationError: boolean;
validationMessage?: string | undefined;
}[];
validationErrorCount?: number | undefined;
}[]>;
totalRows: ComputedRef<number>;
totalPages: ComputedRef<number>;
checkboxState: ComputedRef<"none" | "all" | "some">;
loadRows: (data: Record<string, any>[]) => void;
updateCell: (rowId: string, columnName: string, value: any) => void;
updateRowHeight: (rowId: string, newHeight: number) => void;
setAutoRowHeightEnabled: (enabled: boolean) => void;
addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
clearSort: () => void;
setPageSize: (size: number) => void;
goToPage: (page: number) => void;
deleteRow: (rowId: string) => void;
insertRow: (afterRowId: string) => void;
insertMultipleRows: (rowId: string, count: number, position: "above" | "below") => void;
toggleCheckbox: (rowId: string, checked: boolean) => void;
isRowChecked: (rowId: string) => boolean;
toggleAllCheckboxes: () => void;
setConfig: (newConfig: Partial<GridConfig_2>) => void;
initializeEmptyRows: (count?: number) => void;
setFilter: (filter: FilterExpression | null) => void;
clearFilter: () => void;
setSearchQuery: (query: string) => void;
clearSearch: () => void;
selectCell: (rowId: string, columnName: string, isCtrlPressed: boolean) => void;
startDragSelection: (rowId: string, columnName: string) => void;
expandDragSelection: (currentRowId: string, currentColumnName: string) => void;
endDragSelection: () => void;
isCellSelected: (rowId: string, columnName: string) => boolean;
setColumns: (inputColumns: GridColumn[]) => void;
ensureUniqueColumnNames: (inputColumns: GridColumn[]) => GridColumn[];
areNonEmptyRowsValid: () => boolean;
markCellValidated: (rowId: string, columnName: string) => void;
clearValidationTracking: () => void;
getCellsNeedingValidation: () => {
rowId: string;
columnName: string;
}[];
}, "searchResults" | "pageSize" | "columns" | "selectedCells" | "checkedRows" | "currentPage" | "filterExpression" | "searchQuery" | "config" | "pressedCell" | "isDragging" | "wasCtrlPressed" | "isAutoRowHeightEnabled">, Pick<{
rows: ComputedRef<    {
rowId: string;
rowIndex: number;
height: number;
cells: {
rowId: string;
columnName: string;
value: any;
isSelected: boolean;
isValidationError: boolean;
validationMessage?: string | undefined;
}[];
validationErrorCount?: number | undefined;
}[]>;
columns: Ref<    {
name: string;
header: string;
width: number;
minWidth: number;
maxWidth: number;
isVisible: boolean;
isReadOnly: boolean;
isSortable: boolean;
isFilterable: boolean;
autoWidth?: boolean | undefined;
specialType?: "RowNumber" | "Checkbox" | "ValidationAlerts" | "DeleteRow" | "InsertRow" | undefined;
dataType?: "string" | "number" | "boolean" | "date" | "datetime" | "time" | undefined;
visibleForGrid?: boolean | undefined;
}[], GridColumn[] | {
name: string;
header: string;
width: number;
minWidth: number;
maxWidth: number;
isVisible: boolean;
isReadOnly: boolean;
isSortable: boolean;
isFilterable: boolean;
autoWidth?: boolean | undefined;
specialType?: "RowNumber" | "Checkbox" | "ValidationAlerts" | "DeleteRow" | "InsertRow" | undefined;
dataType?: "string" | "number" | "boolean" | "date" | "datetime" | "time" | undefined;
visibleForGrid?: boolean | undefined;
}[]>;
selectedCells: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
checkedRows: Ref<string[], string[]>;
pageSize: Ref<number, number>;
currentPage: Ref<number, number>;
sortColumns: ComputedRef<    {
columnName: string;
direction: "asc" | "desc";
}[]>;
filterExpression: Ref<    {
type: "simple" | "composite";
} | null, FilterExpression | {
type: "simple" | "composite";
} | null>;
searchQuery: Ref<string, string>;
searchResults: Ref<    {
rowId: string;
columnName: string;
value: string;
}[], SearchMatch[] | {
rowId: string;
columnName: string;
value: string;
}[]>;
config: Ref<    {
pageSize: number;
pageSizeOptions?: number[] | undefined;
enableSort: boolean;
enableFilter: boolean;
enableSearch: boolean;
enableValidation: boolean;
autoValidate: boolean;
showRowNumber: boolean;
showCheckbox: boolean;
showValidationAlerts: boolean;
showDeleteButton: boolean;
showInsertButton: boolean;
}, GridConfig_2 | {
pageSize: number;
pageSizeOptions?: number[] | undefined;
enableSort: boolean;
enableFilter: boolean;
enableSearch: boolean;
enableValidation: boolean;
autoValidate: boolean;
showRowNumber: boolean;
showCheckbox: boolean;
showValidationAlerts: boolean;
showDeleteButton: boolean;
showInsertButton: boolean;
}>;
pressedCell: Ref<    {
rowId: string;
columnName: string;
} | null, {
rowId: string;
columnName: string;
} | {
rowId: string;
columnName: string;
} | null>;
isDragging: Ref<boolean, boolean>;
wasCtrlPressed: Ref<boolean, boolean>;
isAutoRowHeightEnabled: Ref<boolean, boolean>;
visibleRows: ComputedRef<    {
rowId: string;
rowIndex: number;
height: number;
cells: {
rowId: string;
columnName: string;
value: any;
isSelected: boolean;
isValidationError: boolean;
validationMessage?: string | undefined;
}[];
validationErrorCount?: number | undefined;
}[]>;
totalRows: ComputedRef<number>;
totalPages: ComputedRef<number>;
checkboxState: ComputedRef<"none" | "all" | "some">;
loadRows: (data: Record<string, any>[]) => void;
updateCell: (rowId: string, columnName: string, value: any) => void;
updateRowHeight: (rowId: string, newHeight: number) => void;
setAutoRowHeightEnabled: (enabled: boolean) => void;
addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
clearSort: () => void;
setPageSize: (size: number) => void;
goToPage: (page: number) => void;
deleteRow: (rowId: string) => void;
insertRow: (afterRowId: string) => void;
insertMultipleRows: (rowId: string, count: number, position: "above" | "below") => void;
toggleCheckbox: (rowId: string, checked: boolean) => void;
isRowChecked: (rowId: string) => boolean;
toggleAllCheckboxes: () => void;
setConfig: (newConfig: Partial<GridConfig_2>) => void;
initializeEmptyRows: (count?: number) => void;
setFilter: (filter: FilterExpression | null) => void;
clearFilter: () => void;
setSearchQuery: (query: string) => void;
clearSearch: () => void;
selectCell: (rowId: string, columnName: string, isCtrlPressed: boolean) => void;
startDragSelection: (rowId: string, columnName: string) => void;
expandDragSelection: (currentRowId: string, currentColumnName: string) => void;
endDragSelection: () => void;
isCellSelected: (rowId: string, columnName: string) => boolean;
setColumns: (inputColumns: GridColumn[]) => void;
ensureUniqueColumnNames: (inputColumns: GridColumn[]) => GridColumn[];
areNonEmptyRowsValid: () => boolean;
markCellValidated: (rowId: string, columnName: string) => void;
clearValidationTracking: () => void;
getCellsNeedingValidation: () => {
rowId: string;
columnName: string;
}[];
}, "rows" | "sortColumns" | "visibleRows" | "totalRows" | "totalPages" | "checkboxState">, Pick<{
rows: ComputedRef<    {
rowId: string;
rowIndex: number;
height: number;
cells: {
rowId: string;
columnName: string;
value: any;
isSelected: boolean;
isValidationError: boolean;
validationMessage?: string | undefined;
}[];
validationErrorCount?: number | undefined;
}[]>;
columns: Ref<    {
name: string;
header: string;
width: number;
minWidth: number;
maxWidth: number;
isVisible: boolean;
isReadOnly: boolean;
isSortable: boolean;
isFilterable: boolean;
autoWidth?: boolean | undefined;
specialType?: "RowNumber" | "Checkbox" | "ValidationAlerts" | "DeleteRow" | "InsertRow" | undefined;
dataType?: "string" | "number" | "boolean" | "date" | "datetime" | "time" | undefined;
visibleForGrid?: boolean | undefined;
}[], GridColumn[] | {
name: string;
header: string;
width: number;
minWidth: number;
maxWidth: number;
isVisible: boolean;
isReadOnly: boolean;
isSortable: boolean;
isFilterable: boolean;
autoWidth?: boolean | undefined;
specialType?: "RowNumber" | "Checkbox" | "ValidationAlerts" | "DeleteRow" | "InsertRow" | undefined;
dataType?: "string" | "number" | "boolean" | "date" | "datetime" | "time" | undefined;
visibleForGrid?: boolean | undefined;
}[]>;
selectedCells: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
checkedRows: Ref<string[], string[]>;
pageSize: Ref<number, number>;
currentPage: Ref<number, number>;
sortColumns: ComputedRef<    {
columnName: string;
direction: "asc" | "desc";
}[]>;
filterExpression: Ref<    {
type: "simple" | "composite";
} | null, FilterExpression | {
type: "simple" | "composite";
} | null>;
searchQuery: Ref<string, string>;
searchResults: Ref<    {
rowId: string;
columnName: string;
value: string;
}[], SearchMatch[] | {
rowId: string;
columnName: string;
value: string;
}[]>;
config: Ref<    {
pageSize: number;
pageSizeOptions?: number[] | undefined;
enableSort: boolean;
enableFilter: boolean;
enableSearch: boolean;
enableValidation: boolean;
autoValidate: boolean;
showRowNumber: boolean;
showCheckbox: boolean;
showValidationAlerts: boolean;
showDeleteButton: boolean;
showInsertButton: boolean;
}, GridConfig_2 | {
pageSize: number;
pageSizeOptions?: number[] | undefined;
enableSort: boolean;
enableFilter: boolean;
enableSearch: boolean;
enableValidation: boolean;
autoValidate: boolean;
showRowNumber: boolean;
showCheckbox: boolean;
showValidationAlerts: boolean;
showDeleteButton: boolean;
showInsertButton: boolean;
}>;
pressedCell: Ref<    {
rowId: string;
columnName: string;
} | null, {
rowId: string;
columnName: string;
} | {
rowId: string;
columnName: string;
} | null>;
isDragging: Ref<boolean, boolean>;
wasCtrlPressed: Ref<boolean, boolean>;
isAutoRowHeightEnabled: Ref<boolean, boolean>;
visibleRows: ComputedRef<    {
rowId: string;
rowIndex: number;
height: number;
cells: {
rowId: string;
columnName: string;
value: any;
isSelected: boolean;
isValidationError: boolean;
validationMessage?: string | undefined;
}[];
validationErrorCount?: number | undefined;
}[]>;
totalRows: ComputedRef<number>;
totalPages: ComputedRef<number>;
checkboxState: ComputedRef<"none" | "all" | "some">;
loadRows: (data: Record<string, any>[]) => void;
updateCell: (rowId: string, columnName: string, value: any) => void;
updateRowHeight: (rowId: string, newHeight: number) => void;
setAutoRowHeightEnabled: (enabled: boolean) => void;
addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
clearSort: () => void;
setPageSize: (size: number) => void;
goToPage: (page: number) => void;
deleteRow: (rowId: string) => void;
insertRow: (afterRowId: string) => void;
insertMultipleRows: (rowId: string, count: number, position: "above" | "below") => void;
toggleCheckbox: (rowId: string, checked: boolean) => void;
isRowChecked: (rowId: string) => boolean;
toggleAllCheckboxes: () => void;
setConfig: (newConfig: Partial<GridConfig_2>) => void;
initializeEmptyRows: (count?: number) => void;
setFilter: (filter: FilterExpression | null) => void;
clearFilter: () => void;
setSearchQuery: (query: string) => void;
clearSearch: () => void;
selectCell: (rowId: string, columnName: string, isCtrlPressed: boolean) => void;
startDragSelection: (rowId: string, columnName: string) => void;
expandDragSelection: (currentRowId: string, currentColumnName: string) => void;
endDragSelection: () => void;
isCellSelected: (rowId: string, columnName: string) => boolean;
setColumns: (inputColumns: GridColumn[]) => void;
ensureUniqueColumnNames: (inputColumns: GridColumn[]) => GridColumn[];
areNonEmptyRowsValid: () => boolean;
markCellValidated: (rowId: string, columnName: string) => void;
clearValidationTracking: () => void;
getCellsNeedingValidation: () => {
rowId: string;
columnName: string;
}[];
}, "loadRows" | "updateCell" | "updateRowHeight" | "setAutoRowHeightEnabled" | "addSort" | "clearSort" | "setPageSize" | "goToPage" | "deleteRow" | "insertRow" | "insertMultipleRows" | "toggleCheckbox" | "isRowChecked" | "toggleAllCheckboxes" | "setConfig" | "initializeEmptyRows" | "setFilter" | "clearFilter" | "setSearchQuery" | "clearSearch" | "selectCell" | "startDragSelection" | "expandDragSelection" | "endDragSelection" | "isCellSelected" | "setColumns" | "ensureUniqueColumnNames" | "areNonEmptyRowsValid" | "markCellValidated" | "clearValidationTracking" | "getCellsNeedingValidation">>;

export declare function useFiltering(): {
    currentFilter: Ref<    {
    type: "simple" | "composite";
    } | null, FilterExpression | {
    type: "simple" | "composite";
    } | null>;
    filterRows: (rows: GridRow_3[], filter: FilterExpression | null, store?: DataGridStoreInterface) => GridRow_3[];
    setFilter: (filter: FilterExpression | null) => void;
    clearFilter: () => void;
    evaluateFilter: (row: GridRow_3, filter: FilterExpression, store?: DataGridStoreInterface) => boolean;
};

export declare function useImportExport(): {
    exportToJson: (rows: Record<string, any>[], columns: string[], options?: ExportOptions) => ExportResult;
    importFromJson: (file: File, existingRows: Record<string, any>[], columns: string[], options?: ImportOptions) => Promise<ImportResult>;
    openImportDialog: (existingRows: Record<string, any>[], columns: string[], options?: ImportOptions) => Promise<ImportResult>;
    ImportMode: typeof ImportMode;
};

/**
 * Public Logger Interface
 */
export declare function useLogger(category?: string): {
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, data?: any): void;
    fatal(message: string, data?: any): void;
    /**
     * Flushes all pending logs immediately (synchronously)
     */
    flush(): void;
    /**
     * Gets current queue size
     */
    getQueueSize(): number;
};

export declare function useSearch(rows: Ref<GridRow_3[]>): {
    searchTerm: Ref<string, string>;
    searchMode: Ref<SearchMode, SearchMode>;
    searchResults: Ref<{
        rowId: string;
        columnName: string;
        value: string;
    }[], SearchMatch[] | {
        rowId: string;
        columnName: string;
        value: string;
    }[]>;
    currentResultIndex: Ref<number, number>;
    searchInRows: (term: string, mode: SearchMode, options?: SearchOptions) => void;
    goToNextResult: () => void;
    goToPreviousResult: () => void;
    clearSearch: () => void;
    isSearchMatch: (rowId: string, columnName: string) => boolean;
};

export declare function useSelection(): {
    selectedCells: Ref<Set<string> & Omit<Set<string>, keyof Set<any>>, Set<string> | (Set<string> & Omit<Set<string>, keyof Set<any>>)>;
    anchorCell: Ref<    {
    rowId: string;
    columnName: string;
    } | null, CellAddress | {
    rowId: string;
    columnName: string;
    } | null>;
    selectCell: (rowId: string, columnName: string, mode?: "replace" | "add" | "toggle") => void;
    selectRange: (startCell: CellAddress, endCell: CellAddress, rows: GridRow_3[], columns: GridColumn[]) => void;
    selectRow: (rowId: string, columns: GridColumn[]) => void;
    selectColumn: (columnName: string, rows: GridRow_3[]) => void;
    selectAll: (rows: GridRow_3[], columns: GridColumn[]) => void;
    clearSelection: () => void;
    getSelectedCells: () => CellAddress[];
    isCellSelected: (rowId: string, columnName: string) => boolean;
};

export declare function useShortcuts(options?: ShortcutOptions): {
    registerShortcut: (definition: ShortcutDefinition) => void;
    registerShortcuts: (definitions: ShortcutDefinition[]) => void;
    unregisterShortcut: (key: KeyCombination) => boolean;
    unregisterShortcutByName: (name: string) => boolean;
    setShortcutEnabled: (name: string, enabled: boolean) => void;
    getShortcuts: () => ShortcutDefinition[];
    getShortcutsByContext: (context: ShortcutContext) => ShortcutDefinition[];
    clearShortcuts: () => void;
    handleKeyDown: (event: KeyboardEvent) => Promise<void>;
};

export declare function useSignalR(options?: SignalROptions): {
    connection: Ref<    {
    serverTimeoutInMilliseconds: number;
    keepAliveIntervalInMilliseconds: number;
    readonly state: signalR_2.HubConnectionState;
    readonly connectionId: string | null;
    baseUrl: string;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    stream: <T = any>(methodName: string, ...args: any[]) => signalR_2.IStreamResult<T>;
    send: (methodName: string, ...args: any[]) => Promise<void>;
    invoke: <T = any>(methodName: string, ...args: any[]) => Promise<T>;
    on: (methodName: string, newMethod: (...args: any[]) => any) => void;
    off: {
    (methodName: string): void;
    (methodName: string, method: (...args: any[]) => void): void;
    };
    onclose: (callback: (error?: Error) => void) => void;
    onreconnecting: (callback: (error?: Error) => void) => void;
    onreconnected: (callback: (connectionId?: string) => void) => void;
    } | null, signalR_2.HubConnection | {
    serverTimeoutInMilliseconds: number;
    keepAliveIntervalInMilliseconds: number;
    readonly state: signalR_2.HubConnectionState;
    readonly connectionId: string | null;
    baseUrl: string;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    stream: <T = any>(methodName: string, ...args: any[]) => signalR_2.IStreamResult<T>;
    send: (methodName: string, ...args: any[]) => Promise<void>;
    invoke: <T = any>(methodName: string, ...args: any[]) => Promise<T>;
    on: (methodName: string, newMethod: (...args: any[]) => any) => void;
    off: {
    (methodName: string): void;
    (methodName: string, method: (...args: any[]) => void): void;
    };
    onclose: (callback: (error?: Error) => void) => void;
    onreconnecting: (callback: (error?: Error) => void) => void;
    onreconnected: (callback: (connectionId?: string) => void) => void;
    } | null>;
    isConnected: Ref<boolean, boolean>;
    isConnecting: Ref<boolean, boolean>;
    connectionError: Ref<Error | null, Error | null>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    on: <T = any>(eventName: string, handler: (data: T) => void) => void;
    off: (eventName: string, handler?: (...args: any[]) => void) => void;
    invoke: <T = any>(methodName: string, ...args: any[]) => Promise<T | void>;
};

export declare function useSorting(): {
    sortColumns: Ref<    {
    columnName: string;
    direction: "asc" | "desc";
    }[], SortColumn[] | {
    columnName: string;
    direction: "asc" | "desc";
    }[]>;
    sortRows: (rows: GridRow_3[], sorts: SortColumn[]) => GridRow_3[];
    addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
    removeSort: (columnName: string) => void;
    clearSort: () => void;
};

export declare function useTheme(): {
    dataGridTheme: Ref<DataGridTheme>;
    listBoxTheme: Ref<ListBoxTheme>;
};

export declare function useValidation(): {
    validationRules: Ref<Map<string, {
    columnName: string;
    ruleType: "Required" | "Regex" | "Range" | "Custom";
    errorMessage: string;
    regexPattern?: string | undefined;
    minValue?: any;
    maxValue?: any;
    severity: "Info" | "Warning" | "Error" | "Critical";
    customValidator?: ((value: any) => boolean) | undefined;
    }[]> & Omit<Map<string, ValidationRule_2[]>, keyof Map<any, any>>, Map<string, ValidationRule_2[]> | (Map<string, {
    columnName: string;
    ruleType: "Required" | "Regex" | "Range" | "Custom";
    errorMessage: string;
    regexPattern?: string | undefined;
    minValue?: any;
    maxValue?: any;
    severity: "Info" | "Warning" | "Error" | "Critical";
    customValidator?: ((value: any) => boolean) | undefined;
    }[]> & Omit<Map<string, ValidationRule_2[]>, keyof Map<any, any>>)>;
    validationErrors: Record<string, ValidationError[]>;
    errorCount: Ref<number, number>;
    ruleCount: Ref<number, number>;
    addValidationRule: (rule: ValidationRule_2) => void;
    validateCell: (rowId: string, columnName: string, value: any) => ValidationResult;
    validateCellThrottled: PromisifyFn<(rowId: string, columnName: string, value: any, rowCells?: Array<{
    columnName: string;
    value: any;
    }>) => void>;
    validateAll: (rows: any[]) => Promise<{
        isValid: boolean;
        totalErrors: number;
        errors: ValidationError[];
    }>;
    getValidationErrors: (rowId: string) => ValidationError[];
    clearValidationErrors: () => void;
};

export declare interface ValidationColors {
    errorBackground: string;
    errorForeground: string;
    errorBorder: string;
    warningBackground: string;
    warningForeground: string;
    warningBorder: string;
    infoBackground: string;
    infoForeground: string;
    infoBorder: string;
}

declare interface ValidationError {
    rowId: string;
    columnName: string;
    message: string;
    severity: string;
}

declare interface ValidationResult {
    isValid: boolean;
    error?: string;
    severity?: string;
}

export declare interface ValidationRule {
    columnName: string;
    ruleType: string;
    parameters: Record<string, any>;
    errorMessage: string;
}

declare interface ValidationRule_2 {
    columnName: string;
    ruleType: 'Required' | 'Regex' | 'Range' | 'Custom';
    errorMessage: string;
    regexPattern?: string;
    minValue?: any;
    maxValue?: any;
    severity: 'Info' | 'Warning' | 'Error' | 'Critical';
    customValidator?: (value: any) => boolean;
}

export declare const version = "1.0.0";

export { }
