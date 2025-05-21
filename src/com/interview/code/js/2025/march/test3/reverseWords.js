function reverseWords(inputString) {
    // Initialize empty result string
    let result = '';

    // Initialize temporary word to store characters
    let tempWord = '';

    // Loop through each character in the input string
    for(let i = 0; i < inputString.length; i++) {

        // If current character is not a space, add to tempWord
        if(inputString[i] !== ' ') {
            tempWord = inputString[i] + tempWord; // Add character at front of tempWord
        }

        // If space is encountered OR we reach the end of string
        if(inputString[i] === ' ' || i === inputString.length - 1) {
            // Add the reversed word to result
            result = result + tempWord;

            // Add space if it's not the end of string
            if(i !== inputString.length - 1) {
                result = result + ' ';
            }

            // Reset tempWord for next word
            tempWord = '';
        }
    }

    return result;
}

// Test the function
let str = "my name is vinod";
console.log(reverseWords(str)); // Output: "ym eman si doniv"
