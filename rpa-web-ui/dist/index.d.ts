import { App } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { createPinia } from 'pinia';
import { DataGridTheme } from '../types/theme';
import { DefineComponent } from 'vue';
import { getActivePinia } from 'pinia';
import { gridApi } from './services/gridApi';
import { GridRow as GridRow_2 } from '../types/grid';
import { ListBoxTheme } from '../types/theme';
import { Pinia } from 'pinia';
import { PromisifyFn } from '@vueuse/shared';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { setActivePinia } from 'pinia';
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
    minRows?: number;
    showHiddenColumnsPanel?: boolean;
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

declare type __VLS_Props_3 = {
    visible?: boolean;
    gridId?: string;
};

declare type __VLS_Props_4 = {
    gridId?: string;
};

/**
 * Auto Row Height Composable
 *
 * Calculates row heights based on cell content and text wrapping
 */
export declare interface AutoRowHeightConfig {
    minHeight: number;
    maxHeight: number;
    fontFamily: string;
    fontSize: number;
    enableWrapping: boolean;
    padding: number;
}

export declare interface CompositeFilter extends FilterExpression {
    type: 'composite';
    left: FilterExpression;
    right: FilterExpression;
    operator: 'AND' | 'OR';
}

declare interface CopyPasteOptions {
    includeHeaders?: boolean;
}

declare interface CopyPasteResult {
    success: boolean;
    message?: string;
    processedRows?: number;
}

export { createPinia }

declare interface DataGridStoreInterface {
    checkedRows: string[];
    isRowChecked(rowId: string): boolean;
}

