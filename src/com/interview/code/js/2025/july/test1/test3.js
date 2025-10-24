// Returns the K-th positive integer whose digits sum to 10
function integerGame(K) {
    // Precompute counts dp[len][sum]: ways to fill len digits (remaining) to make sum
    const MAX_SUM = 10;
    const dp = Array.from({length: 12}, () => Array(MAX_SUM + 1).fill(0));
    dp[0][0] = 1;
    for (let len = 1; len <= 11; len++) {
        for (let s = 0; s <= MAX_SUM; s++) {
            for (let d = 0; d <= 9; d++) {
                if (s - d >= 0) dp[len][s] += dp[len - 1][s - d];
            }
        }
    }

    // count of d-digit numbers with digit-sum=10 and first digit ≥1
    function countForLength(d) {
        let count = 0;
        for (let first = 1; first <= 9; first++) {
            if (MAX_SUM - first >= 0) {
                count += dp[d - 1][MAX_SUM - first];
            }
        }
        return count;
    }

    // find what length the K-th number lives in
    let length = 1;
    let rem = K;
    while (true) {
        const c = countForLength(length);
        if (rem <= c) break;
        rem -= c;
        length++;
    }

    // build the rem-th number of this length
    let sumLeft = MAX_SUM;
    const digits = [];
    for (let pos = 1; pos <= length; pos++) {
        const minD = pos === 1 ? 1 : 0;
        for (let d = minD; d <= 9; d++) {
            if (sumLeft - d < 0) break;
            const ways = dp[length - pos][sumLeft - d];
            if (rem > ways) {
                rem -= ways;
            } else {
                digits.push(d);
                sumLeft -= d;
                break;
            }
        }
    }

    return parseInt(digits.join(''), 10);
}

// Test harness
function runTests() {
    const tests = [
        {K: 1, expected: 19},
        {K: 2, expected: 28},
        {K: 9, expected: 91},
        {K: 10, expected: 109},
        {K: 100, expected: integerGame(100)},    // verify internal consistency
        {K: 10000, expected: integerGame(10000)}  // large input case
    ];

    tests.forEach(({K, expected}, i) => {
        const got = integerGame(K);
        const result = got === expected ? 'PASS' : 'FAIL';
        console.log(
            `Test ${i + 1}: K=${K} → got ${got}, expected ${expected} → ${result}`
        );
    });
}

runTests();