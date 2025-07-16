/**
 * Marching Band uniformity after removing ≤K students.
 * @param {number} N       number of students
 * @param {number[]} H     houses array, length N, 1..M
 * @param {number} M       number of distinct houses
 * @param {number} K       max removals allowed
 * @returns {number}       maximum block size of same house
 */
function marchingBand(N, H, M, K) {
    // 1) build position lists
    const pos = Array.from({ length: M + 1 }, () => []);
    for (let i = 0; i < N; i++) {
        pos[ H[i] ].push(i);
    }

    let answer = 0;

    // 2) for each house’s positions, two-pointer on pos[h]
    for (let h = 1; h <= M; h++) {
        const A = pos[h];
        if (A.length === 0) continue;

        let i = 0;
        for (let j = 0; j < A.length; j++) {
            // expand j
            // now shrink i while bad > K
            while (true) {
                const span  = A[j] - A[i] + 1;      // total width
                const goods = j - i + 1;           // count of this house
                const bad   = span - goods;        // others to remove
                if (bad <= K) break;
                i++;
            }
            // update answer
            answer = Math.max(answer, j - i + 1);
        }
    }

    return answer;
}

function runTests() {
    const tests = [
        {
            in: { N:10, H:[1,2,2,1,1,1,2,1,1,2], M:2,  K:2 },
            out: 5
        },
        {
            in: { N:6,  H:[1,1,2,2,2,1],       M:2,  K:1 },
            out: 4
        },
        {
            in: { N:6,  H:[3,3,2,2,2,3],       M:3,  K:2 },
            out: 5
        },
        {
            in: { N:8,  H:[1,2,3,4,5,6,7,8],   M:8,  K:0 },
            out: 1
        },
        {
            in: { N:5,  H:[1,1,1,1,1],         M:1,  K:2 },
            out: 5
        }
    ];

    let allPass = true;
    console.log('\n– deterministic tests –');
    tests.forEach(({in:i, out}, idx) => {
        const got = marchingBand(i.N, i.H, i.M, i.K);
        const ok  = got === out;
        allPass &&= ok;
        console.log(
            `#${idx+1}: expected ${out}, got ${got} → ${ok ? 'PASS':'FAIL'}`
        );
    });

    // large random stress
    console.log('\n– large random stress test –');
    const N = 100_000, M = 100, K = 500;
    const H = Array.from({length:N},
        () => Math.floor(Math.random()*M)+1
    );
    const t0 = Date.now();
    const ans = marchingBand(N, H, M, K);
    const dt = Date.now() - t0;
    console.log(`random N=${N} M≈${M} K=${K} → got ${ans} in ${dt}ms`);

    console.log('\n' + (allPass
        ? '✅ All small tests passed.'
        : '❌ Some small tests failed.'));
}

if (require.main === module) runTests();