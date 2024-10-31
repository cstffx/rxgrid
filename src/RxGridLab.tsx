import React, {Profiler} from "react";
import type {Column} from "./types.ts";
import dataset from "./dataset.json";
import {RxGrid} from "./RxGrid.tsx";

export function RxGridLab() {
    const [columns, setColumns] = React.useState<Column[]>(() => {
        return [
            {id: "id", label: "Id", width: "100px", frozen: "left", textAlign: "left"},
            {id: "enero", label: "Enero", width: "100px", frozen: "left"},
            {id: "febrero", label: "Febrero", width: "100px"},
            {id: "marzo", label: "Marzo", width: "100px"},
            {id: "abril", label: "Abril", width: "100px"},
            {id: "mayo", label: "Mayo", width: "100px"},
            {id: "junio", label: "Junio", width: "100px"},
            {id: "julio", label: "Julio", width: "100px"},
            {id: "agosto", label: "Agosto", width: "100px"},
            {id: "septiembre", label: "Septiembre", width: "100px"},
            {id: "octubre", label: "Octubre", width: "100px"},
            {id: "noviembre", label: "Noviembre", width: "100px"},
            {id: "diciembre", label: "Diciembre", width: "100px"},
        ]
    });

    return <RxGrid height="500px"
                   width="1000px"
                   rowHeight={28}
                   resizableColumns={true}
                   columns={columns}
                   data={dataset}/>
}