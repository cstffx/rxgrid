import cls from "classnames";
import {Body} from "../center/PrivateBody.tsx";
import React from "react";
import type {WindowFrame} from "../virtualization/useWindowFrame.ts";
import {ColumnDefinition} from "../column/ColumnDefinition.ts";

type SidePanelProps<T> = {
    data: T[];
    frame: WindowFrame;
    columnDef?: ColumnDefinition<T>
    position: "left" | "right";
    rowClassName: string;
    rowSelector?: boolean;
};

function SidePanel<T>(props: SidePanelProps<T>) {
    if (!props.columnDef) {
        return;
    }
    if (props.frame.rows.firstRow === -1) {
        return;
    }
    const panelColumns = props.columnDef.panels.columns[props.position];
    const width = props.columnDef.panels.width[props.position].total();
    return <div className={cls(
        "rx-Panel",
        {
            "rx-PanelLeft": props.position === "left",
            "rx-PanelRight": props.position === "right",
        }
    )} style={{width}}>
        <Body data={props.data}
              rowSelector={props.rowSelector}
              virtualization={false}
              rowClassName={props.rowClassName}
              columns={panelColumns}
              frame={props.frame}/>
    </div>
}

export {SidePanel}