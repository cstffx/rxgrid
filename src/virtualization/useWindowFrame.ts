import React from "react";
import {ColumnDefinition} from "../column/ColumnDefinition.ts";
import type {RowFrame} from "../row/RowVirtualization.tsx";
import type {ColumnFrame} from "../column/ColumnVirtualization.ts";
import {getRowFrame, isSameRowFrame} from "../row/RowVirtualization.tsx";
import {getColumnsFrame, isSameColumnFrame} from "../column/ColumnVirtualization.ts";

const DEFAULT_SCROLL_CACHE = {
    top: -1,
    left: -1
}

export type WindowFrame = {
    rows: RowFrame;
    cols: ColumnFrame;
};

type UpdateFrameFn<T> = (viewport: HTMLDivElement, columnDef: ColumnDefinition<T>, data: T[], rowHeight: number) => void;

type UseWindowFrameResult<T> = {
    frame: WindowFrame,
    update: UpdateFrameFn<T>
}

function useWindowFrame<T>(): UseWindowFrameResult<T> {
    const scrollCache = React.useRef(DEFAULT_SCROLL_CACHE);
    const currentFrame = React.useRef<Partial<WindowFrame>>({});
    const [frame, setFrame] = React.useState<WindowFrame>(() => {
        return {
            rows: {
                lastRow: 0,
                firstRow: -1,
                firstVisibleRow: 0,
                lastVisibleRow: 0
            }, cols: {
                first: -1,
                last: 0,
                elapsedWidth: 0,
            }
        }
    });

    const updateFn = React.useRef<UpdateFrameFn<T>>(<const T>(viewport: HTMLDivElement,
                                                              columnDef: ColumnDefinition<T>,
                                                              data: T[],
                                                              rowHeight: number) => {
        const scrollTop = viewport.scrollTop;
        const scrollLeft = viewport.scrollLeft;
        const isVertical = scrollTop !== scrollCache.current.top;
        const isHorizontal = scrollLeft !== scrollCache.current.left;

        scrollCache.current.top = scrollTop;
        scrollCache.current.left = scrollLeft;

        // Nothing change. Exit.
        if (!isVertical && !isHorizontal) {
            return;
        }

        const resultFrame: Partial<WindowFrame> = {};

        let updateFrame = false;
        if (isVertical) {
            const rowFrame = getRowFrame(viewport, rowHeight, data);
            if (!(currentFrame.current.rows) || !isSameRowFrame(rowFrame, currentFrame.current.rows)) {
                resultFrame.rows = rowFrame;
                currentFrame.current.rows = rowFrame;
                updateFrame = true;
            }
        }

        if (isHorizontal) {
            const columnFrame = getColumnsFrame(viewport, columnDef);
            if (!(currentFrame.current.cols) || !isSameColumnFrame(columnFrame, currentFrame.current.cols)) {
                updateFrame = true;
                currentFrame.current.cols = columnFrame;
                resultFrame.cols = columnFrame;
            }
        }

        if (updateFrame) {
            setFrame(f => ({...f, ...resultFrame}));
        }
    });

    return {
        frame,
        update: updateFn.current
    };
}

export {useWindowFrame}