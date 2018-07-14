import { EventCode } from "../extensionCodes";
import { get, listen } from "../parentMessages";
import { RequestCode } from "./../extensionCodes";

export function onLoad(listener: () => void) {
    listen("event", ({code}) => {
        if (code === EventCode.EXTENSION_LOAD) {
            listener();
        }
    });
}

export function onUnload(listener: () => void) {
    listen("event", ({code}) => {
        if (code === EventCode.EXTENSION_UNLOAD) {
            listener();
        }
    });
}

export async function getLoadedExtensions() {
    return get(RequestCode.GET_EXTENSIONS);
}
