import { FilterDetail, filterJsonArray, FilterOperator, FilterType } from "./functions/filter";
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
        this.sortDetails.push({ propertyName, direction });
        return this;
    }

    /** Add a consecutive ordering of the array ascending or descending for the values of given property*/
    thenOrderBy(propertyName: string, direction: SortDirection) {
        return this.orderBy(propertyName, direction);
    }

    /**
     * Set the complete where / filter clause specification, for automated processes
     * @param {Array<FilterDetail>} filterDetails an array with { column: string, value: any, operator: FilterOperator, type?: FilterType }
     * @returns 
     */
    filter(filterDetails: Array<FilterDetail>) {
        if (Array.isArray(filterDetails)) {
            this.filterDetails = filterDetails;
        }
        else {
            this.filterDetails.push(filterDetails);
        }
        return this;
    };

    /**
     * Add a where clause
     * @param {Array<FilterDetail>} filterDetails an array with { column: string, value: any, operator: FilterOperator, type?: FilterType }
     * @returns 
     */
    where(propertyName: string, operator: FilterOperator, value: any, type?: FilterType) {
        this.filterDetails.push({ propertyName, operator, value, type });
        return this;
    };

    /** Same as where, but prefills the FilterType with 'and' */
    andWhere(propertyName: string, operator: FilterOperator, value: any) {
        this.where(propertyName, operator, value, FilterType.And);
        return this;
    };

    /** Same as where, but prefills the FilterType with 'or' */
    orWhere(propertyName: string, operator: FilterOperator, value: any) {
        this.where(propertyName, operator, value, FilterType.Or);
        return this;
    };

    /**
     * Sets propertynames that you want to group on, order matters.
     * @param {Array<string> | String} groupByProperties 
     * @returns joq object
     */
    group(groupByProperties: Array<string>) {
        this.groupByProperties = groupByProperties;
        return this;
    }

    /** Same as group, semantic sugar */
    groupBy(propertyName: string) {
        this.groupByProperties.push(propertyName);
        return this;
    };

    /** Same as group, semantic sugar */
    thenGroupBy(propertyName: string) {
        this.groupByProperties.push(propertyName);
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
        const sortedJsonArray = sortJsonArray(filteredJsonArray, this.sortDetails);
        const groupedJsonArray = groupJsonArray(sortedJsonArray, this.groupByProperties);
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
