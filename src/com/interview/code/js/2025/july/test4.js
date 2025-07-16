// Returns the maximum uniformity score after removing at most K students
function marchingBand(N, houses, M, K) {
    const counts = {};        // counts of each house in the current window
    let left = 0;
    let maxCount = 0;         // highest count of a single house in the window
    let result = 0;

    for (let right = 0; right < N; right++) {
        const h = houses[right];
        counts[h] = (counts[h] || 0) + 1;
        maxCount = Math.max(maxCount, counts[h]);

        // if we need to remove more than K to make the window uniform, shrink it
        while ((right - left + 1) - maxCount > K) {
            const hl = houses[left];
            counts[hl]--;
            left++;
        }

        result = Math.max(result, maxCount)    }

    return result;
}

// Test harness
function runMarchingBandTests() {
    const tests = [
        // sample from prompt
        {
            N: 10,
            houses: [1,2,1,2,1,1,2,1,1,2],
            M: 2,
            K: 2,
            expected: 5
        },
        // no removals, longest original run of 1's is 3
        {
            N: 7,
            houses: [1,1,2,2,2,1,1],
            M: 2,
            K: 0,
            expected: 3
        },
        // all same house
        {
            N: 1000,
            houses: Array(1000).fill(3),
            M: 5,
            K: 10,
            expected: 1000
        },
        // large random case
        (function() {
            const N = 100000;
            const houses = new Array(N);
            for (let i = 0; i < N; i++) houses[i] = Math.floor(Math.random()*5)+1;
            return { N, houses, M: 5, K: 500, expected: marchingBand(N, houses, 5, 500) };
        })()
    ];

    tests.forEach((t, i) => {
        const got = marchingBand(t.N, t.houses, t.M, t.K);
        const pass = got === t.expected ? 'PASS' : 'FAIL';
        console.log(
            `Test ${i+1}: got ${got}, expected ${t.expected} → ${pass}`
        );
    });
}

runMarchingBandTests();