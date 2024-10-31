import React from "react";
import type {ColumnEx, Panel} from "../types.ts";
import type {ColumnFrame} from "./ColumnVirtualization.ts";
import cls from "classnames";
import {RowSelectorCell} from "../center/RowSelectorCell.tsx";
import {ColumnResizer} from "./ColumnResizer.tsx";

type HeaderProps<T> = {
    panel: Panel;
    columns: ColumnEx<T>[];
    colsFrame: ColumnFrame;
    className?: string;
    tableSelector?: boolean;
    resizableColumns?: boolean;
}

export function HeaderRow<T>(props: HeaderProps<T>) {

    if (props.colsFrame.first === -1) {
        return;
    }

    // Include an extra element if resizing component is requested.
    let baseCell = 0;
    const cells = new Array(props.columns.length + (props.tableSelector ? 1 : 0));
    if (props.tableSelector) {
        cells[0] = <RowSelectorCell key={0}/>;
        baseCell = 1;
    }

    for (let i = props.colsFrame.first; i <= props.colsFrame.last; i++) {
        // Current column config.
        const columnProps = props.columns[i];

        // This is the index of the column in the entire collection
        // this index is useful when perform column resizing.
        const columnIndex = i - props.colsFrame.first;

        // The component used to receive resizing input.
        let columnResizerCmp;
        if (props.resizableColumns && (columnProps.resizable || columnProps.resizable === undefined)) {
            columnResizerCmp = <ColumnResizer id={columnProps.id} index={columnIndex}/>
        }

        // The append position may differ from index due to the inclusion
        // of a resizing component before.
        cells[columnIndex + baseCell] = <div key={i + baseCell}
                                             className="rx-Cell rx-HeaderCell"
                                             colid={columnProps.id}
                                             index={columnIndex}
                                             xtype="header-cell">
            <div className="rx-HeaderLabel"
                 xtype="header-label"
                 style={{
                     textAlign: columnProps.textAlign || "center"
                 }}>{props.columns[i].label}</div>
            {columnResizerCmp}
        </div>
    }

    return <div data-panel={props.panel}
                xtype="header-row"
                className={cls("rx-HeaderRow", props.className)}>
        {cells}
    </div>
}