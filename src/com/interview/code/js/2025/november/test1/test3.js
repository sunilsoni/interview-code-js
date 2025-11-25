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

const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const S = parseInt(input[0]);
const N = parseInt(input[1]);
const M = parseInt(input[2]);
console.log(solve(S, N, M));