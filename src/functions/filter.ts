import { getComparisonFunction } from "./comparisons";
import { TypeConversion } from "./services/value";

export enum FilterType {
    And = "and",
    Or = "or"
}

export enum FilterOperator {
    Greater = ">",
    Lesser = "<",
    EqualOrGreater = ">=",
    EqualOrLesser = "<=",
    Is = "is",
    Equal = "==",
    NotEqual = "!=",
    SuperEqual = "===",
    SuperNotEqual = "!==",
    Like = "like",
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
        for (const filter of filterGroup) {
            indexThatMatch = indexThatMatch.concat(compareValues(jsonArray, filter));
        }
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

export const compareValues = function (jsonArray: Array<any>, filterDetail: FilterDetail): number[] {
    const indexes: number[] = [];
    if (!jsonArray) return indexes;

    const comparisonValue = TypeConversion(filterDetail.value).value;
    const comparisonFunction = getComparisonFunction(filterDetail.operator);

    const arrayLength = jsonArray.length;
    for (let index = 0; index < arrayLength; index++) {
        const objectToCheck = jsonArray[index];

        if (comparisonFunction(objectToCheck[filterDetail.column], comparisonValue)) indexes.push(index);
    }
    return indexes;
};