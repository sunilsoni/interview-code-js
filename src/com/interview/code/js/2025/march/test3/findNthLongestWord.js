function findNthLongestWord(sentence, n) {
    // Validation
    if(!sentence || n < 1) return '';

    let word = '';
    // Create array to store N longest words
    let topNWords = new Array(n).fill('');
    let wordCount = 0;

    for(let i = 0; i <= sentence.length; i++) {
        if(i === sentence.length || sentence[i] === ' ') {
            if(word.length === 0) continue;

            wordCount++;

            // Insert word in correct position in topNWords
            insertIntoTopN(topNWords, word, n);
            word = '';
        } else {
            word += sentence[i];
        }
    }

    // If we don't have enough words
    if(wordCount < n) return '';

    // Return the nth longest word (last element in our array)
    return topNWords[n-1];
}

function insertIntoTopN(topNWords, newWord, n) {
    let pos = 0;

    // Find position where newWord should be inserted
    while(pos < n && topNWords[pos].length > newWord.length) {
        pos++;
    }

    // If word should be included in top N
    if(pos < n) {
        // Shift elements to make room for new word
        for(let i = n-1; i > pos; i--) {
            topNWords[i] = topNWords[i-1];
        }
        topNWords[pos] = newWord;
    }
}

// Test cases
console.log(findNthLongestWord("my name is koushik reddy", 1)); // "koushik"
console.log(findNthLongestWord("my name is koushik reddy", 2)); // "reddy"
console.log(findNthLongestWord("my name is koushik reddy", 3)); // "name"
console.log(findNthLongestWord("my name is koushik reddy", 4)); // "is"
console.log(findNthLongestWord("my name is koushik reddy", 5)); // "my"
