function groupAnagrams(words) {
    // Create a Map to store sorted string as key and array of anagrams as value
    const anagramGroups = new Map();

    // Process each word in the input array
    for (let word of words) {
        // Create sorted key for the word
        // Convert to lowercase, split to array, sort and join back
        const sortedWord = word.toLowerCase().split('').sort().join('');

        // If this sorted pattern exists, add to existing group
        // If not, create new group
        if (anagramGroups.has(sortedWord)) {
            anagramGroups.get(sortedWord).push(word);
        } else {
            anagramGroups.set(sortedWord, [word]);
        }
    }

    // Convert Map values to array and return
    return Array.from(anagramGroups.values());
}

// Test cases
const wordList = [
    "eat", "tea", "tan", "ate", "nat", "bat",
    "Listen", "Silent", "triangle", "integral"
];

const result = groupAnagrams(wordList);
console.log(result);
