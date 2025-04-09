class Calculator {
    constructor(initialValue) {
        this.result = initialValue;
    }

    // Adds the given number to the current result.
    add(number) {
        this.result += number;
        return this; // Enables method chaining.
    }

    // Subtracts the given number from the current result.
    subtract(number) {
        this.result -= number;
        return this;
    }

    // Multiplies the current result by the given number.
    multiply(number) {
        this.result *= number;
        return this;
    }

    // Divides the current result by the given number.
    // Throws an error if division by zero is attempted.
    divide(number) {
        if (number === 0) {
            throw new Error("Division by zero is not allowed");
        }
        this.result /= number;
        return this;
    }

    // Raises the current result to the power of the given number.
    power(number) {
        this.result = Math.pow(this.result, number);
        return this;
    }

    // Returns the final result after all operations.
    getResult() {
        return this.result;
    }
}