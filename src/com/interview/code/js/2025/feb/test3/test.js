function solution(forest, bird) {
    // Clone the forest array so we don't modify the original (optional)
    const forestCopy = forest.slice();

    const foundIndices = [];
    let totalLength = 0;
    // The bird always returns to its initial position after picking a stick.
    // So each search starts at index 'bird'.
    let directionRight = true; // start by flying right

    // Continue until the nest has a total stick length of at least 100.
    while (totalLength < 100) {
        let found = false;

        if (directionRight) {
            // Fly right: from bird+1 to end of forest.
            for (let i = bird + 1; i < forestCopy.length; i++) {
                if (forestCopy[i] > 0) {
                    foundIndices.push(i);
                    totalLength += forestCopy[i];
                    // Mark this stick as used.
                    forestCopy[i] = 0;
                    found = true;
                    break;
                }
            }
        } else {
            // Fly left: from bird-1 down to beginning.
            for (let i = bird - 1; i >= 0; i--) {
                if (forestCopy[i] > 0) {
                    foundIndices.push(i);
                    totalLength += forestCopy[i];
                    // Mark this stick as used.
                    forestCopy[i] = 0;
                    found = true;
                    break;
                }
            }
        }

        // The problem guarantees that the bird will always find a stick,
        // so we do not need to handle a case when none is found.
        if (!found) {
            // In a robust implementation, we might throw an error or break here.
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

    // Helper function to compare arrays
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Test Case 1: Provided example
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

    // Test Case 2: Bird at beginning, but still finds sticks in both directions.
    // Although bird at 0 means left search won't find any, the guarantee implies input is chosen to avoid this.
    // We'll simulate a scenario where bird starts at 1.
    testCount++;
    (function testBirdNearStart() {
        const forest = [0, 10, 0, 30, 0, 70];
        const bird = 1; // starting at forest[1]=10; though it's a stick, the bird is on it but we don't pick it.
        // The algorithm:
        // - First, search right: from index 2 onward, first found is index 3 (30)
        //   Total: 30
        // - Next, search left: from index 0, first found is none? But index 0 is 0.
        //   However, due to guarantee, let's adjust: ensure there is a stick on the left.
        // Let's modify forest: use [20, 10, 0, 30, 0, 70]
        const modForest = [20, 10, 0, 30, 0, 70];
        const expected = [3, 0, 5];
        // Explanation:
        // - Right from index 1: index 3 has 30 → total=30.
        // - Left from index 1: index 0 has 20 → total=50.
        // - Right from index 1: continue from index 2, index 2 is 0, index 3 is used, index 4 is 0, index 5 has 70 → total=120.
        // Stick indices in order: [3, 0, 5]
        const result = solution(modForest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 2 PASS");
            passCount++;
        } else {
            console.log("Test Case 2 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    // Test Case 3: Edge scenario with many zeros and just enough sticks.
    testCount++;
    (function testSparseSticks() {
        const forest = [0, 0, 40, 0, 0, 30, 0, 0, 35, 0, 0];
        const bird = 4;
        // Order:
        // - Right from index 4: index 5 is 30 → total=30.
        // - Left from index 4: index 3=0, index 2=40 → total=70.
        // - Right from index 4: search from index 5 (used) then index 6=0, index 7=0, index 8=35 → total=105.
        // Expected indices: [5, 2, 8]
        const expected = [5, 2, 8];
        const result = solution(forest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 3 PASS");
            passCount++;
        } else {
            console.log("Test Case 3 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    // Test Case 4: Large data input.
    testCount++;
    (function testLargeData() {
        // Create a forest array of length 1000.
        // We'll fill most of it with zeros and insert sticks at known positions to guarantee a sum ≥ 100.
        const forest = new Array(1000).fill(0);
        // Put sticks at various positions.
        forest[100] = 20;
        forest[300] = 30;
        forest[500] = 25;
        forest[700] = 40;
        // The total is 20+30+25+40 = 115.
        const bird = 250; // bird starts somewhere in the middle.
        // The algorithm (starting at index 250):
        // - First, fly right: starting at index 251... first stick encountered is at index 300 (30).
        //   Total=30.
        // - Then fly left: starting at index 249 downwards... first stick is at index 100 (20).
        //   Total=50.
        // - Then fly right: starting at index 251... next available is at index 500 (25) since index 300 was already used.
        //   Total=75.
        // - Then fly left: starting from index 249... No stick left on left because index 100 is used.
        //   However, the guarantee says the bird will always find a stick. In this case, since left direction is exhausted,
        //   the bird would have to find a stick in the right direction on a subsequent turn.
        //   But to follow the alternating pattern, if one direction has no new stick,
        //   the implementation will throw an error.
        // To avoid this, we ensure that both directions always have a stick.
        // Let's add one more stick to the left side.
        forest[50] = 50; // Now the left side has a stick.
        // Recalculate order:
        // - First right: index 300 (30) → total=30.
        // - First left: index 249... eventually index 50 (50) → total=80.
        // - Next right: from index 251, index 500 (25) → total=105.
        // Expected order: [300, 50, 500].
        const expected = [300, 50, 500];
        const result = solution(forest, bird);
        if (arraysEqual(result, expected)) {
            console.log("Test Case 4 PASS");
            passCount++;
        } else {
            console.log("Test Case 4 FAIL. Expected:", expected, "Got:", result);
        }
    })();

    console.log(`\n${passCount}/${testCount} test cases passed.`);
}

// Run the tests
runTests();