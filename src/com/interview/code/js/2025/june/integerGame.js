function integerGame(K) {
    let count = 0;
    let number = 0;

    // Loop until we find K such numbers
    while (count < K) {
        number++;

        // Helper: calculate digit sum
        let sum = 0;
        let n = number;
        while (n > 0) {
            sum += n % 10;
            n = Math.floor(n / 10);
        }

        // If the digit sum is 10, it's valid
        if (sum === 10) {
            count++;
        }
    }

    return number;
}
