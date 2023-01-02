import JOQ from "../../joq";
import { FilterOperator, FilterType } from "../filter";

const testArray = [
    {
        id: 1,
        hasAccount: false,
        created_date: "2023-01-01T08:59:01.558Z",
        book: "The great escape",
        delete_date: null
    },
    {
        id: 2,
        hasAccount: true,
        created_date: "2022-11-05T01:05:24.263Z",
        book: "A book of fairytales",
        delete_date: null
    },
    {
        id: 3,
        hasAccount: false,
        created_date: "2020-11-05T01:05:24.263Z",
        book: "Some comic book",
        delete_date: "2021-11-05T01:05:24.263Z"
    }
];

describe("Tests the filters", () => {
    test("It can do a like search on a string", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "book", operator: FilterOperator.Like, value: "fairytales" }]);
        const result = joq.execute();
        expect(result[0]).toEqual(testArray[1]);
    });

    test("It can do a case sensitive equal search on a string", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "book", operator: FilterOperator.Equals, value: "A book of fairytales" }]);
        const result = joq.execute();
        expect(result[0]).toEqual(testArray[1]);
    });

    test("It can find a null value", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "delete_date", operator: FilterOperator.Equals, value: null }]);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });

    test("It can find all items that have a not null value", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "delete_date", operator: FilterOperator.NotEquals, value: null }]);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find a boolean value", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "hasAccount", operator: FilterOperator.Equals, value: true }]);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find a date on or after 2022", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "created_date", operator: FilterOperator.EqualsOrGreater, value: "2022-11-05T01:05:24.263Z" }]);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });
    test("It can find a date on after a date", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "created_date", operator: FilterOperator.Greater, value: "2022-11-05T01:05:24.263Z" }]);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find numbers lesser than provided number", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "id", operator: FilterOperator.Lesser, value: 3 }]);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });

    test("It can find items with id less than 3 and with an account", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "id", operator: FilterOperator.Lesser, value: 3 }, { column: "hasAccount", operator: FilterOperator.Equals, value: true }]);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find items with id less than 3 or with an account", () => {
        const joq = new JOQ(testArray);
        joq.where([{ column: "id", operator: FilterOperator.Lesser, value: 3 }, { column: "hasAccount", operator: FilterOperator.Equals, value: true, type: FilterType.Or }]);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });
});
