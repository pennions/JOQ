import { FilterDetail, filterJsonArray, FilterType } from "./functions/filter";
import { groupJsonArray } from "./functions/group";
import { selectJsonArray } from "./functions/select";
import { SortDetail, SortDirection, sortJsonArray } from "./functions/sort";
import { sumJsonArray } from "./functions/sum";

class JOQ {

    private model: Array<any>;
    private sortDetails: Array<SortDetail> = [];
    private filterDetails: Array<FilterDetail> = [];
    private selection: Array<string> = [];
    private groupByProperties: Array<string> = [];

    /**
     * Jelmers Object Query Class
     */
    constructor(jsonArray: Array<any>) {
        /** Make a hard copy */
        this.model = Object.assign([], jsonArray);
    }

    /** Same as order, but here you can give the complete sorting details.*/
    sort(sortDetails: Array<SortDetail>) {
        this.sortDetails = sortDetails;
        return this;
    }

    /** Order the array ascending or descending for the values of given property*/
    orderBy(propertyName: string, direction: SortDirection) {
        this.sortDetails.push({ column: propertyName, direction });
        return this;
    }

    /** Add a consecutive ordering of the array ascending or descending for the values of given property*/
    thenOrderBy(propertyName: string, direction: SortDirection) {
        return this.orderBy(propertyName, direction);
    }

    /**
     * Set the complete where clause specifications
     * @param {Array<FilterDetail>} filterDetails an array with { column: string, value: any, operator: FilterOperator, type?: FilterType }
     * @returns 
     */
    where(filterDetails: Array<FilterDetail>) {
        this.filterDetails = filterDetails;
        return this;
    };

    /** Same as where, but prefills the FilterType with 'and' */
    andWhere(filterDetail: FilterDetail) {
        filterDetail.type = FilterType.And;
        this.filterDetails.push(filterDetail);
        return this;
    };

    /** Same as where, but prefills the FilterType with 'or' */
    orWhere(filterDetail: FilterDetail) {
        filterDetail.type = FilterType.Or;
        this.filterDetails.push(filterDetail);
        return this;
    };

    /**
     * Sets propertynames that you want to group on, order matters.
     * @param {Array<string> | String} groupByProperties 
     * @returns joq object
     */
    group(groupByProperties: Array<string> | string) {
        if (Array.isArray(groupByProperties)) {
            this.groupByProperties = groupByProperties;
        }
        else {
            this.groupByProperties.push(groupByProperties);
        }
        return this;
    }

    /** Same as group, semantic sugar */
    groupBy(property: string) {
        this.groupByProperties.push(property);
        return this;
    };

    /** Same as group, semantic sugar */
    thenGroupBy(property: string) {
        this.groupByProperties.push(property);
        return this;
    };

    /**
     * Subselects all objects based on provided selection.
     */
    select(selection: Array<string> | string) {
        if (Array.isArray(selection)) {
            this.selection = selection;
        }
        else if (selection !== "*") {
            this.selection = [selection];
        }
    };

    /** Executes selection, group and where statements provided */
    execute() {
        const selectedJsonArray = selectJsonArray(this.model, this.selection);
        const filteredJsonArray = filterJsonArray(selectedJsonArray, this.filterDetails);
        const groupedJsonArray = groupJsonArray(filteredJsonArray, this.groupByProperties);
        sortJsonArray(groupedJsonArray, this.sortDetails);
        return groupedJsonArray;
    }

    /**
     * @param sumProperties string or string array with the propertynames which you want to sum.
     * @param jsonArray *optional* can be used with your own object array, or a subselection, default uses the one that you initialized JOQ with.
     * @returns an object with { property: sum}
     */
    sum(sumProperties: Array<string> | string, jsonArray?: Array<any>) {
        const propertiesToSum = Array.isArray(sumProperties) ? sumProperties : [sumProperties];
        return sumJsonArray(jsonArray || this.model, propertiesToSum);
    };
}

export default JOQ;
