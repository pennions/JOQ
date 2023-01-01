export enum SortDirection {
    ascending = "asc",
    descending = "desc"
}

export class SortDetails {
    constructor(public column: string, public direction: SortDirection) { }
}

export function sortJsonArray(jsonArray: Array<any>, sortDetails: Array<SortDetails>): any {
    jsonArray.sort(sortFunction(sortDetails));
};

function sortFunction(applicableSorters: Array<SortDetails>, index = 0) {
    return function (a: any, b: any): number {

        const { column, direction } = applicableSorters[index];

        let valueA = a[column];
        let valueB = b[column];

        const dateRegex = /^(\d{1,4}-\d{1,4}-\d{1,4}(T)?)/gim;

        const valuesAreDates = (valueA instanceof Date && valueB instanceof Date) || (dateRegex.test(valueA) && dateRegex.test(valueB));
        if (valuesAreDates) {
            valueA = valueA instanceof Date ? valueA.valueOf() : new Date(Date.parse(valueA));
            valueB = valueB instanceof Date ? valueB.valueOf() : new Date(Date.parse(valueB));
        }

        const valuesAreNumbers = !isNaN(valueA) && !isNaN(valueB);
        if (valuesAreNumbers) {
            valueA = parseFloat(valueA).toPrecision(12);
            valueB = parseFloat(valueB).toPrecision(12);
        }

        const valuesAreBooleans = (valueA === "true" || valueA === "false") && (valueB === "true" || valueB === "false");

        if (valuesAreBooleans) {
            valueA = valueA === "true";
            valueB = valueB === "true";
        }


        /** set the values genericly */
        let leftHandValue, rightHandValue;

        switch (direction) {
            case SortDirection.descending: {
                leftHandValue = valueB;
                rightHandValue = valueA;
                break;
            }
            default: {
                leftHandValue = valueA;
                rightHandValue = valueB;
                break;
            }
        }

        // check if -1 or 1, 0. if 0 then check again.
        let comparisonValue = 0;

        if (valuesAreBooleans || valuesAreDates || valuesAreNumbers) {
            /** Yes this works for all these things. :D */
            comparisonValue = leftHandValue - rightHandValue;
        }
        else {
            leftHandValue = leftHandValue.toString().trim().toLowerCase();
            rightHandValue = rightHandValue.toString().trim().toLowerCase();

            const digitRegex = /\d/gmi;

            /** use this for the additional options in localeCompare */
            const valuesAreAlphaNumeric = digitRegex.test(valueA) && digitRegex.test(valueB);

            if (valuesAreAlphaNumeric) {
                comparisonValue = leftHandValue.localeCompare(rightHandValue, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            }
            else {
                comparisonValue = leftHandValue.localeCompare(rightHandValue);
            }
        }

        const nextSorterIndex = index + 1;

        /** the value is the same for this property and we have more sorters then go to the next */
        if (comparisonValue === 0 && nextSorterIndex < applicableSorters.length) {
            const sortWrapper = sortFunction(applicableSorters, nextSorterIndex);
            return sortWrapper(a, b);
        }
        else {
            return comparisonValue;
        }
    };
}