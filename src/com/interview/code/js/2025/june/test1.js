/**
 * Determines if two strings are anagrams of each other
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @returns {boolean} - True if strings are anagrams, false otherwise
 */
function areAnagrams(str1, str2) {
    // Input validation
    if (!str1 || !str2) {
        return false; // Handle null or empty inputs
    }

    // Convert to lowercase and remove non-alphabetic characters
    const cleanStr1 = str1.toLowerCase().replace(/[^a-z]/g, '');
    const cleanStr2 = str2.toLowerCase().replace(/[^a-z]/g, '');

    // Quick length check - if lengths differ, they can't be anagrams
    if (cleanStr1.length !== cleanStr2.length) {
        return false;
    }

    // Sort both strings and compare
    const sortedStr1 = cleanStr1.split('').sort().join('');
    const sortedStr2 = cleanStr2.split('').sort().join('');

    return sortedStr1 === sortedStr2;
}

/**
 * Alternative solution using character frequency count
 * More efficient for longer strings
 */
function areAnagramsFrequency(str1, str2) {
    // Input validation
    if (!str1 || !str2) {
        return false;
    }

    // Clean inputs
    const cleanStr1 = str1.toLowerCase().replace(/[^a-z]/g, '');
    const cleanStr2 = str2.toLowerCase().replace(/[^a-z]/g, '');

    // Quick length check
    if (cleanStr1.length !== cleanStr2.length) {
        return false;
    }

    // Create character frequency map
    const charCount = new Map();

    // Count characters in first string
    for (let char of cleanStr1) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }

    // Decrement counts for second string
    for (let char of cleanStr2) {
        if (!charCount.has(char)) {
            return false;
        }
        charCount.set(char, charCount.get(char) - 1);
        if (charCount.get(char) === 0) {
            charCount.delete(char);
        }
    }

    return charCount.size === 0;
}

/**
 * Test suite for anagram functions
 */
function testAnagrams() {
    const testCases = [
        {str1: 'bare', str2: 'bear', expected: true},
        {str1: 'reed', str2: 'deer', expected: true},
        {str1: 'flow', str2: 'wolf', expected: true},
        {str1: 'hello', str2: 'world', expected: false},
        {str1: 'Listen', str2: 'Silent', expected: true},
        {str1: '', str2: '', expected: false},
        {str1: 'A gentleman', str2: 'Elegant man', expected: true},
        {str1: '12345', str2: '54321', expected: true}
    ];

    console.log('Testing Sort Method:');
    testCases.forEach((test, index) => {
        const result = areAnagrams(test.str1, test.str2);
        console.log(`Test ${index + 1}: "${test.str1}" & "${test.str2}"`);
        console.log(`Expected: ${test.expected}, Got: ${result}`);
        console.log(`Status: ${result === test.expected ? 'PASS ✅' : 'FAIL ❌'}\n`);
    });

    console.log('Testing Frequency Method:');
    testCases.forEach((test, index) => {
        const result = areAnagramsFrequency(test.str1, test.str2);
        console.log(`Test ${index + 1}: "${test.str1}" & "${test.str2}"`);
        console.log(`Expected: ${test.expected}, Got: ${result}`);
        console.log(`Status: ${result === test.expected ? 'PASS ✅' : 'FAIL ❌'}\n`);
    });

    // Performance test
    console.log('Performance Test:');
    const longStr1 = 'a'.repeat(100000);
    const longStr2 = 'a'.repeat(100000);

    console.time('Sort Method');
    areAnagrams(longStr1, longStr2);
    console.timeEnd('Sort Method');

    console.time('Frequency Method');
    areAnagramsFrequency(longStr1, longStr2);
    console.timeEnd('Frequency Method');
}

// Run tests
testAnagrams();

// Example usage:
console.log(areAnagrams('bare', 'bear'));  // true
console.log(areAnagrams('hello', 'world')); // false
