import { EventCode } from "../extensionCodes";
import { get, listen } from "../helpers/messengers/parentMessenger";
import { RequestCode } from "./../extensionCodes";

export function onLoad(listener: () => void) {
    listen({
        cmd: "emitEvent",
        code: EventCode.EXTENSION_LOAD,
    }, ({code}) => listener());
}

export function onUnload(listener: () => void) {
    listen({
        cmd: "emitEvent",
        code: EventCode.EXTENSION_UNLOAD,
    }, ({code}) => listener());
}

export async function getLoadedExtensions() {
    return get(RequestCode.GET_EXTENSIONS);
}
