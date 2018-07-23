import { randomBytes } from "crypto";
import { hasEntriesInObject } from "../objectHelpers";

export interface Message {
    cmd: string;
    code: string;
    values: any[];
    token?: string;
}
export interface MessageMatch {
    cmd?: string;
    code?: string;
    values?: any[];
    token?: string;
}

export function send(msg: Message) {
    if (typeof process.send !== "undefined") {
        process.send(msg);
    }
}

export function listen(match: MessageMatch, listener: (msg: Message) => boolean | void) {

    function messageListener(message: Message) {
        // If not an object, niet.
        if (typeof message !== "object") { return; }

        const { cmd, code, values } = message;

        // If cmd is not a string
        if (typeof cmd !== "string") { return; }
        // If matched properties are in the message
        if (hasEntriesInObject(match, message)) { return; }
        // If code is not a string, stop.
        if (typeof code !== "string") { return; }
        // If values are not in array
        if (typeof values === "undefined" || values ! instanceof Array) { return; }

        // Call the listener with the data
        const stillLoop = listener({cmd, code, values});

        if (stillLoop === false) {
            process.removeListener("message", messageListener);
        }
    }

    process.addListener("message", messageListener);
}

export function get(code: string, ...values: any[]) {
    return new Promise<Message>((resolve) => {
        randomBytes(48, (err, buffer) => {
            const genToken = buffer.toString("hex");

            send({
                cmd: "requestInformation",
                code,
                token: genToken,
                values,
            });

            listen({
                cmd: "retrieveInformation",
                token: genToken,
            }, (msg) => resolve(msg));
        });
    });
}
