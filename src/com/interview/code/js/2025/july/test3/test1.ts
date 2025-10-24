// Function to sum numbers greater than 10
function sumGreaterThanTen(arr) {
    return arr.reduce((sum, num) => {
        return num > 10 ? sum + num : sum;
    }, 0);
}

// Alternative function using for loop
function sumGreaterThanTenWithLoop(arr) {
    let sum = 0;
    for (let num of arr) {
        if (num > 10) {
            sum += num;
        }
    }
    return sum;
}

// Test cases
console.log("Test Case 1:");
console.log(sumGreaterThanTen([5, 12, 8, 20, 3])); // Should output: 32

console.log("\nTest Case 2:");
console.log(sumGreaterThanTen([1, 2, 3, 4, 5])); // Should output: 0

console.log("\nTest Case 3:");
console.log(sumGreaterThanTen([11, 12, 13, 14, 15])); // Should output: 65

console.log("\nTest Case 4:");
console.log(sumGreaterThanTen([])); // Should output: 0

console.log("\nTest Case 5:");
console.log(sumGreaterThanTen([10, 10, 10])); // Should output: 0

// Testing both functions to show they produce the same results
console.log("\nComparing both functions:");
const testArray = [5, 12, 8, 20, 3];
console.log("Using reduce:", sumGreaterThanTen(testArray));
console.log("Using for loop:", sumGreaterThanTenWithLoop(testArray));
