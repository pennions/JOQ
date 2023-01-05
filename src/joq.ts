import { FilterDetail, filterJsonArray, FilterType } from "./functions/filter";
import { groupJsonArray } from "./functions/group";
import { selectJsonArray } from "./functions/select";
import { SortDetail, SortDirection, sortJsonArray } from "./functions/sort";

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

    where(filterDetails: Array<FilterDetail>) {
        this.filterDetails = filterDetails;
        return this;
    };

    andWhere(filterDetail: FilterDetail) {
        filterDetail.type = FilterType.And;
        this.filterDetails.push(filterDetail);
        return this;
    };

    orWhere(filterDetail: FilterDetail) {
        filterDetail.type = FilterType.Or;
        this.filterDetails.push(filterDetail);
        return this;
    };

    group(groupByProperties: Array<string> | string) {
        if (Array.isArray(groupByProperties)) {
            this.groupByProperties = groupByProperties;
        }
        else {
            this.groupByProperties.push(groupByProperties);
        }
        return this;
    }

    groupBy(property: string) {
        this.groupByProperties.push(property);
        return this;
    };
    thenGroupBy(property: string) {
        this.groupByProperties.push(property);
        return this;
    };

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

    sum() { return 'Not implemented'; };
}

export default JOQ;