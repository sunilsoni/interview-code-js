// Updated marchingBand: removes unused M parameter and fixes result logic
function marchingBand(N, houses, K) {
    const counts = {};     // counts of each house in the current window
    let left = 0;
    let maxCount = 0;      // highest frequency of any house in window
    let result = 0;

    for (let right = 0; right < N; right++) {
        const h = houses[right];
        counts[h] = (counts[h] || 0) + 1;
        maxCount = Math.max(maxCount, counts[h]);

        // shrink window until we can make it uniform with ≤ K removals
        while ((right - left + 1) - maxCount > K) {
            counts[houses[left]]--;
            left++;
        }

        // uniformity score is the maxCount
        result = Math.max(result, maxCount);
    }

    return result;
}

// --------- Main & Parser ---------
// assumes input format:
// line1: N
// line2: houses as space-separated integers (length N)
// line3: M  (ignored)
// line4: K
function main() {
    const tokens = gets().trim().split(/\s+/).map(Number);
    const N = tokens[0];
    const houses = tokens.slice(1, 1 + N);
    // const M   = tokens[1 + N];  // unused
    const K = tokens[2 + N];
    console.log(marchingBand(N, houses, K));
}

// --------- Test Harness ---------
const tests = [
    // sample from prompt
    {
        input:
            `10
1 2 1 2 1 1 2 1 1 2
2
2`,
        expected: 5
    },
    // no removals → longest run in [1,1,2,2,2,1,1] is 3
    {
        input:
            `7
1 1 2 2 2 1 1
2
0`,
        expected: 3
    },
    // all same house → result = N
    {
        input:
            `1000
${Array(1000).fill(3).join(' ')}
5
10`,
        expected: 1000
    }
];

tests.forEach(({input, expected}, i) => {
    global.gets = () => input;
    const out = (() => {
        const tokens = gets().trim().split(/\s+/).map(Number);
        const N = tokens[0];
        const houses = tokens.slice(1, 1 + N);
        const K = tokens[2 + N];
        return marchingBand(N, houses, K);
    })();
    console.log(`Test ${i + 1}: got ${out}, expected ${expected} → ${out === expected ? 'PASS' : 'FAIL'}`);
});

// Call main() in real judge environment
// main();