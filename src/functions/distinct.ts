import { getColumnValue } from "./services/value";

export function distinctJsonProperties(jsonArray: Array<any>, columnNames: Array<string>) {

    /** Nothing to distinct */
    if (!columnNames || !columnNames.length) {
        return jsonArray;
    }

    const groupedObjects: any = [];
    const criteriaMet: Array<string> = [];

    for (const jsonObject of jsonArray) {
        const criteria: any = {};

        let newCriteria = "";

        for (const criteriaColumn of columnNames) {
            const critValue = getColumnValue(criteriaColumn, jsonObject);
            /** for use to group */
            criteria[criteriaColumn] = critValue;
            /** track which combination of values has been grouped already  */
            newCriteria += critValue;
        }

        if (!criteriaMet.includes(newCriteria)) {
            let critGroup = jsonArray;
            const criteriaKeys = Object.keys(criteria);
            for (const critKey of criteriaKeys) {
                critGroup = critGroup.filter(
                    (obj: any) => obj[critKey] === criteria[critKey]
                );
            }
            criteriaMet.push(newCriteria);
            groupedObjects.push(critGroup);
        }
    }
    const mergedObjects: any = [];

    for (const objectGroup of groupedObjects) {
        let mergedObject: any = {};

        for (const jsonObject of objectGroup) {
            const jsonProperties = Object.keys(mergedObject);

            if (!jsonProperties.length) {
                mergedObject = jsonObject;
                continue;
            }

            for (const column of jsonProperties) {
                if (!columnNames.includes(column)) {
                    const mergedValue = mergedObject[column];

                    if (Array.isArray(mergedValue)) {
                        const valueToMerge = jsonObject[column];
                        if (Array.isArray(valueToMerge)) {
                            mergedObject[column] = [
                                ...new Set(...mergedObject[column].concat(jsonObject[column])),
                            ];
                        } else {
                            if (!mergedObject[column].includes(jsonObject[column])) {
                                mergedObject[column].push(jsonObject[column]);
                            }
                        }
                    } else {

                        if (isNaN(mergedObject[column]) && isNaN(jsonObject[column])) {
                            if (mergedObject[column] !== jsonObject[column]) {
                                mergedObject[column] = [
                                    mergedObject[column],
                                    jsonObject[column],
                                ];
                            }
                        } else {
                            mergedObject[column] =
                                mergedObject[column] + jsonObject[column];
                        }
                    }
                }
            }
        }
        mergedObjects.push(mergedObject);
    }

    /** merge the arrays */
    mergedObjects.forEach((jsonObject: any) => {
        for (const prop in jsonObject) {
            if (Array.isArray(jsonObject[prop])) {
                jsonObject[prop] = jsonObject[prop].join(", ");
            }
        }
    });

    return mergedObjects;
}