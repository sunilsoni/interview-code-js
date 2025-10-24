/**
 * Return the minimum number of buying days, or -1 if impossible.
 * @param {number} N  burgers per box
 * @param {number} K  burgers needed per day
 * @param {number} D  days to survive
 */
function minimumDays(N, K, D) {
    // Total Sundays in the period
    const sundays = Math.floor(D / 7);

    // How many days we can actually buy
    const buyDays = D - sundays;

    // Burgers we will need in total
    const burgersNeeded = D * K;

    // Burgers we can possibly buy
    const burgersPossible = buyDays * N;

    // If even maximum purchasing can’t feed us, give up
    if (burgersPossible < burgersNeeded) return -1;

    // Smallest number of purchase days that cover our needs
    const minDays = Math.ceil(burgersNeeded / N);

    return minDays; // This is guaranteed ≤ buyDays here
}

/* ------------------------------------------------------------------ */
/* Simple test runner – prints PASS / FAIL for each case              */

/* ------------------------------------------------------------------ */
function runTests() {
    const tests = [
        // format: [N, K, D, expected]
        [16, 2, 10, 2],   // sample
        [10, 2, 5, 1],    // less than a week, easy
        [2, 2, 10, -1],   // box too small for weekly gap
        [100, 1, 1000, 143], // large D, plenty of food
        [5, 5, 6, 6],     // must buy every open day
        [5, 5, 7, -1],    // Sunday breaks the plan
    ];

    let allPass = true;
    tests.forEach(([N, K, D, exp], idx) => {
        const got = minimumDays(N, K, D);
        const ok = got === exp;
        allPass &&= ok;
        console.log(
            `Test #${idx + 1}: expected ${exp}, got ${got}  ->  ${ok ? 'PASS' : 'FAIL'}`
        );
    });

    if (allPass) console.log('\n✅  All tests passed.');
    else console.log('\n❌  Some tests failed.');
}

/* ------------------------------------------------------------------ */
/* If this file is run directly (node filename.js), launch tests.     */
/* ------------------------------------------------------------------ */
if (require.main === module) {
    runTests();
}