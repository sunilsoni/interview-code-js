function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function solve(arr) {
    const memo = new Map();

    function dp(mask, operation) {
        if (mask === (1 << arr.length) - 1) return 0;
        const key = mask + ',' + operation;
        if (memo.has(key)) return memo.get(key);

        let maxScore = 0;
        for (let i = 0; i < arr.length; i++) {
            if (!(mask & (1 << i))) {
                for (let j = i + 1; j < arr.length; j++) {
                    if (!(mask & (1 << j))) {
                        const newMask = mask | (1 << i) | (1 << j);
                        const currentScore = operation * gcd(arr[i], arr[j]);
                        const totalScore = currentScore + dp(newMask, operation + 1);
                        maxScore = Math.max(maxScore, totalScore);
                    }
                }
            }
        }

        memo.set(key, maxScore);
        return maxScore;
    }

    return dp(0, 1);
}

// Test cases
console.log(solve([3, 4, 9, 5]));      // Output: 7
console.log(solve([1, 2, 3, 4, 5, 6])); // Output: 14