import React from "react";
import type {ColumnEx} from "../types.ts";
import type {WindowFrame} from "../virtualization/useWindowFrame.ts";
import {Row, StaticRow} from "./PrivateRow.tsx";

type BodyProps<T> = {
    data: T[];
    columns: ColumnEx<T>[];
    frame: WindowFrame;
    virtualization: boolean;
    rowClassName?: string;
    rowSelector?: boolean;
}

function PrivateBody<T>(props: BodyProps<T>) {

    if (props.frame.rows.firstRow === -1) {
        return;
    }

    const data = props.data;
    const columns = props.columns;
    const rowsFrame = props.frame.rows;
    const colsFrame = props.frame.cols;
    const rows = new Array(rowsFrame.lastRow - rowsFrame.firstRow + 1);

    let rowClassName;
    if(!props.virtualization){
        rowClassName = props.rowClassName || "rx-RowLeft"
    }

    for (let i = rowsFrame.firstRow; i <= rowsFrame.lastRow; i++) {
        const rowData = data[i];
        const vindex = rowData['$vindex'] || i;
        rowData['$vindex'] = vindex as any;
        if(props.virtualization){
            rows[i - rowsFrame.firstRow] = <Row
                key={rowData['id']}
                columns={columns}
                rowData={rowData}
                colsFrame={colsFrame}
                vindex={vindex}/>
        }else{
            rows[i - rowsFrame.firstRow] = <StaticRow
                rowSelector={props.rowSelector}
                key={rowData['id']}
                columns={columns}
                rowData={rowData}
                vindex={vindex}
                rowClassName={rowClassName}/>
        }
    }

    return rows;
}

export const Body = React.memo(PrivateBody);
