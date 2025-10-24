/**
 * Returns the sum of all numbers passed in.
 * @param  {...number} nums – any count of numbers to add
 * @returns {number} the total sum
 */
function sum(...nums) {
    // nums is an array of all arguments
    return nums.reduce((total, n) => total + n, 0);
}

// Examples:
console.log(sum(2, 3, 4));            // 9
console.log(sum(6, 7, 8, 10, 15));   // 46
console.log(sum(1, 2, 3, 4, 5, 6, 7));// 28