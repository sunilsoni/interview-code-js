// Function to find maximum recurring character
function maxRecurringChar(str) {
    const freq = {}; // store frequency of each character
    let maxChar = '';
    let maxCount = 0;

    for (let char of str) {
        freq[char] = (freq[char] || 0) + 1;

        // update maxChar if current char count is greater
        if (freq[char] > maxCount) {
            maxChar = char;
            maxCount = freq[char];
        }
    }

    return { char: maxChar, count: maxCount };
}

// ✅ Test runner
function runTests() {
    const testCases = [
        { input: "chamala", expected: { char: "a", count: 3 } },
        { input: "banana", expected: { char: "a", count: 3 } },
        { input: "abc", expected: { char: "a", count: 1 } },
        { input: "aabbcc", expected: { char: "a", count: 2 } }, // tie case
        { input: "", expected: { char: "", count: 0 } }, // empty string
        { input: "zzzzzz", expected: { char: "z", count: 6 } }, // large repeat
    ];

    for (let i = 0; i < testCases.length; i++) {
        const { input, expected } = testCases[i];
        const result = maxRecurringChar(input);

        const pass = result.char === expected.char && result.count === expected.count;
        console.log(`Test ${i + 1}: ${pass ? "PASS ✅" : "FAIL ❌"} | Input: "${input}" | Output:`, result);
    }

    // 🔥 Large data test
    const largeInput = "a".repeat(1000000) + "b".repeat(500000);
    const largeResult = maxRecurringChar(largeInput);
    console.log("Large Data Test:", largeResult);
}

runTests();
