/**
 * Reverses each word in the input string without changing word order or spaces.
 * Does not use built-in splitting or reversing methods.
 */
function reverseWords(str) {
    // The final string we'll build and return
    let result = '';
    // Temporary buffer to collect characters of the current word
    let wordBuffer = '';

    // Scan each character of the input string
    for (let i = 0; i < str.length; i++) {
        let char = str[i]; // current character

        // If we hit a space, time to reverse the collected word
        if (char === ' ') {
            // Manually reverse wordBuffer by iterating from end → start
            for (let j = wordBuffer.length - 1; j >= 0; j--) {
                result += wordBuffer[j];
            }
            // Append the space to maintain original spacing
            result += ' ';
            // Clear buffer for the next word
            wordBuffer = '';
        } else {
            // Collect character into the buffer
            wordBuffer += char;
        }
    }

    // After the loop, reverse and append the final word (if any)
    for (let j = wordBuffer.length - 1; j >= 0; j--) {
        result += wordBuffer[j];
    }

    // Return the transformed string
    return result;
}

// Example usage:
const input = "my name is vinod";
console.log(reverseWords(input)); // → "ym eman si doniv"