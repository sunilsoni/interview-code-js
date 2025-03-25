// Class that contains methods to check for a palindrome number and run tests
class PalindromeChecker {
    /**
     * Checks if a given integer is a palindrome.
     * @param {number} x - The integer to check.
     * @return {boolean} - Returns true if x is a palindrome, false otherwise.
     */
    static isPalindrome(x) {
        // A negative number cannot be a palindrome since the '-' sign does not mirror.
        if (x < 0) return false;

        // Convert the number to a string for easy reversal and comparison.
        const str = x.toString();

        // Split the string into an array of characters, reverse the array,
        // and then join back into a reversed string.
        const reversedStr = str.split('').reverse().join('');

        // Compare the original string with the reversed string.
        // If they are the same, the number is a palindrome.
        return str === reversedStr;
    }

    /**
     * Runs all test cases and outputs PASS/FAIL for each test.
     */
    static main() {
        // Define an array of test cases including edge cases.
        const testCases = [
            { input: 121, expected: true },      // Basic palindrome: "121"
            { input: -121, expected: false },     // Negative number: not a palindrome
            { input: 10, expected: false },       // Not a palindrome because reversed "01" != "10"
            { input: 0, expected: true },         // Edge case: 0 is a palindrome
            { input: 12321, expected: true },     // Another palindrome example
            // Large input example (within JavaScript number limits)
            { input: 123454321, expected: true }  // Large palindrome number
        ];

        // Iterate over each test case to verify correctness.
        testCases.forEach((test, index) => {
            // Call the isPalindrome method to get the result.
            const result = this.isPalindrome(test.input);

            // Output the test result to the console.
            if (result === test.expected) {
                console.log(`Test case ${index + 1} passed.`);
            } else {
                console.log(`Test case ${index + 1} failed: input ${test.input}, expected ${test.expected}, got ${result}`);
            }
        });
    }
}

// Execute the main method to run all test cases.
PalindromeChecker.main();