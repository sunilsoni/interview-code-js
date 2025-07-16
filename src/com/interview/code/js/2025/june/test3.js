/**
 * Optimized function to check if two strings are anagrams
 * @param {string} str1
 * @param {string} str2
 * @returns {boolean}
 */
function areAnagrams(str1, str2) {
    // Early return checks
    if (!str1 || !str2 || str1.length !== str2.length) return false;

    // Use array (faster than Map for smaller strings)
    const charCount = new Array(26).fill(0);

    // Single loop for both strings
    for (let i = 0; i < str1.length; i++) {
        // Only process lowercase letters
        const char1 = str1.charAt(i).toLowerCase();
        const char2 = str2.charAt(i).toLowerCase();

        // Skip non-alphabetic characters
        if (char1 >= 'a' && char1 <= 'z') {
            charCount[char1.charCodeAt(0) - 97]++;
        }
        if (char2 >= 'a' && char2 <= 'z') {
            charCount[char2.charCodeAt(0) - 97]--;
        }
    }

    // Check if all counts are zero
    return charCount.every(count => count === 0);
}

/**
 * Optimized version for very large strings using a more efficient counting method
 * @param {string} str1
 * @param {string} str2
 * @returns {boolean}
 */
function areAnagramsLarge(str1, str2) {
    if (!str1 || !str2 || str1.length !== str2.length) return false;

    const charCount = {};

    for (let i = 0; i < str1.length; i++) {
        const char1 = str1[i].toLowerCase();
        const char2 = str2[i].toLowerCase();

        if (char1 >= 'a' && char1 <= 'z') {
            charCount[char1] = (charCount[char1] || 0) + 1;
            charCount[char2] = (charCount[char2] || 0) - 1;
        }
    }

    return Object.values(charCount).every(count => count === 0);
}

/**
 * Performance test suite
 */
function runPerformanceTests() {
    const testCases = [
        { size: 'small', str1: 'listen', str2: 'silent' },
        { size: 'medium', str1: 'a'.repeat(1000), str2: 'a'.repeat(1000) },
        { size: 'large', str1: 'a'.repeat(100000), str2: 'a'.repeat(100000) }
    ];

    testCases.forEach(({ size, str1, str2 }) => {
        console.log(`\nTesting ${size} strings:`);

        console.time('Standard version');
        areAnagrams(str1, str2);
        console.timeEnd('Standard version');

        console.time('Large string version');
        areAnagramsLarge(str1, str2);
        console.timeEnd('Large string version');
    });
}

/**
 * Quick test cases
 */
function runTests() {
    const testCases = [
        ['bare', 'bear', true],
        ['listen', 'silent', true],
        ['hello', 'world', false],
        ['A gentleman', 'Elegant man', true],
        ['', '', false],
        ['12345', '54321', true]
    ];

    testCases.forEach(([str1, str2, expected]) => {
        const result = areAnagrams(str1, str2);
        console.log(
            `"${str1}" & "${str2}": ${result === expected ? '✅' : '❌'}`
        );
    });
}

// Example usage
console.log('\nRunning basic tests:');
runTests();

console.log('\nRunning performance tests:');
runPerformanceTests();
