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
    exports.groupJsonArray = void 0;
    function groupJsonArray(jsonArray, groupByProperties) {
        if (!groupByProperties || groupByProperties.length === 0)
            return jsonArray;
        if (groupByProperties.length > 1) {
            return multipleGroupFunction(jsonArray, groupByProperties);
        }
        else {
            return groupFunction(jsonArray, groupByProperties[0]);
        }
    }
    exports.groupJsonArray = groupJsonArray;
    function groupFunction(objects, groupByProperty) {
        const arrayOfGroupedObjects = [];
        const groupIndex = []; // the index in the arrayOfGroupedObjects
        do {
            if (!objects || objects.length === 0)
                break;
            const nextInline = objects.pop();
            if (!nextInline)
                break;
            const value = nextInline[groupByProperty];
            const index = groupIndex.indexOf(value.toString());
            if (index >= 0) {
                arrayOfGroupedObjects[index].push(nextInline);
            }
            else {
                groupIndex.push(value.toString());
                if (arrayOfGroupedObjects[groupIndex.length - 1] !== undefined) // If it's not empty, we push a new one inside existing array
                    arrayOfGroupedObjects[groupIndex.length - 1].push(nextInline);
                else {
                    arrayOfGroupedObjects.push([nextInline]); // We create a new array and push that
                }
            }
        } while (objects.length > 0);
        return arrayOfGroupedObjects;
    }
    ;
    function multipleGroupFunction(objects, groupByProperties) {
        let arrayOfGroupedObjects = [];
        let tempArray = [];
        groupByProperties.forEach((property) => {
            // we start
            if (arrayOfGroupedObjects.length === 0) {
                arrayOfGroupedObjects = arrayOfGroupedObjects.concat(groupFunction(objects, property));
            }
            else {
                for (const objectArray of arrayOfGroupedObjects) {
                    tempArray = tempArray.concat(groupFunction(objectArray, property));
                }
                arrayOfGroupedObjects = tempArray;
                tempArray = [];
            }
        });
        return arrayOfGroupedObjects;
    }
    ;
});
