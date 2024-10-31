import React, {CSSProperties} from "react";

export function useContainerStyle<T>(dataLen: number,
                                     rowHeight: number,
                                     containerWidth: number): CSSProperties {
    return React.useMemo(() => {
        return {
            height: dataLen * (rowHeight || 36) + 'px',
            width: containerWidth + 'px',
        };
    }, [containerWidth, rowHeight, dataLen]);
}