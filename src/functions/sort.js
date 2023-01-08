(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sortGroupedJsonArray = exports.sortJsonArray = exports.SortDetail = exports.SortDirection = void 0;
    var SortDirection;
    (function (SortDirection) {
        SortDirection["ascending"] = "asc";
        SortDirection["descending"] = "desc";
    })(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
    class SortDetail {
        column;
        direction;
        constructor(column, direction) {
            this.column = column;
            this.direction = direction;
        }
    }
    exports.SortDetail = SortDetail;
    function sortJsonArray(jsonArray, sortDetails) {
        if (!sortDetails || sortDetails.length === 0)
            return jsonArray;
        if (Array.isArray(jsonArray[0])) {
            (0, exports.sortGroupedJsonArray)(jsonArray, sortDetails);
        }
        else {
            jsonArray.sort(sortFunction(sortDetails));
        }
    }
    exports.sortJsonArray = sortJsonArray;
    ;
    const sortGroupedJsonArray = (groupedJsonArray, sortDetails) => {
        const result = [];
        for (const jsonArray of groupedJsonArray) {
            result.push(jsonArray.sort(sortFunction(sortDetails)));
        }
        return result;
    };
    exports.sortGroupedJsonArray = sortGroupedJsonArray;
    function sortFunction(applicableSorters, index = 0) {
        return function (a, b) {
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
});
