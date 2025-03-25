/**
 * @param {number} x
 * @return {boolean}
 */
const isPalindrome = (x) => {
    // Handle negative numbers - they can't be palindromes due to the minus sign
    if (x < 0) return false;

    // Handle single digit numbers - they are always palindromes
    if (x < 10) return true;

    // Handle numbers ending with 0 - they can't be palindromes (except 0 itself)
    if (x % 10 === 0 && x !== 0) return false;

    let reversedNum = 0;
    let originalNum = x;

    // Reverse the number by extracting digits
    while (x > 0) {
        reversedNum = (reversedNum * 10) + (x % 10);
        x = Math.floor(x / 10);
    }

    // Compare original number with reversed number
    return originalNum === reversedNum;
};

// Test function
function runTests() {
    const testCases = [
        { input: 121, expected: true },
        { input: -121, expected: false },
        { input: 10, expected: false },
        { input: 0, expected: true },
        { input: 1234321, expected: true },
        { input: 1000021, expected: false },
    ];

    testCases.forEach((test, index) => {
        const result = isPalindrome(test.input);
        console.log(
            `Test ${index + 1}: ${result === test.expected ? 'PASS' : 'FAIL'}`
        );
        console.log(`Input: ${test.input}`);
        console.log(`Expected: ${test.expected}, Got: ${result}\n`);
    });
}

// Run tests
runTests();
