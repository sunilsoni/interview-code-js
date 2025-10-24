// Calculates the minimum days you need to buy boxes to survive D days
function minimumDays(N, K, D) {
    // total burgers needed
    const totalNeeded = K * D;
    // how many boxes (of N burgers) are required
    const boxesNeeded = Math.ceil(totalNeeded / N);
    // shop is closed on each Sunday → one closed day per 7-day block
    const openDays = D - Math.floor(D / 7);
    // you can only buy one box per open day
    return boxesNeeded <= openDays ? boxesNeeded : -1;
}

// Test harness
function runTests() {
    const tests = [
        // sample from prompt
        {N: 16, K: 2, D: 10, expected: 2},
        // impossible because box too small
        {N: 1, K: 2, D: 10, expected: -1},
        // exact fit, no Sundays in 6 days
        {N: 5, K: 1, D: 6, expected: 2},
        // covers one Sunday, openDays = 13
        {N: 10, K: 1, D: 14, expected: 2},
        // large-input case
        {N: 100, K: 1, D: 1000, expected: Math.ceil((1 * 1000) / 100)},
    ];

    tests.forEach(({N, K, D, expected}, i) => {
        const actual = minimumDays(N, K, D);
        const result = actual === expected ? 'PASS' : 'FAIL';
        console.log(
            `Test ${i + 1}: N=${N},K=${K},D=${D} → got ${actual}, ` +
            `expected ${expected} → ${result}`
        );
    });
}

runTests();