class Calculator {
    constructor(number) {
        this.result = number;
    }

    add(number) {
        this.result += number;
        return this;
    }

    subtract(number) {
        this.result -= number;
        return this;
    }

    multiply(number) {
        this.result *= number;
        return this;
    }

    divide(number) {
        if (number === 0) {
            throw new Error("Division by zero is not allowed");
        }
        this.result /= number;
        return this;
    }

    power(number) {
        this.result = Math.pow(this.result, number);
        return this;
    }

    getResult() {
        return this.result;
    }
}

// Test cases
try {
    // Test case 1: Addition
    console.log(new Calculator(10).add(5).getResult()); // 15

    // Test case 2: Multiplication and Power
    console.log(new Calculator(2).multiply(5).power(2).getResult()); // 100

    // Test case 3: Multiple operations
    console.log(new Calculator(10).add(5).subtract(3).multiply(2).getResult()); // 24

    // Test case 4: Division by zero (should throw error)
    console.log(new Calculator(20).divide(0).getResult());
} catch (error) {
    console.error(error.message); // "Division by zero is not allowed"
}
