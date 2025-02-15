function solution(forest, bird) {
    // Work on a copy so that the original forest isn't modified.
    const forestCopy = forest.slice();
    const foundIndices = [];
    let totalLength = 0;

    // Start by flying to the right.
    let directionRight = true;

    // Continue until the total length of collected sticks is at least 100.
    while (totalLength < 100) {
        let found = false;

        if (directionRight) {
            // Fly right: scan from bird+1 upward.
            for (let i = bird + 1; i < forestCopy.length; i++) {
                if (forestCopy[i] > 0) {
                    foundIndices.push(i);
                    totalLength += forestCopy[i];
                    // Mark the stick as used.
                    forestCopy[i] = 0;
                    found = true;
                    break;
                }
            }
        } else {
            // Fly left: scan downward from bird-1 to 0.
            for (let i = bird - 1; i >= 0; i--) {
                if (forestCopy[i] > 0) {
                    foundIndices.push(i);
                    totalLength += forestCopy[i];
                    // Mark the stick as used.
                    forestCopy[i] = 0;
                    found = true;
                    break;
                }
            }
        }

        // Given the problem's guarantees, this situation should not happen.
        if (!found) {
            throw new Error("No available stick found in the expected direction.");
        }

        // Alternate direction for the next search.
        directionRight = !directionRight;
    }

    return foundIndices;
}

function runTests() {
    let testCount = 0;
    let passCount = 0;

    // Helper function to compare arrays.
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Test Case 1: Provided example.
    testCount++;
    (function testProvidedExample() {
        const forest = [25, 0, 50, 0, 0, 0, 0, 15, 0, 0, 45];
        const bird = 4;
        const expected = [7, 2, 10];
        const result = solution(forest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 1 PASS");
            passCount++;
        } else {
            console.log("Test Case 1 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    // Test Case 2: Bird near the start.
    testCount++;
    (function testBirdNearStart() {
        // Adjust forest so that there is a stick available on the left.
        const forest = [20, 10, 0, 30, 0, 70];
        const bird = 1; // bird starts at index 1 (a stick, but it's not auto-collected)
        // Expected behavior:
        // - Right: first stick after index 1 is index 3 (30) → total=30.
        // - Left: scanning left from index 0 gives index 0 (20) → total=50.
        // - Right: next right stick from index 2 is index 5 (70) → total=120.
        // Expected order: [3, 0, 5]
        const expected = [3, 0, 5];
        const result = solution(forest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 2 PASS");
            passCount++;
        } else {
            console.log("Test Case 2 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    // Test Case 3: Sparse forest with many zeros.
    testCount++;
    (function testSparseSticks() {
        const forest = [0, 0, 40, 0, 0, 30, 0, 0, 35, 0, 0];
        const bird = 4;
        // Expected behavior:
        // - Right: from index 5 is the first stick (30) → total=30.
        // - Left: from index 3 downwards finds index 2 (40) → total=70.
        // - Right: from index 5 onward finds index 8 (35) → total=105.
        // Expected order: [5, 2, 8]
        const expected = [5, 2, 8];
        const result = solution(forest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 3 PASS");
            passCount++;
        } else {
            console.log("Test Case 3 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    // Test Case 4: Large forest data.
    testCount++;
    (function testLargeData() {
        // Create a forest array of length 1000.
        const forest = new Array(1000).fill(0);
        // Place sticks at specific indices.
        // To match the expected order [300, 50, 500], we make sure:
        // - Right search: bird=250 finds index 300 first.
        // - Left search: the stick at index 100 is made unavailable so that the first left stick is at index 50.
        forest[50] = 50;   // left stick
        forest[100] = 0;   // set to 0 to avoid picking this one
        forest[300] = 30;  // right stick (first right search)
        forest[500] = 25;  // right stick (next right search)
        forest[700] = 40;  // extra stick (won't be used because total >= 100 before reaching it)

        const bird = 250;
        // Expected behavior:
        // - Right: scan from index 251, first found is index 300 (30) → total=30.
        // - Left: scan downward from index 249, index 100 is 0, then index 50 (50) → total=80.
        // - Right: scan from index 251, skipping index 300 (used), then index 500 (25) → total=105.
        // Expected order: [300, 50, 500]
        const expected = [300, 50, 500];
        const result = solution(forest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 4 PASS");
            passCount++;
        } else {
            console.log("Test Case 4 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    console.log(`\n${passCount} out of ${testCount} test cases passed.`);
}

// Run the tests
runTests();