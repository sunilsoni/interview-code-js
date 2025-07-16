/**
 * FizzBuzz Implementation with formatted output
 * @param {number} start - Starting number (default: 1)
 * @param {number} end - Ending number (default: 100)
 */
function fizzBuzz(start = 1, end = 100) {
    // Input validation
    if (start > end) {
        throw new Error('Start number cannot be greater than end number');
    }

    // Iterate through numbers and print formatted output
    for (let i = start; i <= end; i++) {
        let output = i.toString(); // Start with the number

        // Check for multiples of both 3 and 5 first
        if (i % 3 === 0 && i % 5 === 0) {
            output += ' fizzbuzz';
        }
        // Check for multiple of 3
        else if (i % 3 === 0) {
            output += ' fizz';
        }
        // Check for multiple of 5
        else if (i % 5 === 0) {
            output += ' buzz';
        }

        console.log(output);
    }
}

/**
 * Test function to verify FizzBuzz implementation
 */
function testFizzBuzz() {
    console.log("Test Case 1: Basic Range (1-15)");
    console.log("Expected output:");
    fizzBuzz(1, 15);

    console.log("\nTest Case 2: Edge Case - Single Number");
    fizzBuzz(1, 1);

    console.log("\nTest Case 3: Performance Test (1-100)");
    console.time('Performance');
    fizzBuzz(1, 100);
    console.timeEnd('Performance');
}

// Run the basic test (1-15 range)
console.log("FizzBuzz Output (1-15):");
fizzBuzz(1, 15);

/* Output will be:
1
2
3 fizz
4
5 buzz
6 fizz
7
8
9 fizz
10 buzz
11
12 fizz
13
14
15 fizzbuzz
*/
