/*
We have two SORTED arrays of integers: A and B. A has empty slots at the end of it. It has exactly as many empty slots as there are elements in B. Your goal is to merge the elements from B into A so that array A contains all of the elements in sorted order.

Optimize for speed and memory usage.

Input:
A = [1, 2, 3, _, _, _, _]
B = [2, 4, 6, 100]

Expected output:
A = [1, 2, 2, 3, 4, 6, 100]
 */


/**
 * Merges array B into array A which has empty slots at the end.
 * Both arrays are already sorted.
 *
 * @param {Array} A - First sorted array with empty slots (represented as null or undefined)
 * @param {Array} B - Second sorted array
 * @returns {Array} - Array A after merging
 */
function mergeSortedArrays(A, B) {
    // Find the actual length of array A (excluding empty slots)
    let actualLengthA = 0;
    while (actualLengthA < A.length && A[actualLengthA] !== undefined && A[actualLengthA] !== null && A[actualLengthA] !== '_') {
        actualLengthA++;
    }

    // Get the length of array B
    const lengthB = B.length;

    // Start from the end of both arrays
    let indexA = actualLengthA - 1;  // Last actual element in A
    let indexB = lengthB - 1;        // Last element in B
    let mergeIndex = actualLengthA + lengthB - 1;  // Last position after merge

    // Merge arrays from the end to the beginning
    while (indexB >= 0) {
        // If there are still elements in A and A's element is larger
        if (indexA >= 0 && A[indexA] > B[indexB]) {
            A[mergeIndex] = A[indexA];  // Place A's element
            indexA--;                   // Move A's pointer back
        } else {
            A[mergeIndex] = B[indexB];  // Place B's element
            indexB--;                   // Move B's pointer back
        }
        mergeIndex--;                   // Move merged array pointer back
    }

    return A;
}

/**
 * Main function to test the solution with various test cases
 */
function main() {
    // Test case 1: Example from the problem
    const test1A = [1, 2, 3, '_', '_', '_', '_'];
    const test1B = [2, 4, 6, 100];
    const result1 = mergeSortedArrays(test1A, test1B);
    const expected1 = [1, 2, 2, 3, 4, 6, 100];
    console.log("Test 1:", arraysEqual(result1, expected1) ? "PASS" : "FAIL");

    // Test case 2: B is empty
    const test2A = [1, 2, 3];
    const test2B = [];
    const result2 = mergeSortedArrays(test2A, test2B);
    const expected2 = [1, 2, 3];
    console.log("Test 2:", arraysEqual(result2, expected2) ? "PASS" : "FAIL");

    // Test case 3: A is effectively empty
    const test3A = ['_', '_', '_'];
    const test3B = [4, 5, 6];
    const result3 = mergeSortedArrays(test3A, test3B);
    const expected3 = [4, 5, 6];
    console.log("Test 3:", arraysEqual(result3, expected3) ? "PASS" : "FAIL");

    // Test case 4: Larger arrays
    const test4A = Array(1000).fill('_');
    const test4B = Array.from({length: 1000}, (_, i) => i + 1);
    for (let i = 0; i < 1000; i++) {
        if (i % 2 === 0) {
            test4A[i] = i;
        }
    }
    const result4 = mergeSortedArrays(test4A, test4B);
    let isCorrect = true;
    let lastVal = -1;
    for (let i = 0; i < result4.length; i++) {
        if (result4[i] < lastVal) {
            isCorrect = false;
            break;
        }
        lastVal = result4[i];
    }
    console.log("Test 4 (large arrays):", isCorrect ? "PASS" : "FAIL");

    // Test case 5: All elements in B are smaller than A
    const test5A = [10, 11, 12, '_', '_', '_'];
    const test5B = [1, 2, 3];
    const result5 = mergeSortedArrays(test5A, test5B);
    const expected5 = [1, 2, 3, 10, 11, 12];
    console.log("Test 5:", arraysEqual(result5, expected5) ? "PASS" : "FAIL");

    // Test case 6: All elements in B are larger than A
    const test6A = [1, 2, 3, '_', '_', '_'];
    const test6B = [4, 5, 6];
    const result6 = mergeSortedArrays(test6A, test6B);
    const expected6 = [1, 2, 3, 4, 5, 6];
    console.log("Test 6:", arraysEqual(result6, expected6) ? "PASS" : "FAIL");
}

/**
 * Helper function to check if two arrays are equal
 */
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}

// Run the tests
main();