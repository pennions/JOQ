export function groupJsonArray(jsonArray: Array<any>, groupByProperties: Array<string>) {
    if (!groupByProperties || groupByProperties.length === 0) return jsonArray;

    if (groupByProperties.length > 1) {
        return multipleGroupFunction(jsonArray, groupByProperties);
    }
    else {
        return groupFunction(jsonArray, groupByProperties[0]);
    }
}

function groupFunction(objects: Array<any>, groupByProperty: string): Array<any> {
    const arrayOfGroupedObjects: Array<any> = [];
    const groupIndex: Array<string> = []; // the index in the arrayOfGroupedObjects
    do {
        if (!objects || objects.length === 0) break;
        /** need to use shift instead of pop, because of sorting. else we are unintentionally reversing the array */
        const nextInline = objects.shift();

        if (!nextInline) break;

        const value = nextInline[groupByProperty];
        const index = groupIndex.indexOf(value.toString());

        if (index >= 0) {
            arrayOfGroupedObjects[index].push(nextInline);
        } else {
            groupIndex.push(value.toString());
            if (arrayOfGroupedObjects[groupIndex.length - 1] !== undefined) // If it's not empty, we push a new one inside existing array
                arrayOfGroupedObjects[groupIndex.length - 1].push(nextInline);
            else {
                arrayOfGroupedObjects.push([nextInline]); // We create a new array and push that
            }

        }
    } while (objects.length > 0);
    return arrayOfGroupedObjects;
};

function multipleGroupFunction(objects: Array<any>, groupByProperties: Array<string>): Array<any> {
    let arrayOfGroupedObjects: Array<any> = [];
    let tempArray: Array<any> = [];

    groupByProperties.forEach((property) => {
        // we start
        if (arrayOfGroupedObjects.length === 0) {
            arrayOfGroupedObjects = arrayOfGroupedObjects.concat(groupFunction(objects, property));
        }
        else {
            for (const objectArray of arrayOfGroupedObjects) {
                tempArray = tempArray.concat(groupFunction(objectArray, property));
            }
            arrayOfGroupedObjects = tempArray;
            tempArray = [];
        }
    });
    return arrayOfGroupedObjects;
};
