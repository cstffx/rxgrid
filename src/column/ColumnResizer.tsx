import React from "react";

type ColumnResizerProps = {
    id: string;
    index: number;
}

export function ColumnResizer(props: ColumnResizerProps) {
    return <div className="rx-ColumnResizer"
                data-id={props.id}
                data-index={props.index}
                data-xtype="col-resizer"/>
}