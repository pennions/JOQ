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

describe("Tests sorting function", () => {

    test('It sorts the testArray by Name, in Ascending order', () => {
        const joq = new JOQ(testArray);
        joq.sort([{ propertyName: "name", direction: SortDirection.ascending }]);
        const result = joq.execute();
        expect(result[0].name).toBe('Anne');
    });

    test('It sorts the testArray by Name, in Descending order', () => {
        const joq = new JOQ(testArray);
        joq.sort([{ propertyName: "name", direction: SortDirection.descending }]);
        const result = joq.execute();
        expect(result[0].name).toBe('Mark');
    });

    test('It sorts the testArray by Name and then By Rollno, in Ascending order', () => {
        const joq = new JOQ(testArray);
        joq.sort([{ propertyName: "name", direction: SortDirection.ascending }, { propertyName: "rollNo", direction: SortDirection.ascending }]);
        const result = joq.execute();
        expect(result[5].rollNo).toBe('R06');
    });

    test('It sorts the testArray by Name Descending and then By Rollno, in Ascending order', () => {
        const joq = new JOQ(testArray);
        joq.sort([{ propertyName: "name", direction: SortDirection.descending }, { propertyName: "rollNo", direction: SortDirection.ascending }]);
        const result = joq.execute();
        expect(result[0].rollNo).toBe('R01');
    });
});