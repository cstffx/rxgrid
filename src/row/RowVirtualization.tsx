type RowFrame = {
    firstVisibleRow: number;
    firstRow: number;
    lastRow: number;
    lastVisibleRow: number;
}

function isSameRowFrame(a: RowFrame, b?: RowFrame) {
    if (b) {
        return a.firstRow === b.firstRow &&
            a.lastRow === b.lastRow;
    }
    return false;
}

function getRowFrame<T>(viewport: HTMLDivElement,
                        rowHeight: number,
                        data: T[]): RowFrame {
    // Rows
    const height = viewport.offsetHeight;
    const visibleRows = Math.ceil(height / rowHeight);
    const lastIndex = data.length - 1;
    let firstVisibleRow = Math.floor(viewport.scrollTop / rowHeight);
    let lastVisibleRow = Math.min(visibleRows + firstVisibleRow - 1, lastIndex);
    const firstRow = Math.max(0, firstVisibleRow - 10);
    const lastRow = Math.min(lastVisibleRow + 10, lastIndex);
    return {
        firstRow,
        lastRow,
        firstVisibleRow,
        lastVisibleRow
    }
}

export {RowFrame, isSameRowFrame, getRowFrame};