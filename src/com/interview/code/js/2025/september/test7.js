function searchValue(numbers, value) {
    let result = [0, 0, 0, 0];
    const n = numbers.length;
    const half = Math.floor(n / 2);
    for (let i = 0; i < n; i++) {
        if (numbers[i] === value) {
            if (i % 2 === 0) result[0] = 1;
            else result[1] = 1;
            if (i < half) result[2] = 1;
            else result[3] = 1;
        }
    }
    return result;
}

function test() {
    const tests = [
        { input: [[7, 1, 3, 5, 8, 7, 61, 8], 8], expected: [1, 0, 1, 0] },
        { input: [[2, 4, 6, 8, 10, 12], 6], expected: [1, 0, 1, 0] },
        { input: [[1, 2, 3, 4, 5, 6, 7, 8], 2], expected: [0, 1, 1, 0] },
        { input: [[5, 5, 5, 5, 5, 5], 5], expected: [1, 1, 1, 1] },
        { input: [[10, 20, 30, 40, 50, 60], 100], expected: [0, 0, 0, 0] }
    ];
    const largeArray = Array(20).fill(8);
    tests.push({ input: [largeArray, 8], expected: [1, 1, 1, 1] });

    for (let i = 0; i < tests.length; i++) {
        const result = searchValue(...tests[i].input);
        const pass = JSON.stringify(result) === JSON.stringify(tests[i].expected);
        console.log(`Test ${i + 1}: ${pass ? "PASS" : "FAIL"} | Output: ${result}`);
    }
}

test();