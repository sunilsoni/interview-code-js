function checkAnagram(str1, str2) {
    // Remove spaces and convert to lowercase for consistent comparison
    str1 = str1.toLowerCase().replace(/\s/g, '');
    str2 = str2.toLowerCase().replace(/\s/g, '');

    // Check if the lengths are different, if yes, they can't be anagrams
    if (str1.length !== str2.length) {
        return false;
    }

    // Convert strings to arrays, sort them, and join back to strings
    // This will put all characters in same order for comparison
    const sortedStr1 = str1.split('').sort().join('');
    const sortedStr2 = str2.split('').sort().join('');

    // Compare the sorted strings
    // If they're equal, they're anagrams
    return sortedStr1 === sortedStr2;
}

// Test cases
console.log(checkAnagram('Listen', 'Silent')); // true
console.log(checkAnagram('triangle', 'integral')); // true
console.log(checkAnagram('hello', 'world')); // false
