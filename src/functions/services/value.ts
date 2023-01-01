export type ValueInfo = {
    value: any;
    type: DataType;
    currencySign: string;
}

export enum DataType {
    Date = "date",
    String = "string",
    Float = "float",
    Number = "number",
    Array = "array",
    Object = "object",
    Bool = "bool",
    Currency = "currency",
    Undefined = "undefined"
}

const ValueRegexes = {
    date: /^(\d{1,4}-\d{1,4}-\d{1,4}(T)?)/gim,
    currency: /^[$|€]\s?[0-9]*(\.|,)?\d*(\.|,)?\d*/gim,
    float: /\d+[,|.]\d+[,|.]?\d*/gim,
    currencySign: /\$|€/gim,
    array: /^\s?[[].[^,]+[\]],?/gi,
    precision: /[-+$€,.]/gm,
    string: /[a-zA-Z]/gim
}

export const TypeCheck = (inputValue: any): DataType => {

    if (!inputValue && inputValue !== 0 && inputValue !== false) return DataType.Undefined; // !inputValue means also ignoring 0 and false

    const dateValue = new RegExp(ValueRegexes.date).exec(
        inputValue
    );

    if (dateValue !== null && !isNaN(Date.parse(inputValue))) {
        return DataType.Date;
    }

    if (new RegExp(ValueRegexes.currency).exec(inputValue)) {
        return DataType.Currency;
    }

    if (!isNaN(inputValue) || inputValue === 0) {
        return DataType.Number;
    }

    if (!new RegExp(ValueRegexes.string).exec(inputValue) && new RegExp(ValueRegexes.float).exec(inputValue.toString())) {
        return DataType.Float;
    }

    if (Array.isArray(inputValue)) {
        return DataType.Array;
    }

    if (typeof inputValue === "object") {
        return DataType.Object;
    }
    return DataType.String;
};

export const TypeConversion = (inputValue: any, dataType?: DataType): ValueInfo => {
    if (!dataType) dataType = TypeCheck(inputValue);

    const result: ValueInfo = { value: undefined, type: dataType, currencySign: "" };

    switch (result.type) {

        case DataType.String: {
            result.value = inputValue.toString();
            break;
        }
        case DataType.Float:
        case DataType.Currency: {
            inputValue = inputValue.toString();
            const commas = inputValue.match(new RegExp(/(,)/gim));
            const dots = inputValue.match(new RegExp(/(\.)/gim));
            if (commas) {
                for (let comma = 1; comma <= commas.length; comma++) {
                    if (comma === commas.length && !dots) /** if only one comma and no dot, it will be a dot.*/
                        inputValue = inputValue.replace(",", ".");
                    else {
                        inputValue = inputValue.replace(",", "");
                    }
                }
            }
            if (result.type === DataType.Currency) {
                const currencySignRegex = new RegExp(ValueRegexes.currencySign);
                const currencySign = currencySignRegex.exec(inputValue);
                result.currencySign = currencySign !== null ? currencySign[0] : "";
                inputValue = inputValue.replace(currencySignRegex, "");
            }
            result.value = parseFloat(inputValue).toPrecision(12);
            break;
        }
        case DataType.Number: {
            result.value = Number(inputValue);
            break;
        }
        case DataType.Date: {
            result.value = Date.parse(inputValue); /** Get milliseconds, makes searching easier. */
            break;
        }
        case DataType.Array: {
            if (inputValue.length) {
                if (typeof inputValue[0] === "object") {
                    result.value = inputValue
                        .map((item: any) => JSON.stringify(item)) // No nesting yet.
                        .join(", ");
                } else {
                    result.value = inputValue.join(", ");
                }
            } else {
                result.value = "";
            }
            break;
        }
        case DataType.Object: {
            result.value = JSON.stringify(inputValue);
            break;
        }
        case DataType.Undefined: {
            result.value = "";
            break;
        }
    }
    return result;
};