function findSecondLongestWord(sentence) {
    let word = '';
    let longest = '';
    let secondLongest = '';

    // Manual splitting and finding words
    for (let i = 0; i <= sentence.length; i++) {
        // If space or end of sentence is encountered
        if (sentence[i] === ' ' || i === sentence.length) {
            // Compare word lengths and update longest/secondLongest
            if (word.length > longest.length) {
                secondLongest = longest;
                longest = word;
            } else if (word.length > secondLongest.length && word.length < longest.length) {
                secondLongest = word;
            }
            // Reset word
            word = '';
        } else {
            // Build word character by character
            word += sentence[i];
        }
    }

    return secondLongest;
}

// Test cases
console.log(findSecondLongestWord("my name is koushik reddy")); // Output: reddy
console.log(findSecondLongestWord("hello world programming")); // Output: programming
