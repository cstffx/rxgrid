import React, {CSSProperties, MutableRefObject} from "react";
import {buildGridColumnTemplate} from "../column/ColumnTemplateBuilder.ts";
import type {ColumnDefinition} from "../column/ColumnDefinition.ts";
import type {ColumnFrame} from "../column/ColumnVirtualization.ts";

export function useViewportStyle<T>(columnDef: MutableRefObject<ColumnDefinition<T> | undefined>,
                                    columnFrame: ColumnFrame): CSSProperties {
    return React.useMemo(() => {
        const style = {};

        // Left column don't need column frame.
        const leftColumns = columnDef.current?.panels.columns.left;
        if (leftColumns) {
            style['--rx-left-col_tpl'] = buildGridColumnTemplate(leftColumns, undefined, ['16px'])
        }

        // Protect against initial frame
        if (columnFrame.first !== -1) {
            const centerColumns = columnDef.current?.panels.columns.center;
            if (centerColumns) {
                style['--rx-center-col_tpl'] = buildGridColumnTemplate(centerColumns, columnFrame)
            }
        }

        return style;
    }, [columnFrame]);
}