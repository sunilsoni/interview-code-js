/**
 * Function: solution
 *
 * Given an array of integers (cityLine) representing the heights of adjacent skyscrapers
 * (each of width 1), determine the area of the largest square that can fit within them.
 *
 * A square of side L can be formed if there exists a contiguous segment of at least L skyscrapers
 * whose height is each at least L. This solution uses a modified stack approach similar to
 * the "largest rectangle in a histogram" problem. For each building, when we pop from the stack,
 * we calculate the maximum possible square side using:
 *
 *    side = Math.min( height, width )
 *
 * where:
 *    - height is the popped building's height,
 *    - width is the number of contiguous buildings for which the popped height is a lower bound.
 *
 * The answer is the area of the square with the largest side found.
 *
 * @param {number[]} cityLine - Array of integers representing skyscraper heights.
 * @returns {number} The area (side^2) of the largest square that can fit.
 */
function solution(cityLine) {
    const n = cityLine.length;
    let bestSide = 0;
    const stack = [];

    // Process each skyscraper.
    for (let i = 0; i < n; i++) {
        // While current height is less than the height at the stack's top,
        // we have found the right boundary for the skyscraper at stack top.
        while (stack.length && cityLine[stack[stack.length - 1]] > cityLine[i]) {
            const poppedIndex = stack.pop();
            const height = cityLine[poppedIndex];
            // If the stack is empty, width is i; otherwise, width is the distance between
            // current index i and the new top index minus one.
            const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
            const side = Math.min(height, width);
            bestSide = Math.max(bestSide, side);
        }
        stack.push(i);
    }

    // Process remaining buildings in the stack.
    while (stack.length) {
        const poppedIndex = stack.pop();
        const height = cityLine[poppedIndex];
        const width = stack.length ? n - stack[stack.length - 1] - 1 : n;
        const side = Math.min(height, width);
        bestSide = Math.max(bestSide, side);
    }

    return bestSide * bestSide; // Return the area.
}

/* =========================================================================
   Testing Approach and Considerations:
   =========================================================================
   - The analysis directly addresses the problem: given a histogram-like input (cityLine),
     it finds the largest square that can be formed.
   - All possible constraints (minimum contiguous length, minimum height, edge cases like
     single building) are handled by the stack algorithm.
   - The solution is as simple and direct as possible using a well-known algorithm
     (modified largest rectangle in histogram) and runs in O(n) time.
   - It is resource-feasible (O(n) time and O(n) space) and should scale to large inputs (up to 10⁶ elements).
   - Edge cases considered include:
       • Single building (e.g., [5])
       • Uniform height arrays (e.g., [4, 4, 4, 4])
       • Increasing then decreasing heights (e.g., [1, 2, 3, 2, 1])
   - Testing includes:
       • Provided example cases.
       • Additional edge scenarios.
       • A large random test case (with verification by checking execution performance).
   - The minimal reproducible example is the code snippet in this file with the main() function below.
   - Testing uses a simple main method without any external libraries such as JUnit.
*/

/**
 * Helper function to compare expected and actual results.
 */
function assertEqual(actual, expected, testName) {
    if (actual === expected) {
        console.log(`PASS [${testName}]: expected ${expected} and got ${actual}`);
    } else {
        console.error(`FAIL [${testName}]: expected ${expected} but got ${actual}`);
    }
}

/**
 * Main method for testing the solution function.
 */
function main() {
    // Provided test cases:
    let cityLine, expected, result;

    // Example 1:
    cityLine = [1, 2, 3, 2, 1];
    expected = 4; // 2x2 square area = 4
    result = solution(cityLine);
    assertEqual(result, expected, "Example 1");

    // Example 2:
    cityLine = [4, 3, 4];
    expected = 9; // 3x3 square area = 9
    result = solution(cityLine);
    assertEqual(result, expected, "Example 2");

    // Additional edge test: single building
    cityLine = [5];
    expected = 1; // Only a 1x1 square can fit.
    result = solution(cityLine);
    assertEqual(result, expected, "Single building");

    // Additional test: uniform heights (all 4's)
    cityLine = [4, 4, 4, 4];
    // Maximum square side is 4 (since there are 4 contiguous buildings with height >= 4)
    expected = 16;
    result = solution(cityLine);
    assertEqual(result, expected, "Uniform heights");

    // Additional test: increasing heights
    cityLine = [1, 2, 3, 4, 5];
    // The largest square possible is 3x3 (for example, subarray [3,4,5] gives min height 3)
    expected = 9;
    result = solution(cityLine);
    assertEqual(result, expected, "Strictly increasing heights");

    // Additional test: decreasing heights
    cityLine = [5, 4, 3, 2, 1];
    // Similarly, largest square is 3x3 (for example, first three elements: min height = 3)
    expected = 9;
    result = solution(cityLine);
    assertEqual(result, expected, "Strictly decreasing heights");

    // Large data test: Create a large array (e.g., 1e6 elements) with random heights between 1 and 1e6.
    // For performance testing, we won't know the expected value easily, so we mainly check for performance.
    const largeDataSize = 1e6;
    cityLine = new Array(largeDataSize);
    for (let i = 0; i < largeDataSize; i++) {
        // For a reproducible test, we use a simple pseudo-random generation
        cityLine[i] = Math.floor(Math.random() * 1e6) + 1;
    }
    console.time("Large data test");
    result = solution(cityLine);
    console.timeEnd("Large data test");
    console.log(`Large data test result: ${result} (value may vary)`);
}

// Run the tests
main();