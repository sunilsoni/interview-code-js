class Calculator {
    constructor(initialValue) {
        this.result = initialValue;
    }

    // Adds the given number and returns the Calculator instance for chaining.
    add(number) {
        this.result += number;
        return this;
    }

    // Subtracts the given number and returns the Calculator instance for chaining.
    subtract(number) {
        this.result -= number;
        return this;
    }

    // Multiplies the result by the given number and returns the Calculator instance for chaining.
    multiply(number) {
        this.result *= number;
        return this;
    }

    // Divides the result by the given number. If dividing by zero, an error is thrown.
    divide(number) {
        if (number === 0) {
            throw new Error("Division by zero is not allowed");
        }
        this.result /= number;
        return this;
    }

    // Raises the result to the power of the given number and returns the Calculator instance.
    power(number) {
        this.result = Math.pow(this.result, number);
        return this;
    }

    // Returns the current result.
    getResult() {
        return this.result;
    }
}

// --- Test Cases ---
// 1. new Calculator(10).add(5).subtract(7).getResult() => 8
const test1 = new Calculator(10).add(5).subtract(7).getResult();
console.log("Test Case 1:", test1); // Expected output: 8

// 2. new Calculator(2).multiply(5).power(2).getResult() => 100
const test2 = new Calculator(2).multiply(5).power(2).getResult();
console.log("Test Case 2:", test2); // Expected output: 100

// 3. new Calculator(20).divide(0).getResult() => Should throw an error.
try {
    const test3 = new Calculator(20).divide(0).getResult();
    console.log("Test Case 3:", test3);
} catch (error) {
    console.log("Test Case 3:", error.message); // Expected output: "Division by zero is not allowed"
}