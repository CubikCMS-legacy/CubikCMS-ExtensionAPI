import { listen } from "../parentMessages";
import { EventCode } from "../extensionCodes";

export function onReady(listener: () => void) {
    listen('event', ({code}) => {
        if(code == EventCode.CORE_READY){
            listener();
        }
    })
}