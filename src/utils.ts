import type {ModKey, RowRange, ScrollState, Size, XType} from "./types.ts";

export function buildColumnSizeStyle(index: number, width: string) {
    if (!width) {
        width = "100px";
    }
    return `.rxg_col_${index}{width:${width}!important;min-width:${width}!important;max-width:${width}!important;}`
}

export function getModifierKey(e: MouseEvent): ModKey | null {
    if (e.altKey) {
        return "alt";
    }
    if (e.ctrlKey) {
        return "ctrl";
    }
    if (e.shiftKey) {
        return "shift";
    }
    return null;
}

export function getElementWidth(el: HTMLElement) {
    return parseFloat(window.getComputedStyle(el).width.replace('px', ''));
}

export function getElementHeight(el: HTMLElement) {
    return parseFloat(window.getComputedStyle(el).height.replace('px', ''));
}

/**
 * Traverse the DOM up until it found a xtype data-*.
 * @param el
 */
export function getNodeXType(el: HTMLElement): null | [XType, HTMLElement] {
    let xtype = null;
    let node: HTMLElement | null = el;
    while (node) {
        if (node.dataset && (xtype = node.dataset['xtype'])) {
            return [xtype, node];
        }
        node = node.parentElement;
    }
    return null;
}

export type IMesureService = {
    mesure: (text: string) => number;
    end: () => void;
};

export function createMesureService(): IMesureService {
    const span = document.createElement("span") as HTMLSpanElement;
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    document.body.appendChild(span);
    return {
        mesure: (text: string) => {
            span.textContent = text;
            return getElementWidth(span);
        },
        end: () => {
            document.body.removeChild(span);
        }
    }
}

export function isSameRange(a: RowRange, b: RowRange) {
    return a.start === b.start && a.count === b.count;
}

export function getElementScroll(element: HTMLDivElement): ScrollState {
    const x = element.scrollLeft;
    const y = element.scrollTop;
    return {x, y};
}

export function getScrollType(previous: ScrollState, current: ScrollState) {
    return {isTop: previous.y !== current.y, isLeft: previous.x !== current.x};
}

export function getVisibleRows(rowHeight: number, viewportEl: HTMLDivElement | null) {
    let containerHeight = 0;
    let count = 0;
    if (viewportEl) {
        containerHeight = parseInt(window.getComputedStyle(viewportEl).height);
        count = Math.ceil(containerHeight / rowHeight);
    }
    return {viewportHeight: containerHeight, count};
}

export function getRowRange(firstVisibleIndex: number, visibleRows: number) {
    let startExtra = 0;
    if (firstVisibleIndex > 0) {
        if (firstVisibleIndex < 4) {
            startExtra = firstVisibleIndex % 4;
        } else {
            startExtra = 4;
        }
    }

    firstVisibleIndex = firstVisibleIndex - startExtra;

    return {
        startExtra,
        start: firstVisibleIndex,
        count: visibleRows
    };
}

export function translateY(el: HTMLDivElement | null | undefined, y: number) {
    if (el) {
        el.style.transform = `translate(0, ${y}px)`;
    }
}

export function translateX(el: HTMLDivElement | null | undefined, x: number) {
    if (el) {
        el.style.transform = `translate(${x}px, 0)`;
    }
}

export function getElementSize(el?: HTMLElement): Size {
    if (!el) {
        return {width: 0, height: 0};
    }
    const {width, height} = window.getComputedStyle(el);
    return {
        width: parseFloat(width),
        height: parseFloat(height),
    }
}