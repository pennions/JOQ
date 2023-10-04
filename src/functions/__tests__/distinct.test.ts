import JOQ from '../../joq';

const testArray = [
    {
        name: 'Mark',
        age: 30,
        rollNo: 'R01'
    },
    {
        name: 'Anne',
        age: 20,
        rollNo: 'R02'
    },
    {
        name: 'James',
        age: 40,
        rollNo: 'R03'
    },
    {
        name: 'Jerry',
        age: 30,
        rollNo: 'R04'
    },
    {
        name: 'Lucy',
        age: 30,
        rollNo: 'R05'
    },
    {
        name: 'Mark',
        age: 30,
        rollNo: 'R06'
    },
];

describe("Tests the distinct function", () => {
    test("It can distinct on a property and merge the other columns", () => {

        const expected = {
            age: 30,
            name: "Mark, Jerry, Lucy",
            rollNo: "R01, R04, R05, R06"
        };

        const joq = new JOQ(testArray);
        joq.distinct("age");
        const result = joq.execute();
        expect(result[0]).toEqual(expected);
    });

    test("It can distinct on multiple columns", () => {

        const expected = {
            age: 30,
            name: "Mark",
            rollNo: "R01, R06"
        };

        const joq = new JOQ(testArray);
        joq.distinct(["age", "name"]);
        const result = joq.execute();
        expect(result[0]).toEqual(expected);
    });

    test("It will sum numbers if not distincted on", () => {

        const expected = {
            age: 60,
            name: "Mark",
            rollNo: "R01, R06"
        };

        const joq = new JOQ(testArray);
        joq.distinct("name");
        const result = joq.execute();
        expect(result[0]).toEqual(expected);
    });
});