import { getComparisonFunction } from "./services/comparisons";
import { getColumnValue, TypeConversion } from "./services/value";

export enum FilterType {
    And = "and",
    Or = "or"
}

export enum FilterOperator {
    GreaterThan = ">",
    LesserThan = "<",
    EqualsOrGreater = ">=",
    EqualsOrLesser = "<=",
    Is = "is",
    Equals = "==",
    NotEquals = "!=",
    SuperEquals = "===",
    SuperNotEquals = "!==",
    Like = "like",
    NotLike = "!like",
    Contains = "contains",
    NotContains = "!contains"
}

export class FilterDetail {
    constructor(public column: string, public value: any, public operator: FilterOperator, public type?: FilterType) { }
}

export function filterJsonArray(jsonArray: Array<any>, filterDetails: Array<FilterDetail>): any {
    if (filterDetails.length === 0) return jsonArray;
    return filterFunction(jsonArray, filterDetails);
};

function filterFunction(jsonArray: Array<any>, filterDetails: Array<FilterDetail>) {
    const searchResults: Array<any> = [];
    const filters = [];
    let filterGroup: Array<FilterDetail> = [];

    for (const filter of filterDetails) {
        if (!filter.type || filter.type === FilterType.And) {
            filterGroup.push(filter);
        } else {
            filters.push(filterGroup);
            filterGroup = [filter];
        }
    }
    filters.push(filterGroup);

    let indexThatMatch: Array<number> = [];

    for (const filterGroup of filters) {
        indexThatMatch = indexThatMatch.concat(compareValues(jsonArray, filterGroup));
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

export const compareValues = function (jsonArray: Array<any>, filterDetails: Array<FilterDetail>): number[] {
    const matches: any[] = [];
    if (!jsonArray) return matches;

    for (const [index, objectToCheck] of jsonArray.entries()) {
        let itemMatches = true;
        for (const filterDetail of filterDetails) {
            const columnValue = getColumnValue(filterDetail.column, objectToCheck);
            const parsedValue = TypeConversion(columnValue).value;
            const comparisonValue = TypeConversion(filterDetail.value).value;

            const comparisonFunction = getComparisonFunction(filterDetail.operator);

            if (!comparisonFunction(parsedValue, comparisonValue)) {
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