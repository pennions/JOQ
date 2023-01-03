import JOQ from "../../joq";

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

describe("Tests the selection function", () => {
    test("It can return one property", () => {
        const joq = new JOQ(testArray);
        joq.select("book");
        const result = joq.execute();
        expect(Object.keys(result[0])).toEqual(["book"]);
    });

    test("It can return multiple properties", () => {
        const joq = new JOQ(testArray);
        joq.select(["id", "book"]);
        const result = joq.execute();
        expect(Object.keys(result[0])).toEqual(["id", "book"]);
    });
});
