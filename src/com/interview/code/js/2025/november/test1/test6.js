function removeDuplicates(arr) {
    let result = [];
    let resultIndex = 0;

    for (let i = 0; i < arr.length; i++) {
        let isDuplicate = false;

        // Check if current element already exists in result array
        for (let j = 0; j < resultIndex; j++) {
            if (arr[i] === result[j]) {
                isDuplicate = true;
                break;
            }
        }

        // If not duplicate, add to result
        if (!isDuplicate) {
            result[resultIndex] = arr[i];
            resultIndex++;
        }
    }

    return result;
}

// Test cases
console.log(removeDuplicates([1, 1, 2, 2, 3]));      // Output: [1, 2, 3]
console.log(removeDuplicates([5, 5, 5, 5]));         // Output: [5]
console.log(removeDuplicates([1, 2, 3, 4, 5]));      // Output: [1, 2, 3, 4, 5]
console.log(removeDuplicates([1, 2, 1, 3, 2, 4]));   // Output: [1, 2, 3, 4]