import { EventCode } from "../extensionCodes";
import { listen } from "../helpers/messengers/parentMessenger";

export function onReady(listener: () => void) {
    listen({
        cmd: "emitEvent",
        code: EventCode.CORE_READY,
    }, ({code}) => listener());
}
