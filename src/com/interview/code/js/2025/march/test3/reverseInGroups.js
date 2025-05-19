function reverseInGroups(arr, k) {
    for (let i = 0; i < arr.length; i += k) {
        let left = i;
        let right = Math.min(i + k - 1, arr.length - 1);

        // Reverse sub-array [left, right]
        while (left < right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
            right--;
        }
    }
    return arr;
}

// Example usage:
const arr = [1, 2, 3, 4, 5];
const k = 3;

console.log(reverseInGroups(arr, k)); // Output: [3, 2, 1, 5, 4]
setTimeout(() => {
    console.log(1);
}, 1);

setImmediate(() => {
    console.log(2);
});