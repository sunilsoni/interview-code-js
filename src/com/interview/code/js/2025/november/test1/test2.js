const fs = require('fs');

function modPow(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % mod;
    exp = BigInt(exp);
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

function getLastDigitPower(lastDigit, n) {
    if (n === 0n) return 1n;
    const cycles = {
        0: [0],
        1: [1],
        2: [2, 4, 8, 6],
        3: [3, 9, 7, 1],
        4: [4, 6],
        5: [5],
        6: [6],
        7: [7, 9, 3, 1],
        8: [8, 4, 2, 6],
        9: [9, 1]
    };
    const cycle = cycles[Number(lastDigit)];
    const idx = Number((n - 1n) % BigInt(cycle.length));
    return BigInt(cycle[idx]);
}

function solve(S, N, M) {
    const MOD = 1000000007n;
    const sBig = BigInt(S);
    const nBig = BigInt(N);
    const mBig = BigInt(M);

    let intermediate;
    if (nBig === 0n) {
        intermediate = 1n;
    } else {
        const lastDigit = sBig % 10n;
        intermediate = getLastDigitPower(lastDigit, nBig);
    }

    let result = modPow(intermediate, mBig, MOD);
    return Number(result);
}

function runTests() {
    const testCases = [
        { S: 2, N: 3, M: 4, expected: 4096 },
        { S: 1, N: 1, M: 1, expected: 1 },
        { S: 10, N: 5, M: 3, expected: 0 },
        { S: 5, N: 0, M: 5, expected: 1 },
        { S: 3, N: 2, M: 3, expected: 729 },
        { S: 7, N: 4, M: 2, expected: 1 },
        { S: 1000000000, N: 1000000007, M: 1000000007, expected: 0 },
        { S: 999999999, N: 1000000007, M: 1000000007, expected: 9 },
        { S: 2, N: 1000000000, M: 1000000000, expected: 581811561 },
        { S: 123456789, N: 987654321, M: 500000000, expected: 189432182 }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const result = solve(tc.S, tc.N, tc.M);
        const status = result === tc.expected ? 'PASS' : 'FAIL';
        console.log(`Test ${i + 1}: ${status} (Expected: ${tc.expected}, Got: ${result})`);
    }
}

runTests();

// const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
// const S = parseInt(input[0]);
// const N = parseInt(input[1]);
// const M = parseInt(input[2]);
// console.log(solve(S, N, M));