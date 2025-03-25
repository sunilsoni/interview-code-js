function solve(S, wordDict) {
    const wordSet = new Set(wordDict);
    const dp = new Array(S.length + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= S.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(S.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[S.length];
}

// Test Cases
console.log(solve("applepenapple", ["apple", "pen"])); // true
console.log(solve("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false
