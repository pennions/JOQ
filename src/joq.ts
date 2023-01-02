import { FilterDetail, filterJsonArray, FilterType } from "./functions/filter";
import { SortDetail, SortDirection, sortJsonArray } from "./functions/sort";

class JOQ {

    private model: Array<any>;
    private sortDetails: Array<SortDetail> = [];
    private filterDetails: Array<FilterDetail> = [];

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

    groupBy() { return 'Not implemented'; };
    thenBy() { return 'Not implemented'; };

    sum() { return 'Not implemented'; };
    select() { return 'Not implemented'; };
    execute() {
        const queryResults = filterJsonArray(this.model, this.filterDetails);
        sortJsonArray(queryResults, this.sortDetails);
        return queryResults;
    }
}

export default JOQ;