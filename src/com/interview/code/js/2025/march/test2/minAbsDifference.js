/*
Given an integer array arr[] and an integer target. The task is to find a subsequence of arr such that the absolute difference between the sum of its elements and target is minimized. Return the minimum possible value of abs(sum - target).

Note: Subsequence of an array is an array formed by removing some (possibly all or none) of the original elements.

Examples:

Input: arr = [5, -7, 3, 5], target = 6
Output: 0
Explanation: Choose the whole array as a subsequence, with a sum of 6. This is equal to the target, so the absolute difference is 0.


Input: arr = [1, 2, 3], target = -7
Output: 7
Explanation: Choosing no elements results in a sum of 0, which is the closest to -7.

 */

function minAbsDifference(arr, target) {
    // Get array length
    const n = arr.length;

    // Calculate sum of all positive and negative numbers
    let totalSum = 0;
    for (let num of arr) {
        totalSum += num;
    }

    // Create DP array to store possible sums
    // Using Set to store unique sums at each step
    let dp = new Set([0]);

    // Generate all possible subsequence sums
    for (let num of arr) {
        const newSums = new Set();
        for (let sum of dp) {
            newSums.add(sum + num);
        }
        // Merge new sums with existing sums
        for (let sum of newSums) {
            dp.add(sum);
        }
    }

    // Find minimum absolute difference
    let minDiff = Infinity;
    for (let sum of dp) {
        minDiff = Math.min(minDiff, Math.abs(sum - target));
    }

    return minDiff;
}

// Test cases
console.log(minAbsDifference([5, -7, 3, 5], 6));  // Output: 0
console.log(minAbsDifference([1, 2, 3], -7));     // Output: 7
