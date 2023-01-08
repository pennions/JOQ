(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./services/comparisons", "./services/value"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compareValues = exports.filterJsonArray = exports.FilterDetail = exports.FilterOperator = exports.FilterType = void 0;
    const comparisons_1 = require("./services/comparisons");
    const value_1 = require("./services/value");
    var FilterType;
    (function (FilterType) {
        FilterType["And"] = "and";
        FilterType["Or"] = "or";
    })(FilterType = exports.FilterType || (exports.FilterType = {}));
    var FilterOperator;
    (function (FilterOperator) {
        FilterOperator["Greater"] = ">";
        FilterOperator["Lesser"] = "<";
        FilterOperator["EqualsOrGreater"] = ">=";
        FilterOperator["EqualsOrLesser"] = "<=";
        FilterOperator["Is"] = "is";
        FilterOperator["Equals"] = "==";
        FilterOperator["NotEquals"] = "!=";
        FilterOperator["SuperEquals"] = "===";
        FilterOperator["SuperNotEquals"] = "!==";
        FilterOperator["Like"] = "like";
    })(FilterOperator = exports.FilterOperator || (exports.FilterOperator = {}));
    class FilterDetail {
        column;
        value;
        operator;
        type;
        constructor(column, value, operator, type) {
            this.column = column;
            this.value = value;
            this.operator = operator;
            this.type = type;
        }
    }
    exports.FilterDetail = FilterDetail;
    function filterJsonArray(jsonArray, filterDetails) {
        if (filterDetails.length === 0)
            return jsonArray;
        return filterFunction(jsonArray, filterDetails);
    }
    exports.filterJsonArray = filterJsonArray;
    ;
    function filterFunction(jsonArray, filterDetails) {
        const searchResults = [];
        const filters = [];
        let filterGroup = [];
        for (const filter of filterDetails) {
            if (!filter.type || filter.type === FilterType.And) {
                filterGroup.push(filter);
            }
            else {
                filters.push(filterGroup);
                filterGroup = [filter];
            }
        }
        filters.push(filterGroup);
        let indexThatMatch = [];
        for (const filterGroup of filters) {
            indexThatMatch = indexThatMatch.concat((0, exports.compareValues)(jsonArray, filterGroup));
        }
        /** deduplicate */
        indexThatMatch = [...new Set(indexThatMatch)];
        const jsonArrayLength = jsonArray.length;
        for (let index = 0; index < jsonArrayLength; index++) {
            if (indexThatMatch.includes(index)) {
                searchResults.push(jsonArray[index]);
            }
        }
        return searchResults;
    }
    const compareValues = function (jsonArray, filterDetails) {
        const matches = [];
        if (!jsonArray)
            return matches;
        for (const [index, objectToCheck] of jsonArray.entries()) {
            let itemMatches = true;
            for (const filterDetail of filterDetails) {
                const valuetocheck = (0, value_1.TypeConversion)(objectToCheck[filterDetail.column]).value;
                const comparisonValue = (0, value_1.TypeConversion)(filterDetail.value).value;
                const comparisonFunction = (0, comparisons_1.getComparisonFunction)(filterDetail.operator);
                if (!comparisonFunction(valuetocheck, comparisonValue)) {
                    itemMatches = false;
                    break;
                }
            }
            /** pushing the index so we can deduplicate later with other or clauses */
            if (itemMatches) {
                matches.push(index);
            }
        }
        return matches;
    };
    exports.compareValues = compareValues;
});
