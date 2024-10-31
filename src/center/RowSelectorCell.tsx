import React from "react";

type RowSelectorCellProps = {
    key: any;
}

export function RowSelectorCell(props: RowSelectorCellProps) {
    return <div className="rx-Cell rx-RowSelector" data-xtype="row-selector"/>
}