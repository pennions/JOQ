import JOQ from "../../joq";
import { FilterOperator } from "../filter";

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
});
