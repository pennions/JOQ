import { DataType, TypeCheck } from "./services/value";

export const sumJsonArray = (jsonArray: Array<any>, propertiesToSum: Array<string>) => {

    if (!propertiesToSum) return {};
    return sumFunction(jsonArray, propertiesToSum);
};

function sumFunction(jsonArray: Array<any>, propertiesToSum: Array<string>) {
    const sumObject: any = {};
    for (const sumProperty of propertiesToSum) {
        let allValuesToSum = jsonArray.map(object => object[sumProperty].toString());
        const dataTypes = allValuesToSum.map(value => TypeCheck(value));
        const isFloat = dataTypes.some(type => type === DataType.Float);


        if (isFloat) {
            allValuesToSum = allValuesToSum.map(value => parseFloat(value));
            sumObject[sumProperty] = parseFloat(allValuesToSum.reduce((a, b) => a + b).toFixed(2));
        }
        else {
            allValuesToSum = allValuesToSum.map(value => parseInt(value));
            sumObject[sumProperty] = allValuesToSum.reduce((a, b) => a + b);
        }

    }
    return sumObject;
}