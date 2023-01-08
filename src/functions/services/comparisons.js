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
    exports.getComparisonFunction = void 0;
    const bigger = (value, comparisonValue) => value > comparisonValue;
    const smaller = (value, comparisonValue) => value < comparisonValue;
    const biggerEquals = (value, comparisonValue) => value >= comparisonValue;
    const smallerEquals = (value, comparisonValue) => value <= comparisonValue;
    const equals = (value, comparisonValue) => value == comparisonValue;
    const superEquals = (value, comparisonValue) => value === comparisonValue;
    const notEquals = (value, comparisonValue) => value != comparisonValue;
    const superNotEquals = (value, comparisonValue) => value !== comparisonValue;
    const like = (value, comparisonValue) => {
        if (comparisonValue !== null && comparisonValue !== undefined && typeof value === 'string') {
            return value.toLowerCase().indexOf(comparisonValue.toString().toLowerCase()) >= 0;
        }
        else
            return false;
    };
    const genericLike = (value, comparisonValue) => {
        if (comparisonValue !== null && comparisonValue !== undefined) {
            return value.toString().toLowerCase().indexOf(comparisonValue.toString().toLowerCase()) >= 0;
        }
        else
            return false;
    };
    const notLike = (value, comparisonValue) => {
        if (comparisonValue !== null && comparisonValue !== undefined && typeof value === 'string') {
            return value.toLowerCase().indexOf(comparisonValue.toString().toLowerCase()) < 0;
        }
        return false;
    };
    function getComparisonFunction(comparisonOperator) {
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
    exports.getComparisonFunction = getComparisonFunction;
});
