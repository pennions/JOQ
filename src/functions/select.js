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
    exports.selectJsonArray = void 0;
    function selectJsonArray(jsonArray, selection) {
        if (selection.length === 0)
            return jsonArray;
        return selectFunction(jsonArray, selection);
    }
    exports.selectJsonArray = selectJsonArray;
    ;
    function selectFunction(jsonArray, selection) {
        let subselectedJsonArray = [];
        for (const object of jsonArray) {
            const newObject = {};
            for (const property of selection) {
                newObject[property] = object[property];
            }
            subselectedJsonArray.push(newObject);
        }
        return subselectedJsonArray;
    }
});
