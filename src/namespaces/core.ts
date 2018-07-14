import { EventCode } from "../extensionCodes";
import { listen } from "../parentMessages";

export function onReady(listener: () => void) {
    listen("event", ({code}) => {
        if (code === EventCode.CORE_READY) {
            listener();
        }
    });
}
