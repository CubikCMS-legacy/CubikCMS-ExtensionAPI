import { Message } from './parentMessages';
import { randomBytes } from 'crypto';

export interface Message {
    type: string;
    code: string;
    values: any[];
    token?: string;
}

export function send(msg: Message) {
    if(typeof process.send !== "undefined") {
        process.send(msg);
    }
}

export function listen(searched_type: string, listener: (msg: Message) => boolean | void) {

    function messageListener(message: Message) {
        // If not an object, niet.
        if(typeof message !== "object") return;
    
        const { type, code, values } = message;
        
        // If type is not a string
        if(typeof type !== "string") return;
        // If current type is not what wee're looking for or "any", stop looking message.
        if(type !== searched_type && searched_type !== "any") return;
        // If code is not a string, stop.
        if(typeof code !== "string") return;
        // If values are not in array
        if(typeof values === "undefined" || values ! instanceof Array) return;
        
        // Call the listener with the data
        var stillLoop = listener({type, code, values});

        if(stillLoop === false) {
            process.removeListener('message', messageListener);
        }
    }

    process.addListener('message', messageListener);
}


export function get(code: string, ...values: any[]) {
    return new Promise<Message>((resolve) => {
        randomBytes(48, function(err, buffer) {
            var genToken = buffer.toString("hex");
            
            send({
                type: 'request',
                code,
                values,
                token: genToken
            });
    
            listen('response', (msg) => {
                if(msg.token === genToken) {
                    resolve(msg);
                    return false;
                }
            });
        });
    });
}