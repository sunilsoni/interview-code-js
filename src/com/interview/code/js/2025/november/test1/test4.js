const fs = require('fs');

function solve(num, tasks) {
    let prevNone = 0;
    let prevEasy = 0;
    let prevHard = 0;

    for (let i = 0; i < num; i++) {
        const easy = tasks[i][0];
        const hard = tasks[i][1];

        const currNone = Math.max(prevNone, prevEasy, prevHard);
        const currEasy = Math.max(prevNone, prevEasy, prevHard) + easy;
        const currHard = prevNone + hard;

        prevNone = currNone;
        prevEasy = currEasy;
        prevHard = currHard;
    }

    return Math.max(prevNone, prevEasy, prevHard);
}

function runTests() {
    const testCases = [
        {
            num: 4,
            tasks: [[1, 2], [4, 10], [20, 21], [2, 23]],
            expected: 33
        },
        {
            num: 1,
            tasks: [[5, 10]],
            expected: 10
        },
        {
            num: 2,
            tasks: [[1, 100], [1, 100]],
            expected: 100
        },
        {
            num: 3,
            tasks: [[1, 2], [1, 2], [1, 2]],
            expected: 4
        },
        {
            num: 5,
            tasks: [[1, 6], [1, 2], [1, 9], [1, 10], [1, 13]],
            expected: 28
        },
        {
            num: 4,
            tasks: [[7, 10], [6, 7], [4, 6], [6, 7]],
            expected: 26
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const result = solve(tc.num, tc.tasks);
        const status = result === tc.expected ? 'PASS' : 'FAIL';
        console.log(`Test ${i + 1}: ${status} (Expected: ${tc.expected}, Got: ${result})`);
    }
}

runTests();

// const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
// const [num, type] = input[0].split(' ').map(Number);
// const tasks = [];
// for (let i = 1; i <= num; i++) {
//     const [easy, hard] = input[i].split(' ').map(Number);
//     tasks.push([easy, hard]);
// }
// console.log(solve(num, tasks));