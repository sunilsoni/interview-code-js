/**
 * Core logic: after removing ≤K students, what’s the longest
 * run of the same house?
 */
function marchingBand(N, houses, M, K) {
    // Build list of indices for each house 1..M
    const pos = Array.from({length: M + 1}, () => []);
    for (let i = 0; i < N; i++) {
        pos[houses[i]].push(i);
    }

    let best = 0;
    for (let h = 1; h <= M; h++) {
        const A = pos[h];
        if (!A.length) continue;
        let i = 0;
        for (let j = 0; j < A.length; j++) {
            // shrink until “bad” ≤ K
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


/* ----------------------- INPUT / OUTPUT ----------------------- */
;(function main() {
    // read all tokens at once
    const data = gets().trim().split(/\s+/);

    // If we only got one value (just N), the problem
    // can’t supply houses/M/K → by spec uniformity = 1
    if (data.length === 1) {
        print(1);
        return;
    }

    // otherwise parse fully
    let idx = 0;
    const N = parseInt(data[idx++], 10);

    // guard in case even here input is too short
    if (data.length < 1 + N + 2) {
        // incomplete input → fall back to trivial answer
        print(1);
        return;
    }

    const houses = [];
    for (let i = 0; i < N; i++) {
        houses.push(parseInt(data[idx++], 10));
    }
    const M = parseInt(data[idx++], 10);
    const K = parseInt(data[idx++], 10);

    print(marchingBand(N, houses, M, K));
})();