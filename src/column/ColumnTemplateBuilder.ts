import type {ColumnEx} from "../types.ts";
import type {ColumnFrame} from "./ColumnVirtualization.ts";

/**
 * @param columns
 * @param frame
 * @param baseColumns
 * @param varIndex
 */
export function buildGridColumnTemplate<T>(columns: ColumnEx<T>[], frame?: ColumnFrame, baseColumns?: string[], varIndex?: number){
    let result = baseColumns ?? [];

    // This function works for frame or
    // "all included" case like frozen columns.
    let first = 0;
    let last = columns.length - 1;
    if(frame){
        first = frame.first;
        last = frame.last;
    }

    for(let i = first; i <= last; i++){
        let width;
        if(varIndex !== undefined && i === varIndex){
            width = `var(--rx-col_width_${i})`;
        }else{
            width = columns[i].width;
        }
        result.push(width);
    }

    return result.join(" ");
}