class VendingMachine {
    constructor() {
        this.resetService();
    }

    resetService() {
        // stock items and change
        this.items = {
            A: { price: 0.65, count: 5 },
            B: { price: 1.00, count: 5 },
            C: { price: 1.50, count: 5 },
        };
        this.change = { nickel: 10, dime: 10, quarter: 10, dollar: 10 };
        this.inserted = 0;
    }

    // Insert coins
    insert(coin) {
        const values = { NICKEL: 0.05, DIME: 0.10, QUARTER: 0.25, DOLLAR: 1.00 };
        if (values[coin] === undefined) return "INVALID COIN";
        this.inserted += values[coin];
        this.change[coin.toLowerCase()]++;
        return `Inserted $${this.inserted.toFixed(2)}`;
    }

    // Coin return
    coinReturn() {
        const refund = this.makeChange(this.inserted);
        this.inserted = 0;
        return refund;
    }

    // Select item
    selectItem(itemCode) {
        const item = this.items[itemCode];
        if (!item || item.count === 0) return "SOLD OUT";
        if (this.inserted < item.price)
            return `PRICE $${item.price.toFixed(2)} (Inserted $${this.inserted.toFixed(2)})`;

        const changeNeeded = this.inserted - item.price;
        const changeCoins = this.makeChange(changeNeeded);
        if (changeCoins === "INSUFFICIENT CHANGE") return changeCoins;

        this.inserted = 0;
        item.count--;
        return [itemCode, ...changeCoins];
    }

    // Make change using available coins
    makeChange(amount) {
        const coins = [];
        const coinValues = [
            ["quarter", 0.25],
            ["dime", 0.10],
            ["nickel", 0.05],
            ["dollar", 1.00],
        ];

        let remaining = parseFloat(amount.toFixed(2));
        for (let [coin, value] of coinValues) {
            while (remaining >= value - 0.001 && this.change[coin] > 0) {
                remaining = parseFloat((remaining - value).toFixed(2));
                coins.push(coin.toUpperCase());
                this.change[coin]--;
            }
        }
        if (remaining > 0) return "INSUFFICIENT CHANGE";
        return coins;
    }
}

// --------------------------
// ✅ Test Simulation
// --------------------------
const vm = new VendingMachine();

// Example 1: Buy B with exact change Q, Q, Q, Q, GET-B -> B
console.log("\nExample 1:");
vm.insert("QUARTER");
vm.insert("QUARTER");
vm.insert("QUARTER");
vm.insert("QUARTER");
console.log(vm.selectItem("B")); // → [ 'B' ]

// Example 2: Add change then COIN RETURN -> Q, Q
console.log("\nExample 2:");
vm.insert("QUARTER");
vm.insert("QUARTER");
console.log(vm.coinReturn()); // → [ 'QUARTER', 'QUARTER' ]

// Example 3: Buy A with DOLLAR → A, Q, D
console.log("\nExample 3:");
vm.insert("DOLLAR");
console.log(vm.selectItem("A")); // → [ 'A', 'QUARTER', 'DIME' ]
