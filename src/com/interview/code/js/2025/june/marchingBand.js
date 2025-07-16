/**
 * @param {number} N - number of students
 * @param {number[]} houses - array of size N, house number of each student
 * @param {number} M - number of houses
 * @param {number} K - max students allowed to be removed
 * @returns {number} max uniformity score
 */
/**
 * marchingBand – longest uniform streak after ≤K removals
 * @param {number} N      total students
 * @param {number[]} a    houses[i]
 * @param {number} M      total houses (not essential)
 * @param {number} K      max deletions
 * @return {number} 
 */
function marchingBand(N, a, M, K) {
    const uniqueHouses = new Set(a);           // iterate only present houses
    let best = 0;

    for (const h of uniqueHouses) {
        let left = 0;
        let bad  = 0;                            // non-h students in window

        for (let right = 0; right < N; right++) {
            if (a[right] !== h) bad++;

            // shrink window until we can delete all bad (≤ K)
            while (bad > K) {
                if (a[left] !== h) bad--;
                left++;
            }

            const windowSize = right - left + 1;
            const good       = windowSize - bad;   // after deleting “bad”
            if (good > best) best = good;
        }
    }
    return best;
}

function runTests() {
    const tests = [
        {
            input: {
                N: 10,
                houses: [1,2,2,1,1,1,2,1,1,2],
                M: 2,
                K: 2
            },
            expected: 5
        },
        {
            input: {
                N: 6,
                houses: [1,1,2,2,2,1],
                M: 2,
                K: 1
            },
            expected: 4
        },
        {
            input: {
                N: 6,
                houses: [3,3,2,2,2,3],
                M: 3,
                K: 2
            },
            expected: 5
        },
        {
            input: {
                N: 100000,
                houses: Array(100000).fill(1),
                M: 2,
                K: 0
            },
            expected: 100000
        }
    ];

    let allPass = true;
    for (const [i, t] of tests.entries()) {
        const got = marchingBand(t.input.N, t.input.houses, t.input.M, t.input.K);
        const pass = got === t.expected;
        allPass &&= pass;
        console.log(`Test #${i + 1}: expected ${t.expected}, got ${got} → ${pass ? 'PASS' : 'FAIL'}`);
    }

    console.log(allPass ? "\n✅ All tests passed." : "\n❌ Some tests failed.");
}

// Run if this file is executed
if (require.main === module) {
    runTests();
}