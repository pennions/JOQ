import JOQ from '../../joq';

const testArray = [
    {
        name: 'Mark',
        age: 30,
        rating: 55.5,
        rollNo: 'R01'
    },
    {
        name: 'Anne',
        age: 20,
        rating: 74.5,
        rollNo: 'R02'
    },
    {
        name: 'James',
        age: 40,
        rating: 64.5,
        rollNo: 'R03'
    },
    {
        name: 'Jerry',
        age: 30,
        rating: 34.9,
        rollNo: 'R04'
    },
    {
        name: 'Lucy',
        age: 30,
        rating: 28.15,
        rollNo: 'R05'
    },
    {
        name: 'Mark',
        age: 30,
        rating: 99.0,
        rollNo: 'R06'
    },
];

describe("Tests the sum function", () => {

    test('It can sum an int', () => {
        const joq = new JOQ(testArray);
        const result = joq.sum("age");
        expect(result).toStrictEqual({ age: 180 });
    });

    test('It can detect and sum a float', () => {
        const joq = new JOQ(testArray);
        const result = joq.sum("rating");
        expect(result).toStrictEqual({ rating: 356.55 });
    });
});