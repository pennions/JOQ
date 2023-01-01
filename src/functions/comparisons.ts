const bigger = (value: any, comparisonValue: any) => value > comparisonValue;
const smaller = (value: any, comparisonValue: any) => value < comparisonValue;
const biggerEquals = (value: any, comparisonValue: any) => value >= comparisonValue;
const smallerEquals = (value: any, comparisonValue: any) => value <= comparisonValue;
const equals = (value: any, comparisonValue: any) => value == comparisonValue;
const superEquals = (value: any, comparisonValue: any) => value === comparisonValue;
const notEquals = (value: any, comparisonValue: any) => value != comparisonValue;
const superNotEquals = (value: any, comparisonValue: any) => value !== comparisonValue;

const like = (value: any, comparisonValue: any) => {
    if (comparisonValue !== null && comparisonValue !== undefined && typeof value === 'string') {
        return value.toLowerCase().indexOf(comparisonValue.toString().toLowerCase()) >= 0;
    }
    else return false;
};

const genericLike = (value: any, comparisonValue: any) => {
    if (comparisonValue !== null && comparisonValue !== undefined) {
        return value.toString().toLowerCase().indexOf(comparisonValue.toString().toLowerCase()) >= 0;
    }
    else return false;
};

const notLike = (value: any, comparisonValue: any) => {
    if (comparisonValue !== null && comparisonValue !== undefined && typeof value === 'string') {
        return value.toLowerCase().indexOf(comparisonValue.toString().toLowerCase()) < 0;
    }
    return false;
};

export function getComparisonFunction(comparisonOperator: string): Function {
    switch (comparisonOperator.toLowerCase()) {
        case ">":
            return bigger;
        case "<":
            return smaller;
        case ">=":
            return biggerEquals;
        case "<=":
            return smallerEquals;
        case "is":
        case "==":
            return equals;
        case "!is":
        case "!=":
            return notEquals;
        case "===":
            return superEquals;
        case "!==":
            return superNotEquals;
        case "like":
        case "~":
            return like;
        case "!like":
        case "!~":
            return notLike;
        default:
            return genericLike;
    }
}