declare const _default: DefineComponent<__VLS_Props, {
    loadDataFromBackend: PromisifyFn<typeof loadDataFromBackendOriginal>;
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
        }[]> & Omit<Map<string, ValidationRule[]>, keyof Map<any, any>>, Map<string, ValidationRule[]> | (Map<string, {
            columnName: string;
            ruleType: "Required" | "Regex" | "Range" | "Custom";
            errorMessage: string;
            regexPattern?: string | undefined;
            minValue?: any;
            maxValue?: any;
            severity: "Info" | "Warning" | "Error" | "Critical";
            customValidator?: ((value: any) => boolean) | undefined;
        }[]> & Omit<Map<string, ValidationRule[]>, keyof Map<any, any>>)>;
        validationErrors: Record<string, ValidationError[]>;
        errorCount: Ref<number, number>;
        ruleCount: Ref<number, number>;
        addValidationRule: (rule: ValidationRule) => void;
        validateCell: (rowId: string, columnName: string, value: any) => ValidationResult;
        validateCellDirect: (rowId: string, columnName: string, value: any, rowCells?: Array<{
            columnName: string;
            value: any;
        }>, skipErrorCountUpdate?: boolean) => Promise<void>;
        validateCellThrottled: PromisifyFn<(rowId: string, columnName: string, value: any, rowCells?: Array<{
            columnName: string;
            value: any;
        }>, skipErrorCountUpdate?: boolean) => Promise<void>>;
        getValidationErrors: (rowId: string) => ValidationError[];
        clearValidationErrors: () => void;
        updateErrorCount: () => void;
    };
    copyPaste: {
        copyToClipboard: (rows: GridRow_2[], columnNames: string[], options?: CopyPasteOptions) => Promise< CopyPasteResult>;
        copySelectedCells: (selectedCells: Set<string>, allRows: GridRow_2[], allColumns: {
            name: string;
        }[]) => Promise< CopyPasteResult>;
        pasteFromClipboard: () => Promise< CopyPasteResult & {
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
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {
    scrollerRef: any;
}, HTMLDivElement>;
export { _default as AdvancedTable }
export { _default as DataGrid }

declare const _default_2: {
    install: typeof install;
};
export default _default_2;

export declare interface FilterExpression {
    type: 'simple' | 'composite';
}

export declare type FilterOperator = 'Equals' | 'NotEquals' | 'Contains' | 'StartsWith' | 'EndsWith' | 'GreaterThan' | 'LessThan' | 'GreaterThanOrEquals' | 'LessThanOrEquals' | 'IsEmpty' | 'IsNotEmpty';

export declare const FilterRow: DefineComponent<__VLS_Props_4, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props_4> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export { getActivePinia }

export { gridApi }

export declare interface GridCell {
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
    minRowHeight?: number;
}

export declare interface GridRow {
    rowId: string;
    rowIndex: number;
    height: number;
    cells: GridCell[];
    validationErrorCount?: number;
}

export declare function install(app: App): void;

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

export declare interface ListBoxItem {
    name: string;
    value: string;
}

declare function loadDataFromBackendOriginal(): Promise<void>;

export { Pinia }

export declare interface RowHeightResult {
    rowId: string;
    calculatedHeight: number;
    isSuccess: boolean;
}

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

export declare const SearchPanel: DefineComponent<__VLS_Props_3, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props_3> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export { setActivePinia }

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

export declare interface SimpleFilter extends FilterExpression {
    type: 'simple';
    columnName: string;
    operator: FilterOperator;
    value: any;
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

export declare const useDataGridStore: (storeId?: string) => StoreDefinition<string, Pick<{
    rows: ComputedRef<{
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
    columns: Ref<{
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
    sortColumns: ComputedRef<{
        columnName: string;
        direction: "asc" | "desc";
    }[]>;
    filterExpression: Ref<{
        type: "simple" | "composite";
    } | null, FilterExpression | {
        type: "simple" | "composite";
    } | null>;
    searchQuery: Ref<string, string>;
    searchResults: Ref<{
        rowId: string;
        columnName: string;
        value: string;
    }[], SearchMatch[] | {
        rowId: string;
        columnName: string;
        value: string;
    }[]>;
    config: Ref<{
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
        minRowHeight?: number | undefined;
    }, GridConfig | {
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
        minRowHeight?: number | undefined;
    }>;
    pressedCell: Ref<{
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
    minRows: Ref<number, number>;
    visibleRows: ComputedRef<{
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
    getRow: (rowId: string) => GridRow | undefined;
    loadRows: (data: Record<string, any>[]) => void;
    updateCell: (rowId: string, columnName: string, value: any) => void;
    updateRowHeight: (rowId: string, newHeight: number) => void;
    setAutoRowHeightEnabled: (enabled: boolean) => void;
    addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
    clearSort: () => void;
    setSortColumns: (sorts: {
        columnName: string;
        direction: "asc" | "desc";
    }[]) => void;
    setPageSize: (size: number) => void;
    goToPage: (page: number) => void;
    deleteRow: (rowId: string) => void;
    insertRow: (afterRowId: string) => void;
    insertMultipleRows: (rowId: string, count: number, position: "above" | "below") => void;
    toggleCheckbox: (rowId: string, checked: boolean) => void;
    isRowChecked: (rowId: string) => boolean;
    toggleAllCheckboxes: () => void;
    setConfig: (newConfig: Partial<GridConfig>) => void;
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
    getCellsNeedingValidation: (forceValidateAll?: boolean) => {
        rowId: string;
        columnName: string;
    }[];
    setMinRows: (newMinRows: number) => void;
}, "searchResults" | "pageSize" | "columns" | "selectedCells" | "checkedRows" | "currentPage" | "filterExpression" | "searchQuery" | "config" | "pressedCell" | "isDragging" | "wasCtrlPressed" | "isAutoRowHeightEnabled" | "minRows">, Pick<{
    rows: ComputedRef<{
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
    columns: Ref<{
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
    sortColumns: ComputedRef<{
        columnName: string;
        direction: "asc" | "desc";
    }[]>;
    filterExpression: Ref<{
        type: "simple" | "composite";
    } | null, FilterExpression | {
        type: "simple" | "composite";
    } | null>;
    searchQuery: Ref<string, string>;
    searchResults: Ref<{
        rowId: string;
        columnName: string;
        value: string;
    }[], SearchMatch[] | {
        rowId: string;
        columnName: string;
        value: string;
    }[]>;
    config: Ref<{
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
        minRowHeight?: number | undefined;
    }, GridConfig | {
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
        minRowHeight?: number | undefined;
    }>;
    pressedCell: Ref<{
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
    minRows: Ref<number, number>;
    visibleRows: ComputedRef<{
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
    getRow: (rowId: string) => GridRow | undefined;
    loadRows: (data: Record<string, any>[]) => void;
    updateCell: (rowId: string, columnName: string, value: any) => void;
    updateRowHeight: (rowId: string, newHeight: number) => void;
    setAutoRowHeightEnabled: (enabled: boolean) => void;
    addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
    clearSort: () => void;
    setSortColumns: (sorts: {
        columnName: string;
        direction: "asc" | "desc";
    }[]) => void;
    setPageSize: (size: number) => void;
    goToPage: (page: number) => void;
    deleteRow: (rowId: string) => void;
    insertRow: (afterRowId: string) => void;
    insertMultipleRows: (rowId: string, count: number, position: "above" | "below") => void;
    toggleCheckbox: (rowId: string, checked: boolean) => void;
    isRowChecked: (rowId: string) => boolean;
    toggleAllCheckboxes: () => void;
    setConfig: (newConfig: Partial<GridConfig>) => void;
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
    getCellsNeedingValidation: (forceValidateAll?: boolean) => {
        rowId: string;
        columnName: string;
    }[];
    setMinRows: (newMinRows: number) => void;
}, "rows" | "sortColumns" | "visibleRows" | "totalRows" | "totalPages" | "checkboxState">, Pick<{
    rows: ComputedRef<{
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
    columns: Ref<{
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
    sortColumns: ComputedRef<{
        columnName: string;
        direction: "asc" | "desc";
    }[]>;
    filterExpression: Ref<{
        type: "simple" | "composite";
    } | null, FilterExpression | {
        type: "simple" | "composite";
    } | null>;
    searchQuery: Ref<string, string>;
    searchResults: Ref<{
        rowId: string;
        columnName: string;
        value: string;
    }[], SearchMatch[] | {
        rowId: string;
        columnName: string;
        value: string;
    }[]>;
    config: Ref<{
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
        minRowHeight?: number | undefined;
    }, GridConfig | {
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
        minRowHeight?: number | undefined;
    }>;
    pressedCell: Ref<{
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
    minRows: Ref<number, number>;
    visibleRows: ComputedRef<{
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
    getRow: (rowId: string) => GridRow | undefined;
    loadRows: (data: Record<string, any>[]) => void;
    updateCell: (rowId: string, columnName: string, value: any) => void;
    updateRowHeight: (rowId: string, newHeight: number) => void;
    setAutoRowHeightEnabled: (enabled: boolean) => void;
    addSort: (columnName: string, direction: "asc" | "desc", multiSort?: boolean) => void;
    clearSort: () => void;
    setSortColumns: (sorts: {
        columnName: string;
        direction: "asc" | "desc";
    }[]) => void;
    setPageSize: (size: number) => void;
    goToPage: (page: number) => void;
    deleteRow: (rowId: string) => void;
    insertRow: (afterRowId: string) => void;
    insertMultipleRows: (rowId: string, count: number, position: "above" | "below") => void;
    toggleCheckbox: (rowId: string, checked: boolean) => void;
    isRowChecked: (rowId: string) => boolean;
    toggleAllCheckboxes: () => void;
    setConfig: (newConfig: Partial<GridConfig>) => void;
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
    getCellsNeedingValidation: (forceValidateAll?: boolean) => {
        rowId: string;
        columnName: string;
    }[];
    setMinRows: (newMinRows: number) => void;
}, "getRow" | "loadRows" | "updateCell" | "updateRowHeight" | "setAutoRowHeightEnabled" | "addSort" | "clearSort" | "setSortColumns" | "setPageSize" | "goToPage" | "deleteRow" | "insertRow" | "insertMultipleRows" | "toggleCheckbox" | "isRowChecked" | "toggleAllCheckboxes" | "setConfig" | "initializeEmptyRows" | "setFilter" | "clearFilter" | "setSearchQuery" | "clearSearch" | "selectCell" | "startDragSelection" | "expandDragSelection" | "endDragSelection" | "isCellSelected" | "setColumns" | "ensureUniqueColumnNames" | "areNonEmptyRowsValid" | "markCellValidated" | "clearValidationTracking" | "getCellsNeedingValidation" | "setMinRows">>;

export declare function useFiltering(): {
    currentFilter: Ref<{
        type: "simple" | "composite";
    } | null, FilterExpression | {
        type: "simple" | "composite";
    } | null>;
    filterRows: (rows: GridRow[], filter: FilterExpression | null, store?: DataGridStoreInterface) => GridRow[];
    setFilter: (filter: FilterExpression | null) => void;
    clearFilter: () => void;
    evaluateFilter: (row: GridRow, filter: FilterExpression, store?: DataGridStoreInterface) => boolean;
};

export declare function useSearch(rows: Ref<GridRow[]>): {
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
    }[]> & Omit<Map<string, ValidationRule[]>, keyof Map<any, any>>, Map<string, ValidationRule[]> | (Map<string, {
        columnName: string;
        ruleType: "Required" | "Regex" | "Range" | "Custom";
        errorMessage: string;
        regexPattern?: string | undefined;
        minValue?: any;
        maxValue?: any;
        severity: "Info" | "Warning" | "Error" | "Critical";
        customValidator?: ((value: any) => boolean) | undefined;
    }[]> & Omit<Map<string, ValidationRule[]>, keyof Map<any, any>>)>;
    validationErrors: Record<string, ValidationError[]>;
    errorCount: Ref<number, number>;
    ruleCount: Ref<number, number>;
    addValidationRule: (rule: ValidationRule) => void;
    validateCell: (rowId: string, columnName: string, value: any) => ValidationResult;
    validateCellDirect: (rowId: string, columnName: string, value: any, rowCells?: Array<{
        columnName: string;
        value: any;
    }>, skipErrorCountUpdate?: boolean) => Promise<void>;
    validateCellThrottled: PromisifyFn<(rowId: string, columnName: string, value: any, rowCells?: Array<{
        columnName: string;
        value: any;
    }>, skipErrorCountUpdate?: boolean) => Promise<void>>;
    validateAll: (rows: any[]) => Promise<{
        isValid: boolean;
        totalErrors: number;
        errors: ValidationError[];
    }>;
    getValidationErrors: (rowId: string) => ValidationError[];
    clearValidationErrors: () => void;
    updateErrorCount: () => void;
};

export declare interface ValidationError {
    rowId: string;
    columnName: string;
    message: string;
    severity: string;
}

export declare interface ValidationResult {
    isValid: boolean;
    error?: string;
    severity?: string;
}

export declare interface ValidationRule {
    columnName: string;
    ruleType: 'Required' | 'Regex' | 'Range' | 'Custom';
    errorMessage: string;
    regexPattern?: string;
    minValue?: any;
    maxValue?: any;
    severity: 'Info' | 'Warning' | 'Error' | 'Critical';
    customValidator?: (value: any) => boolean;
}

export { }
