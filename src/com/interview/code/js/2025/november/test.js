// Vending Machine in simple JavaScript.
// Money is tracked in cents to avoid floating point problems.

class VendingMachine {
    constructor() {
        // Inserted money in cents
        this.inserted = 0;

        // Item prices in cents
        this.items = {
            A: { price: 65, count: 5 },
            B: { price: 100, count: 5 },
            C: { price: 150, count: 5 }
        };

        // Change storage (how many coins are available)
        this.change = {
            NICKEL: 20,
            DIME: 20,
            QUARTER: 20,
            DOLLAR: 10
        };

        // Coin values
        this.coinValue = {
            NICKEL: 5,
            DIME: 10,
            QUARTER: 25,
            DOLLAR: 100
        };
    }

    // Process a list of actions
    process(actions) {
        const output = [];

        for (const act of actions) {

            // Insert money
            if (this.coinValue[act] !== undefined) {
                this.inserted += this.coinValue[act];
                this.change[act] += 1;
                continue;
            }

            // Return inserted money
            if (act === "COIN-RETURN") {
                output.push(...this.returnChange(this.inserted));
                this.inserted = 0;
                continue;
            }

            // Buy item
            if (act.startsWith("GET-")) {
                const code = act.split("-")[1];
                output.push(...this.buyItem(code));
                continue;
            }

            // Reset machine for service
            if (act === "SERVICE") {
                this.resetMachine();
                continue;
            }
        }

        return output;
    }

    resetMachine() {
        this.items.A.count = 5;
        this.items.B.count = 5;
        this.items.C.count = 5;
        this.inserted = 0;
    }

    buyItem(code) {
        const out = [];
        const item = this.items[code];

        if (!item || item.count === 0) {
            return out; // No item
        }

        if (this.inserted < item.price) {
            return out; // Not enough money
        }

        // Vend item
        out.push(code);
        item.count--;

        // Calculate change
        const changeAmount = this.inserted - item.price;
        const changeCoins = this.returnChange(changeAmount);

        out.push(...changeCoins);

        this.inserted = 0;
        return out;
    }

    // Greedy algorithm for change return
    returnChange(amount) {
        const coins = [];

        const order = [
            ["QUARTER", 25],
            ["DIME", 10],
            ["NICKEL", 5]
        ];

        for (const [name, value] of order) {
            while (amount >= value && this.change[name] > 0) {
                coins.push(name);
                this.change[name]--;
                amount -= value;
            }
        }

        return coins;
    }
}


// ---------------------------------------------------
// TESTING FRAMEWORK (simple PASS/FAIL)
// ---------------------------------------------------

function runTests() {
    let passed = 0;

    // Test helper
    function test(name, actions, expected) {
        const vm = new VendingMachine();
        const result = vm.process(actions);

        const ok = JSON.stringify(result) === JSON.stringify(expected);
        console.log(name, ok ? "PASS" : "FAIL", "->", result);

        if (ok) passed++;
    }

    // Provided examples
    test("Example 1 - Buy B exact change",
        ["QUARTER","QUARTER","QUARTER","QUARTER","GET-B"],
        ["B"]
    );

    test("Example 2 - Coin Return",
        ["QUARTER","QUARTER","COIN-RETURN"],
        ["QUARTER","QUARTER"]
    );

    test("Example 3 - Buy A with change",
        ["DOLLAR","GET-A"],
        ["A","QUARTER","DIME"]
    );

    // Additional large data test
    const longActions = [];
    for (let i = 0; i < 20000; i++) longActions.push("NICKEL");
    longActions.push("COIN-RETURN");
    test("Large Data - 20k inserts",
        longActions,
        Array(20000).fill("NICKEL")
    );

    console.log("\nTotal Passed:", passed);
}

runTests();
