
export function selectJsonArray(jsonArray: Array<any>, selection: Array<string>): any {
    if (selection.length === 0) return jsonArray;
    return selectFunction(jsonArray, selection);
};

function selectFunction(jsonArray: Array<any>, selection: Array<string>) {

    let subselectedJsonArray = [];

    for (const object of jsonArray) {
        const newObject: Record<string, any> = {};

        for (const property of selection) {
            newObject[property] = object[property];
        }
        subselectedJsonArray.push(newObject);
    }
    return subselectedJsonArray;
}