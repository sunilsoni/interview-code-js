/**
 * Find the largest number in a string of letters and digits.
 * Uses string comparison so it works even if the numbers are very big.
 */
function solve(S) {
    // extract all runs of digits
    const groups = S.match(/\d+/g) || [];
    if (groups.length === 0) return '0';

    // track the largest by length then lex order
    let max = groups[0];
    for (let i = 1; i < groups.length; i++) {
        const g = groups[i];
        if (g.length > max.length || (g.length === max.length && g > max)) {
            max = g;
        }
    }
    return max;
}

/**
 * Run a list of tests and report PASS/FAIL.
 */
function runTests() {
    const tests = [
        { input: "gt12cty65mt1", expected: "65" },
        { input: "mkf43kdlcmk32klmv123", expected: "123" },
        // no digits at all
        { input: "abcdef", expected: "0" },
        // single huge group
        { input: "abc" + "9".repeat(500) + "def", expected: "9".repeat(500) },
        // two equal‐length groups, lex order picks the bigger
        { input: "a123b456c123", expected: "456" }
    ];

    tests.forEach((t, i) => {
        const got = solve(t.input);
        const pass = got === t.expected;
        console.log(
            `Test ${i+1}: ${pass ? "PASS" : "FAIL"} ` +
            `(got=${got}, expected=${t.expected})`
        );
    });
}

// run the tests
runTests();