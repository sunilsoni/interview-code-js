function solve1(a, b) {
    let result = '';
    let carry = 0;

    // pointers for both strings, starting from the last characters
    let i = a.length - 1;
    let j = b.length - 1;

    while (i >= 0 || j >= 0 || carry) {
        let sum = carry;

        if (i >= 0) sum += Number(a[i--]);
        if (j >= 0) sum += Number(b[j--]);

        // Calculate current digit and update carry
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }

    return result;
}

console.log(solve1("11", "1"));      // Example #1 -> Output: 100
console.log(solve1("1010", "1011")); // Example #2 -> Output: 10101