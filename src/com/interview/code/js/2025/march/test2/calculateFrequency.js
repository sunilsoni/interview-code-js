// Function to calculate frequency of characters
function calculateFrequency(array) {
    let frequency = {}; // Object to store frequencies

    array.forEach(row => {
        row.forEach(char => {
            // If the character exists in the frequency object, increment its count
            if (frequency[char]) {
                frequency[char]++;
            } else {
                // Otherwise, initialize the count for this character
                frequency[char] = 1;
            }
        });
    });

    return frequency; // Return the frequency object
}

// Define the 2D character array
let charArray = [
    ['a', 'b', 'c'], // First row
    ['b', 'c', 'd'], // Second row
    ['d', 'a', 'x']  // Third row
];

// Calculate the frequency of characters
let result = calculateFrequency(charArray);

// Display the result
console.log(result);
