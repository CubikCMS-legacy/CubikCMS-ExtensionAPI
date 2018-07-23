export function hasEntriesInObject(entriesObject: any, object: any) {
    const property = Object.getOwnPropertyNames(entriesObject);

    for (const propertyName of property) {
        if (object[propertyName] !== entriesObject[propertyName]) {
            return false;
        }
    }

    return true;
}
