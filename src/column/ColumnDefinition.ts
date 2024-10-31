import {NumberArray} from "./NumberArray.ts";
import type {Column, ColumnEx, Panel} from "../types.ts";

type PanelDefinition<T> = {
    columns: {
        left: ColumnEx<T>[];
        center: ColumnEx<T>[];
        right: ColumnEx<T>[];
    },
    width: {
        left: NumberArray;
        center: NumberArray;
        right: NumberArray;
        all: NumberArray;
    }
}

class ColumnDefinition<T> {

    map: Map<string, ColumnEx<T>>;
    columns: ColumnEx<T>[];
    panels: PanelDefinition<T>;

    update(columnIndex: number, panel: Panel, width: number) {
        const columns = this.panels.columns[panel];
        const column = columns[columnIndex];
        column.width = width + 'px';

        let oldWidth = column.$width;
        column.$width = width;

        // Update panels widths
        this.panels.width[panel].update(columnIndex, width);
        this.panels.width.all.update(column.$index, width);

        if(panel === "center"){
            // Remove the current column from accWidth.
            column.$accWidth = column.$accWidth - oldWidth;
            // accum is the accumulated width starting for the previous column.
            let accum = column.$accWidth;
            // iterate all columns from the updated column to the last.
            for(let i = columnIndex; i < columns.length; i++){
                // get the width of the current columns.
                const columnWidth = columns[i].$width;
                // update the accumulated width.
                accum = accum + columnWidth;
                // set this into the column.
                columns[i].$accWidth = accum;
            }
        }
    }
}

function getColumnDefinition<T>(columns: Column<T>[]): ColumnDefinition<T> {

    // Columnas por paneles.
    const left_cols = [];
    const center_cols = [];
    const right_cols = [];

    // Map de columnas. Acceder a una columna por su id
    // en tiempo constante.
    const cols_map = new Map<string, ColumnEx<T>>();

    // Anchos de columnas.
    const all_width_na = new NumberArray(columns.length, 0);
    const left_width_na = new NumberArray();
    const center_width_na = new NumberArray();
    const right_width_na = new NumberArray();

    // let mesureService = createMesureService();
    let leftWidth = 0;
    let centerWidth = 0;
    let rightWidth = 0;
    for (let i = 0; i < columns.length; i++) {
        const column: ColumnEx<T> = Object.assign(columns[i]);

        // Column width.
        let width = 0;
        let str_width = column.width;
        if (!str_width) {
            // width = mesureService.mesure(column.label);
            width = 100;
        } else {
            width = parseFloat(str_width);
        }

        all_width_na.update(i, width);

        let panelIndex = 0;
        switch (column.frozen) {
            case "left":
                leftWidth += width;
                left_cols.push(column);
                left_width_na.add(width);
                panelIndex = left_cols.length - 1;
                break;
            case "right":
                rightWidth += width;
                right_cols.push(column);
                right_width_na.add(width);
                panelIndex = right_cols.length - 1;
                break;
            default:
                centerWidth += width;
                column.$accWidth = centerWidth;
                center_cols.push(column);
                center_width_na.add(width);
                panelIndex = center_cols.length - 1;
                break;
        }

        cols_map.set(column.id, column);
        column.$width = width;
        column.$index = i;
        column.$panelIndex = panelIndex;
    }

    // mesureService.end();

    const def = new ColumnDefinition();
    def.map = cols_map;
    def.columns = left_cols.concat(center_cols, right_cols);
    def.panels = {
        columns: {
            left: left_cols,
            center: center_cols,
            right: right_cols
        },
        width: {
            left: left_width_na,
            center: center_width_na,
            right: right_width_na,
            all: all_width_na
        }
    };

    return def;
}

export {ColumnDefinition, getColumnDefinition}