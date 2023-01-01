import { SortDetails, sortJsonArray } from "./functions/sort";

class JOQ {

    private model: Array<JSON>;

    /**
     * Jelmers Object Query Class
     */
    constructor(jsonArray: Array<JSON>) {
        /** Make a hard copy */
        this.model = Object.assign([], jsonArray);
    }

    sort(sortDetails: Array<SortDetails>) {
        sortJsonArray(this.model, sortDetails);
        return this;
    }

    where() { return 'Not implemented'; };
    andWhere() { return 'Not implemented'; };
    orWhere() { return 'Not implemented'; };

    groupBy() { return 'Not implemented'; };
    thenBy() { return 'Not implemented'; };

    sum() { return 'Not implemented'; };
    select() { return 'Not implemented'; };
    execute() {
        return this.model;
    }
}

export default JOQ;