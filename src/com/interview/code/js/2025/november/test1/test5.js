// JavaScript (Node.js)

const fs = require("fs");

function maxSalary(num, tasks) {
    let prev0 = 0;
    let prev1 = Number.NEGATIVE_INFINITY;
    let prev2 = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < num; i++) {
        const easy = tasks[i][0];
        const hard = tasks[i][1];

        const cur0 = Math.max(prev0, prev1, prev2);
        const cur1 = cur0 + easy;
        const cur2 = prev0 + hard;

        prev0 = cur0;
        prev1 = cur1;
        prev2 = cur2;
    }

    return Math.max(prev0, prev1, prev2);
}

function runTests() {
    const tests = [
        {
            name: "Sample",
            num: 4,
            tasks: [
                [1, 2],
                [4, 10],
                [20, 21],
                [2, 23]
            ],
            expected: 33
        },
        {
            name: "Single day",
            num: 1,
            tasks: [[1, 3]],
            expected: 3
        },
        {
            name: "Two days",
            num: 2,
            tasks: [
                [3, 5],
                [4, 6]
            ],
            expected: 9
        },
        {
            name: "Skip for big hard",
            num: 3,
            tasks: [
                [10, 20],
                [1, 100],
                [10, 20]
            ],
            expected: 110
        }
    ];

    let passed = 0;

    for (const t of tests) {
        const result = maxSalary(t.num, t.tasks);
        const ok = result === t.expected;
        if (ok) passed++;
        console.log(
            `${t.name}: ${ok ? "PASS" : "FAIL"} | expected=${t.expected}, got=${result}`
        );
    }

    const numLarge = 100000;
    const tasksLarge = new Array(numLarge);
    for (let i = 0; i < numLarge; i++) {
        const easy = (i % 100) + 1;
        const hard = easy + 1;
        tasksLarge[i] = [easy, hard];
    }
    const largeResult = maxSalary(numLarge, tasksLarge);
    const largeOk = typeof largeResult === "number" && Number.isFinite(largeResult);
    console.log(
        `Large Data Test: ${largeOk ? "PASS" : "FAIL"} | result=${largeResult}`
    );

    console.log(`Total Passed: ${passed}/${tests.length}`);
}

(function main() {
    const data = fs.readFileSync(0, "utf8").trim();
    if (!data) {
        runTests();
        return;
    }

    const arr = data.split(/\s+/).map(Number);
    const num = arr[0];
    const type = arr[1]; // always 2, not used
    let idx = 2;
    const tasks = [];
    for (let i = 0; i < num; i++) {
        const easy = arr[idx++];
        const hard = arr[idx++];
        tasks.push([easy, hard]);
    }

    const ans = maxSalary(num, tasks);
    console.log(ans.toString());
})();
