import "./rxgrid.scss";
import React, {MutableRefObject} from "react";
import type {ResizerCtx, RxGridProps} from "./types.ts";
import {getColumnDefinition} from "./column/ColumnDefinition.ts";
import {useWindowFrame} from "./virtualization/useWindowFrame.ts";
import {Body} from "./center/PrivateBody.tsx";
import {SidePanel} from "./frozen/SidePanel.tsx";
import {HeaderRow} from "./column/HeaderRow.tsx";
import {buildGridColumnTemplate} from "./column/ColumnTemplateBuilder.ts";
import {useViewportStyle} from "./hook/useViewportStyle.ts";
import {useContainerStyle} from "./hook/useContainerStyle.ts";

function useMemoRef<T>(fn: () => T, deps: any[]): MutableRefObject<T | undefined> {
    const ref = React.useRef<T>();
    ref.current = React.useMemo(fn, deps);
    return ref;
}

const cleanUpEvents = (ctx?: ResizerCtx) => {
    if (ctx) {
        const current_up = ctx.mouseUp;
        const current_move = ctx.mouseMove;

        current_up && window.removeEventListener("mouseup", current_up);
        current_move && window.removeEventListener("mousemove", current_move);

        ctx.endX = 0;
        ctx.startX = 0;
        ctx.startWidth = 0;
    }
};

export function RxGrid<T>(props: RxGridProps<T>) {

    const columnDef = useMemoRef(() => {
        return getColumnDefinition(props.columns);
    }, [props.columns]);

    const framer = useWindowFrame<T>();
    const ref = React.useRef<HTMLDivElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const resizeCtx = React.useRef<ResizerCtx>({});
    const containerWidth = columnDef.current?.panels.width.all.total() || 0;
    const containerStyle = useContainerStyle(props.data.length, props.rowHeight || 28, containerWidth);
    const viewportStyle = useViewportStyle(columnDef, framer.frame.cols);

    const scrollHandler = React.useRef<(e: Event) => void | undefined>();
    scrollHandler.current = React.useCallback((event: Event) => {
        const data = props.data;
        const rowHeight = props.rowHeight;
        if (ref.current && columnDef.current) {
            framer.update(
                event.target as HTMLDivElement,
                columnDef.current,
                data,
                rowHeight || 36
            );
        }
    }, [props.data, props.rowHeight]);

    React.useEffect(() => {
        const onScroll = (e) => {
            scrollHandler.current && scrollHandler.current(e);
        }
        if (ref.current && columnDef.current) {
            ref.current.addEventListener("scroll", onScroll, {passive: true});
            framer.update(ref.current, columnDef.current, props.data, props.rowHeight || 36);
        }
        return () => {
            if (ref.current && scrollHandler.current) {
                ref.current.removeEventListener("scroll", onScroll);
            }
        }
    }, []);

    const onMouseDown = React.useCallback((e) => {
        const el = e.target as HTMLElement;
        if (el.dataset['xtype'] === "col-resizer") {

            const resizingBodyClass = "rx-ColumnResizing";
            const resizerActiveClass = "rx-ResizerActive";

            const headerElement = el.parentNode as HTMLTableHeaderCellElement;
            const index: number = parseInt(headerElement.getAttribute('index'));
            const initialWidth = headerElement.offsetWidth;
            let newWidthInt = initialWidth;

            el.classList.add(resizerActiveClass);
            document.body.classList.add(resizingBodyClass);

            const columns = columnDef.current?.panels.columns.center;
            const varName = `--rx-col_width_${index}`;
            if (columns) {
                ref.current?.style.setProperty(
                    "--rx-center-col_tpl",
                    buildGridColumnTemplate(columns, undefined, [], index)
                );
                ref.current?.style.setProperty(
                    varName,
                    initialWidth + 'px'
                );
            }

            const mouseUp = () => {
                const centerColumns = columnDef.current?.panels.columns.center;
                if (centerColumns && ref.current) {
                    centerColumns[index].width = newWidthInt + 'px';
                    centerColumns[index].$width = newWidthInt;
                    ref.current?.style.setProperty(
                        "--rx-center-col_tpl",
                        buildGridColumnTemplate(centerColumns)
                    );
                }
                ref.current?.style.removeProperty(varName);
                el.classList.remove(resizerActiveClass);
                document.body.classList.remove(resizingBodyClass);
                cleanUpEvents(resizeCtx.current);
            };

            const mouseMove = (e: MouseEvent) => {
                const delta = (e.clientX - resizeCtx.current.startX);
                resizeCtx.current.endX = e.clientX;
                newWidthInt = Math.max(5, resizeCtx.current.startWidth + delta);

                const viewport = ref.current;

                // Temporary set the width in the var.
                ref.current?.style.setProperty(`--rx-col_width_${index}`, newWidthInt + 'px');

                // Update the column definition.
                columnDef.current?.update(index, 'center', newWidthInt);

                // Update the frame
                if (ref.current && columnDef.current && containerRef.current) {
                    containerRef.current.style.width = columnDef.current.panels.width.all.total() + 'px';
                    let a = 0;
                    for(let i = 0; i < columnDef.current.columns.length; i++){
                        a += columnDef.current.columns[i].$width;
                    }
                    framer.update(ref.current, columnDef.current, props.data, props.rowHeight || 28);
                }
            }

            // // Remove previous before override.
            cleanUpEvents(resizeCtx.current);

            resizeCtx.current.startX = e.clientX;
            resizeCtx.current.startWidth = headerElement.offsetWidth;
            resizeCtx.current.mouseUp = mouseUp;
            resizeCtx.current.mouseMove = mouseMove;

            window.addEventListener("mouseup", mouseUp);
            window.addEventListener("mousemove", mouseMove);
        }
    }, []);

    console.log("rendered");

    const leftColumns = columnDef.current?.panels.columns.left;
    const centerColumns = columnDef.current?.panels.columns.center;

    return <div className="dark rx-Grid rx-Grid-dark"
                onMouseDown={onMouseDown}
                style={{
                    width: props.width,
                    height: props.height,
                    position: "relative",
                    '--rx_rh': props.rowHeight || 36,
                    '--rx_elapsed_width': framer.frame.cols?.elapsedWidth || 0
                }}>
        <div className="rx-Viewport" ref={ref} style={viewportStyle}>
            <HeaderRow panel="left"
                       className="rx-HeaderRowLeft"
                       tableSelector={true}
                       resizableColumns={props.resizableColumns}
                       columns={leftColumns as any}
                       colsFrame={{
                           first: 0,
                           last: (leftColumns?.length - 1) || 0,
                           elapsedWidth: 0
                       }}/>
            <div className="rx-Container" style={containerStyle} ref={containerRef}>
                {/*<Selector/>*/}
                {leftColumns ? <SidePanel
                    rowClassName="rx-RowLeft"
                    data={props.data}
                    frame={framer.frame}
                    rowSelector={true}
                    columnDef={columnDef.current}
                    position="left"/> : undefined}
                {centerColumns ? <>
                        <HeaderRow panel="center"
                                   resizableColumns={props.resizableColumns}
                                   columns={centerColumns}
                                   tableSelector={false}
                                   className="rx-HeaderRowCenter"
                                   colsFrame={framer.frame.cols}/>
                        <Body
                            virtualization={true}
                            data={props.data}
                            columns={centerColumns as any}
                            frame={framer.frame}/>
                    </>
                    : undefined}
            </div>
        </div>
    </div>
}