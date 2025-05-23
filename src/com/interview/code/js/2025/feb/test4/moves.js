/*

You are given an array A of N positive integers. In one move, you can pick a segment (a contiguous fragment) of A and a positive integer X and then increase all elements within that segment by X. An array is strictly increasing if each element (except for the last one) is smaller than the next element.

Write a function:

```javascript
function solution(A);
```

that, given an array A of N integers, returns the minimum number of moves needed to make the array strictly increasing.

### Examples:
1. Given A = [4, 2, 4, 1, 3, 5], the function should return 2. One possible solution is to add X = 3 to the segment [2, 4], and then add X = 8 to the segment [1, 3, 5]. As a result of these two moves, A is now strictly increasing.

   ```
   Initial array: [4, 2, 4, 1, 3, 5]
   After first move (add 3 to [2, 4]): [4, 5, 4, 1, 3, 5]
   After second move (add 8 to [1, 3, 5]): [4, 5, 7, 13, 9, 13]
   ```

2. Given A = [3, 5, 7, 7], the function should return 1.

3. Given A = [1, 5, 6, 10], the function should return 0.

### Write an efficient algorithm for the following assumptions:
- N is an integer within the range [1..100,000].
- Each element of array A is an integer within the range [1..1,000,000,000]. This assumption **does not** have to hold after making a move.

 */
class Solution {
    /**
     * Returns the minimum number of moves required to make array A strictly increasing.
     * A move: choose a contiguous segment and add a positive integer X uniformly.
     */
    static solution(A) {
        if (A.length <= 1) return 0;
        let moves = 0;
        // P holds the final value of the most recently “fixed” element.
        let P = A[0];
        let i = 1;
        while (i < A.length) {
            // If the current element is already greater than P, no move is needed.
            if (A[i] > P) {
                P = A[i];
                i++;
            } else {
                // Otherwise, we must fix a violation.
                // Identify the maximal contiguous segment (starting at i) that is strictly increasing originally.
                let start = i;
                let j = i;
                while (j + 1 < A.length && A[j + 1] > A[j]) {
                    j++;
                }
                // Calculate the minimum addition needed so that the first element of this segment becomes P+1.
                const inc = P + 1 - A[start];
                // After applying this move to the entire segment [start, j],
                // the last element becomes A[j] + inc.
                P = A[j] + inc;
                moves++;
                i = j + 1;
            }
        }
        return moves;
    }

    /**
     * Main method to run test cases.
     */
    static main() {
        // Define test cases: each with an input array and the expected result.
        const testCases = [
            {input: [4, 2, 4, 1, 3, 5], expected: 2},
            {input: [3, 5, 7, 7], expected: 1},
            {input: [1, 5, 6, 10], expected: 0},
            {input: [5, 4, 3], expected: 2},
            {input: [3, 2, 3], expected: 1},
            {input: [1, 1, 1], expected: 2}
        ];

        // Process each test case and output results.
        for (const test of testCases) {
            // We pass a copy of the array to avoid accidental mutations.
            const result = Solution.solution([...test.input]);
            const status = result === test.expected ? "pass" : "fail";
            console.log(
                `Input: ${JSON.stringify(test.input)} | Expected: ${test.expected} | Got: ${result} | ${status}`
            );
        }
    }
}

// Execute the main method to run test cases.
Solution.main();

