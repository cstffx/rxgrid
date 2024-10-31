import React, {CSSProperties} from "react";

export type Size = {
    width: number;
    height: number;
}

type TextAlign = "left" | "center" | "right";

export type Column<T = any> = {
    id: keyof T;
    label: string;
    width?: string;
    resizable?: boolean;
    sortable?: boolean;
    hidden?: boolean;
    textAlign?: TextAlign;
    icon?: React.ReactElement;
    cellStyle?: (row: Record<string, any>, column: Column<T>) => CSSProperties;
    frozen?: Panel | null;
}

export type XType = "root" | "header" | "header_cell" | "resizer";

export type SortOrder = "asc" | "desc" | "none";

export type SortConfiguration = { columnId: string; order: SortOrder };

export type ModKey = "ctrl" | "alt" | "shift";

export type SortAppendKey = ModKey | "none";

export type ColumnSortEvent<T> = {
    columnId: keyof T;
    order: SortOrder;
    append: boolean;
}

export type Panel = "left" | "right" | "center";

export type ScrollState = { y: number, x: number };

export type RowRange = { start: number, count: number };

export type RxGridProps<T> = {

    /**
     * Initial definition of columns.
     */
    columns: Column<T>[];

    /**
     * The set of data displayed.
     */
    data: T[];

    /**
     * If set, controls the height of the grid.
     * By default, grid will try to fill his container.
     */
    height?: string;

    /**
     * If set, controls the width of the grid.
     * By default, grid will try to fill his container.
     */
    width?: string;

    /**
     * If passed this component is rendered when the data collection is empty.
     */
    emptyStateSlot?: React.ReactElement;

    /**
     * Default header height in pixels.
     */
    headerHeight?: string;

    /**
     * Default row height in pixels.
     */
    rowHeight?: number;

    /**
     * If true, the entire row can be selected.
     */
    rowSelection?: boolean;

    /**
     * If true, the entire row can be selected using a checkbox.
     */
    checkboxSelection?: boolean;

    /**
     * Sort mode stablish if the data is sorted locally or in the server.
     */
    sortMode?: "client" | "server";

    /**
     * If true, sort can be applied to multiple columns. The sort is applied
     * in the same order of column sort is requested. If multisortKey is not
     * pressed, the sort request overrides the entire sort chain and only one
     * column is used to sort the data.
     */
    multisort?: boolean;

    /**
     * The key used to use the multisort feature. If this key is pressed
     * then the sort action append the new column to the sort chain. But if
     * is not pressed, the sort chain is reseted and only the last sort request
     * is used to sort the data.
     */
    multisortKey?: SortAppendKey;

    /**
     * If true, the entire column can be selected.
     */
    columnSelection?: boolean;

    /**
     * If true, the user can change column size interactively.
     */
    resizableColumns?: boolean;

    /**
     * If true, independent cells can be selected. See cellSelectionType to configure
     * if single, or multiple cells can be selected.
     */
    cellSelection?: boolean;

    /**
     * If true, the grid only render the visible row's range.
     */
    rowVirtualization?: boolean;

    /**
     * If true, a checkbox is displayed at the first column to allow the row selection.
     */
    cellSelectionType?: "single" | "range";

    /**
     * If true, multiple rows can be selected.
     */
    rowSelectionType?: "single" | "multiple";

    /**
     * If true, a checkbox is displayed at the first column to allow the row selection.
     */
    headerBorder?: boolean;

    /**
     * If true, columns render a border.
     */
    columnBorder?: boolean;

    /**
     * If true, a border is rendered between rows.
     */
    rowBorder?: boolean;

    /**
     * If true a loading indicator is rendered.
     */
    loading?: boolean;

    /**
     * Set the engine used to render the resize operations.
     */
    $resizeEngine?: "style" | "dom";

    /**
     * Dispatched when a column is sorted. Use this when remote sort is active
     * @param columnId
     * @param order
     */
    onSortRequest?: (event: ColumnSortEvent<T>, commit: () => void) => void;
}

export type ColumnEx<T> = Column<T> & {
    /**
     * The width of this element plus all the column before.
     */
    $accWidth: number;
    /**
     * The width if this element.
     */
    $width: number;
    /**
     * The index of this column in his panel.
     */
    $index: number;
    /**
     * The index of the panel.
     */
    $panelIndex: number;
}

/**
 * Used be the column resize engine to store the current state
 * of a resize operation.
 */
export type ResizerCtx = {
    mouseUp?: (e: MouseEvent) => void,
    mouseMove?: (e: MouseEvent) => void,
    endX?: number,
    startX?: number,
    startWidth?: number,
};
