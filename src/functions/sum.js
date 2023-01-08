(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./services/value"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumJsonArray = void 0;
    const value_1 = require("./services/value");
    const sumJsonArray = (jsonArray, propertiesToSum) => {
        if (!propertiesToSum)
            return {};
        return sumFunction(jsonArray, propertiesToSum);
    };
    exports.sumJsonArray = sumJsonArray;
    function sumFunction(jsonArray, propertiesToSum) {
        const sumObject = {};
        for (const sumProperty of propertiesToSum) {
            let allValuesToSum = jsonArray.map(object => object[sumProperty].toString());
            const dataTypes = allValuesToSum.map(value => (0, value_1.TypeCheck)(value));
            const isFloat = dataTypes.some(type => type === value_1.DataType.Float);
            if (isFloat) {
                allValuesToSum = allValuesToSum.map(value => parseFloat(value));
                sumObject[sumProperty] = parseFloat(allValuesToSum.reduce((a, b) => a + b).toFixed(2));
            }
            else {
                allValuesToSum = allValuesToSum.map(value => parseInt(value));
                sumObject[sumProperty] = allValuesToSum.reduce((a, b) => a + b);
            }
        }
        return sumObject;
    }
});
