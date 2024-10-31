import type {ColumnDefinition} from "./ColumnDefinition.ts";

export type ColumnFrame = {
    first: number,
    last: number,
    elapsedWidth: number
}

/**
 * @param a
 * @param b
 */
function isSameColumnFrame(a: ColumnFrame, b?: ColumnFrame) {
    if (b){
        return a.first === b.first && a.last === b.last && a.elapsedWidth === b.elapsedWidth;
    }
    return false;
}

/**
 * Get the next column frame.
 * @param viewport
 * @param columnDef
 */
function getColumnsFrame<T>(viewport: HTMLDivElement,
                            columnDef: ColumnDefinition<T>): ColumnFrame {

    const scrollLeft = viewport.scrollLeft;
    const offsetWidth = viewport.offsetWidth;

    // We need only the center panel.
    // Left and right panel are frozen, this mean
    // they will show all the column available.
    const columns = columnDef.panels.columns.center;

    let firstColumn = 0;
    let acumulatedWidth = 0;
    for (let i = 0; i < columns.length; i++) {
        if (acumulatedWidth > scrollLeft) {
            break;
        }
        firstColumn = i;
        acumulatedWidth += columns[i].$width;
    }

    let lastColumn = firstColumn;
    for (let i = firstColumn + 1; i < columns.length; i++) {
        if (acumulatedWidth >= (offsetWidth + scrollLeft)) {
            break;
        }
        lastColumn = i;
        acumulatedWidth += columns[i].$width;
    }

    // Prerender one column before and after.
    firstColumn = Math.max(0, firstColumn - 3);
    lastColumn = Math.min(columns.length - 1, lastColumn + 3);

    // Calculate the amount of space rows need to be translated in the x-axis.
    const leftPanelWidth = columnDef.panels.width.left.total();
    const firstColumnDef = columnDef.panels.columns.center[firstColumn - 1];
    const elapsedWidth = firstColumnDef ? firstColumnDef.$accWidth + leftPanelWidth : leftPanelWidth;

    return {
        first: firstColumn,
        last: lastColumn,
        elapsedWidth
    };
}

export {getColumnsFrame, isSameColumnFrame};