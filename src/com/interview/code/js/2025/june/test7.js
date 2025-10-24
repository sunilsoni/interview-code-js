// If you’re on Node-based judge:
const fs = require('fs');
const data = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);

let idx = 0;
const N = data[idx++];
const houses = data.slice(idx, idx + N);
idx += N;
let M = data[idx++];   // the problem says “number of houses”
const K = data[idx++];

/*
 * In case the provided M is ever smaller than the highest label
 * we just deduce the true max label from the data:
 */
const maxLabel = Math.max(...houses);
if (maxLabel > M) M = maxLabel;

/**
 * Core sliding-window per house
 */
function marchingBand(N, H, M, K) {
    // build an array of positions for each label 1…M
    const pos = Array.from({length: M + 1}, () => []);
    for (let i = 0; i < N; i++) {
        pos[H[i]].push(i);
    }

    let best = 0;
    for (let h = 1; h <= M; h++) {
        const A = pos[h];
        if (!A.length) continue;

        let i = 0;
        for (let j = 0; j < A.length; j++) {
            // shrink left until “bad” ≤ K
            while (true) {
                const span = A[j] - A[i] + 1;
                const goods = j - i + 1;
                const bad = span - goods;
                if (bad <= K) break;
                i++;
            }
            best = Math.max(best, j - i + 1);
        }
    }

    return best;
}

console.log(marchingBand(N, houses, M, K));

if (require.main === module) {
    const tests = [
        {in: [10, [1, 2, 2, 1, 1, 1, 2, 1, 1, 2], 2, 2], out: 5},
        {in: [6, [1, 1, 2, 2, 2, 1], 2, 1], out: 4},
        {in: [6, [3, 3, 2, 2, 2, 3], 3, 2], out: 5},
        // no removals → longest run is 1
        {in: [10, [1, 2, 1, 2, 1, 2, 1, 2, 1, 2], 2, 0], out: 1},
        // all same
        {in: [10, Array(10).fill(5), 5, 2], out: 10}
    ];

    let okAll = true;
    for (const {in: [n, h, m, k], out} of tests) {
        const got = marchingBand(n, h, m, k);
        const pass = got === out;
        console.log(`expected ${out}, got ${got} → ${pass ? 'PASS' : 'FAIL'}`);
        okAll &&= pass;
    }
    console.log(okAll ? '✅ All pass' : '❌ Some fail');
}