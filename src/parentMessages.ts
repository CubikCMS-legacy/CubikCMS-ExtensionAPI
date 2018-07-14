import { randomBytes } from "crypto";
import { Message } from "./parentMessages";

export interface Message {
    type: string;
    code: string;
    values: any[];
    token?: string;
}

export function send(msg: Message) {
    if (typeof process.send !== "undefined") {
        process.send(msg);
    }
}

export function listen(searchedType: string, listener: (msg: Message) => boolean | void) {

    function messageListener(message: Message) {
        // If not an object, niet.
        if (typeof message !== "object") { return; }

        const { type, code, values } = message;

        // If type is not a string
        if (typeof type !== "string") { return; }
        // If current type is not what wee're looking for or "any", stop looking message.
        if (type !== searchedType && searchedType !== "any") { return; }
        // If code is not a string, stop.
        if (typeof code !== "string") { return; }
        // If values are not in array
        if (typeof values === "undefined" || values ! instanceof Array) { return; }

        // Call the listener with the data
        const stillLoop = listener({type, code, values});

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
                code,
                token: genToken,
                type: "request",
                values,
            });

            listen("response", (msg) => {
                if (msg.token === genToken) {
                    resolve(msg);
                    return false;
                }
            });
        });
    });
}
