function solve(B, ar) {
    let count = 0;

    for (let i = 1; i < ar.length; i++) {
        if (ar[i] <= ar[i - 1]) {
            let increments = Math.ceil((ar[i - 1] - ar[i] + 1) / B);
            ar[i] += increments * B;
            count += increments;
        }
    }

    return count;
}

// Test cases
const testCases = [
    {B: 2, ar: [1, 3, 3, 2], expected: 3}, // Example 1
    {B: 1, ar: [1, 1], expected: 1},       // Example 2
    {B: 2, ar: [1, 5, 5, 4], expected: 3}, // Additional example from problem statement
    {B: 3, ar: [4, 4, 4, 4], expected: 6}, // Equal elements case
    {B: 10, ar: [10, 1, 1, 1], expected: 3}, // Larger B
    {B: 1, ar: [5, 4, 3, 2, 1], expected: 14}, // Decreasing sequence
];

// Running and verifying test cases
testCases.forEach(({B, ar, expected}, index) => {
    const result = solve(B, [...ar]); // copy array to prevent mutation
    console.log(`Test Case ${index + 1}:`, result === expected ? "Passed" : `Failed (Expected ${expected}, got ${result})`);
});
