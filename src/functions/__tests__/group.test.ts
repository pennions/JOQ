import JOQ from '../../joq';
import { SortDirection } from '../sort';

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

describe("Tests groupBy function", () => {

    test('It can group the testArray by age', () => {
        const joq = new JOQ(testArray);
        joq.groupBy("age");
        const result = joq.execute();
        expect(result.length).toBe(3);
    });

    test('It can group the testArray by age and then by name', () => {
        const joq = new JOQ(testArray);
        joq.groupBy("age");
        joq.thenGroupBy("name");
        const result = joq.execute();
        expect(result.length).toBe(5);
    });

    test('It can also just use group for a multiple grouping', () => {
        const joq = new JOQ(testArray);
        joq.group(["age", "name"]);
        const result = joq.execute();
        expect(result.length).toBe(5);
    });

    test('It can group and sort at the same time', () => {
        const joq = new JOQ(testArray);
        joq.groupBy("age");
        joq.orderBy("name", SortDirection.ascending);
        const result = joq.execute();
        expect(result[0][0].name).toBe("Anne");
    });

});