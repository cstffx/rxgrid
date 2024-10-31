import React from "react";
import cls from "classnames";

type PrivateCell = {
    key: any;
    id: string;
    panelIndex: number;
    value?: string;
    className?: string;
}

function PrivateCell(props: PrivateCell) {
    return <div key={props.id}
                className={cls("rx-Cell", props.className)}
                data-xtype="cell">
        {props.value}
    </div>
}

export const Cell = React.memo(PrivateCell);