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

const testArrayWithNestedObjects = [
    {
        name: "Jonathan",
        lists: {
            todos: {
                1: "Do dishes",
                2: "Clean up weapons"
            }
        },
        inventory: ["Pencil", "Book"]
    },
    {
        name: "Dog",
        lists: {
            todos: {
                1: "Eat food",
                2: "Play with ball"
            }
        },
        inventory: ["Bone", "Ball"]
    }
];

describe("Tests the filters", () => {
    test("It can do a like search on a string, using filter", () => {
        const joq = new JOQ(testArray);
        joq.filter([{ propertyName: "book", operator: FilterOperator.Like, value: "fairytales" }]);
        const result = joq.execute();
        expect(result[0]).toEqual(testArray[1]);
    });

    test("It can do a case sensitive equal search on a string", () => {
        const joq = new JOQ(testArray);
        joq.where("book", FilterOperator.Equals, "A book of fairytales");
        const result = joq.execute();
        expect(result[0]).toEqual(testArray[1]);
    });

    test("It can find a null value", () => {
        const joq = new JOQ(testArray);
        joq.where("delete_date", FilterOperator.Equals, null);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });

    test("It can find all items that have a not null value", () => {
        const joq = new JOQ(testArray);
        joq.where("delete_date", FilterOperator.NotEquals, null);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find a boolean value", () => {
        const joq = new JOQ(testArray);
        joq.where("hasAccount", FilterOperator.Equals, true);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find a date on or after 2022", () => {
        const joq = new JOQ(testArray);
        joq.where("created_date", FilterOperator.EqualsOrGreater, "2022-11-05T01:05:24.263Z");
        const result = joq.execute();
        expect(result.length).toBe(2);
    });
    test("It can find a date on after a date", () => {
        const joq = new JOQ(testArray);
        joq.where("created_date", FilterOperator.GreaterThan, "2022-11-05T01:05:24.263Z");
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find numbers lesser than provided number", () => {
        const joq = new JOQ(testArray);
        joq.where("id", FilterOperator.LesserThan, 3);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });

    test("It can find items with id less than 3 and with an account", () => {
        const joq = new JOQ(testArray);
        joq.where("id", FilterOperator.LesserThan, 3);
        joq.andWhere("hasAccount", FilterOperator.Equals, true);
        const result = joq.execute();
        expect(result.length).toBe(1);
    });

    test("It can find items with id less than 3 or with an account, using filter", () => {
        const joq = new JOQ(testArray);
        joq.filter([{ propertyName: "id", operator: FilterOperator.LesserThan, value: 3 }, { propertyName: "hasAccount", operator: FilterOperator.Equals, value: true, type: FilterType.Or }]);
        const result = joq.execute();
        expect(result.length).toBe(2);
    });

    test('It can search inside a nested object', () => {
        const joq = new JOQ(testArrayWithNestedObjects);
        joq.where("lists.todos.2", FilterOperator.Like, "play");
        const result = joq.execute();
        expect(result[0].name).toBe("Dog");
    });

    test('It can find a text in an array', () => {
        const joq = new JOQ(testArrayWithNestedObjects);
        joq.where("inventory", FilterOperator.Contains, "Book");
        const result = joq.execute();
        expect(result[0].name).toBe("Jonathan");
    });

    test('It can find a text in an array using only orWhere', () => {
        const joq = new JOQ(testArrayWithNestedObjects);
        joq.orWhere("name", FilterOperator.Like, "Dog");
        const result = joq.execute();
        expect(result[0].name).toBe("Dog");
    });

    test('It can query with or', () => {

        const joq = new JOQ(testArray);
        joq.filter([{ propertyName: "book", operator: FilterOperator.Contains, value: "comic", type: FilterType.Or }, { propertyName: "book", operator: FilterOperator.Contains, value: "Fairytales", type: FilterType.Or }]);
        const result = joq.execute();
        
        expect(result[0]).toStrictEqual(testArray.find(ta => ta.book.includes("fairytale")));
        expect(result[1]).toStrictEqual(testArray.find(ta => ta.book.includes("comic")));
    });
});
