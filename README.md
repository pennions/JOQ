<!-- TOC -->

- [Welcome to Jelmers Object Query](#welcome-to-jelmers-object-query)
    - [Installation](#installation)
        - [npm](#npm)
        - [yarn](#yarn)
    - [Getting started](#getting-started)
    - [Functions](#functions)
        - [Sort / Order](#sort--order)
        - [Filter / Where](#filter--where)
        - [Group](#group)
        - [Select](#select)
        - [Execute](#execute)
        - [Sum](#sum)

<!-- /TOC -->

# Welcome to Jelmers Object Query

This is a library designed to make querying JSON objects a breeze.

## Installation

Simply add it to your project using ```npm``` or ```yarn```:

### npm
```shell
npm install @pennions/joq
```

### yarn
```shell
yarn add @pennions/joq
```

Then import it in your code as follows:

```js
import JOQ from "@pennions/joq"
```

## Getting started

The library exposed a class, which takes an object array as single argument:

```js
const queryableObject = new JOQ(myObjectArray);
```

It makes a *hard* copy of the object. So in this case ```myObjectArray``` will not be mutated itself.

## Functions

Listed below are all the functions you can call on the ```queryableObject```
which is mentioned in the [Getting started](#getting-started) section.

example:
```js
queryableObject.select("name");
queryableObject.where("name", "like", "john");

const result = queryableObject.execute();
```

### Sort / Order

**propertyName**
The case-sensitive name of the property you want to sort on.

**direction (SortDirection)**
Can be one of the following: 

```"asc"``` for ascending order
```"desc"``` for descending order

**SortDetail**
```js
{
    propertyName: string;
    direction: SortDirection;
}
```

**Functions**

```js
orderBy(propertyName: string, direction: SortDirection)
```

```js
thenOrderBy(propertyName: string, direction: SortDirection) 
```

Example:

```js
queryableObject.orderBy("name", "asc");
queryableObject.thenOrderBy("age", "desc");
const result = queryableObject.execute();

```

Or if you want to add all the details at once in an array, you can use the sort function.

```js
sort(sortDetails: Array<SortDetail>
```

### Filter / Where


**propertyName**
The case-sensitive name of the property you want to search on.

**operator (FilterOperator)**
Can be one of the following: 

```">"``` for GreaterThan 

```"<"``` for LesserThan 

```">="``` for EqualsOrGreater 

```"<="``` for EqualsOrLesser 

```"is"``` for  ```"=="``` for Equals 

```"!="``` for NotEquals 

```"==="``` for SuperEquals (includes typecheck)

```"!=="``` for SuperNotEquals (includes typecheck)

```"like"``` for Like  (string comparison)

```"!like"``` for NotLike (string comparison)

```"contains"``` for Contains (string comparison)

```"!contains``` for NotContains (string comparison)

**FilterType**

Can be ```"and"``` / ```"or"```


**FilterDetail**
```js
{
    propertyName: string, 
    value: any, 
    operator: FilterOperator, 
    type?: FilterType /** optional, defaults to "and" **/
}
```


**Functions**

```js
where(propertyName: string, operator: FilterOperator, value: any, type?: FilterType) 
```

Implicitly adds "and" type, but where does this as well. So treat it as syntactic sugar.
```js
andWhere(propertyName: string, operator: FilterOperator, value: any)
```

Implicitly adds "or" type
```js
orWhere(propertyName: string, operator: FilterOperator, value: any)
```

Or if you want to add all the details at once in an array, you can use the filter function.

```js
filter(filterDetails: Array<FilterDetail>) 
```


### Group

**propertyName**
The case-sensitive name of the property you want to group on.

**Functions**
```js
groupBy(propertyName: string)
```

This is syntactic sugar, adding an additional where does the same.
```js
thenGroupBy(propertyName: string)
```

Or supply all the properties at once, order matters.
```js
group(groupByProperties: Array<string>)
```

### Select

If you want to make a subselection, you can provide a string or an array of strings with the case-sensitive property names. It will only return objects with those properties

```js
select(selection: Array<string> | string) 
```

### Execute

This function will start all the operations you added and returns the result.

```js
execute() 
```

### Sum

This is a special function, because it returns a single object with the totals of the provided properties. So you cant use ```execute``` with this one.

```js
sum(sumProperties: Array<string>, jsonArray: Array<any>)
```

Example:

```js
const result = queryableObject.sum("age");
```

But you can also supply your own json array, for example if you grouped it before, you get an array of arrays. So you can also use sum for this subselection easily without creating a new JOQ instance

Example:
```js
const sum = queryableObject.sum("age", querableObject[0]);
```