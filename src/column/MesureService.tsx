import {getElementWidth, IMesureService} from "../utils.ts";

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