import React from "react";
import {Cell} from "./PrivateCell.tsx";
import type {ColumnEx} from "../types.ts";
import type {ColumnFrame} from "../column/ColumnVirtualization.ts";

type StaticRowProps<T> = {
    key: any;
    rowData: T;
    columns: ColumnEx<T>[];
    vindex: number;
    rowClassName: string;
    rowSelector?: boolean;
};

type RowProps<T> = {
    key: any;
    rowData: T;
    columns: ColumnEx<T>[];
    colsFrame: ColumnFrame;
    vindex: number;
};

function PrivateStaticRow<T>(props: StaticRowProps<T>) {
    let cellsSize = props.columns.length;
    if (props.rowSelector) {
        cellsSize += 1;
    }
    const cells = new Array(cellsSize);

    let baseIndex = 0;
    if (props.rowSelector) {
        baseIndex = 1;
        for (let j = 0; j < props.columns.length; j++) {
            cells[0] = <div key={-1} className="rx-Cell rx-RowSelector" data-xtype="row-selector"/>
        }
    }

    for (let j = 0; j < props.columns.length; j++) {
        const col = props.columns[j];
        const index = j;
        cells[index + baseIndex] = <Cell key={j}
                                         id={col.id}
                                         className="rx-BodyCell"
                                         panelIndex={col.$panelIndex}
                                         value={props.rowData[col.id]}/>
    }

    return <div
        key={props.rowData['id']}
        className={props.rowClassName}
        style={{'--vindex': props.vindex} as any}>
        {cells}
    </div>
}

function PrivateRow<T>(props: RowProps<T>) {

    let cellsSize = props.colsFrame.last - props.colsFrame.first + 1;
    const cells = new Array(cellsSize);

    for (let j = props.colsFrame.first; j <= props.colsFrame.last; j++) {
        const col = props.columns[j];
        const index = j - props.colsFrame.first;
        cells[index] = <Cell key={j}
                             id={col.id}
                             className="rx-BodyCell"
                             panelIndex={col.$panelIndex}
                             value={props.rowData[col.id]}/>
    }
    return <div
        key={props.rowData['id']}
        className="rx-Row"
        style={{'--vindex': props.vindex} as any}>
        {cells}
    </div>
}

export const Row = React.memo(PrivateRow);
export const StaticRow = React.memo(PrivateStaticRow);