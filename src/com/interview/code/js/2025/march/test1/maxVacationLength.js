/*
```
You're given a calendar year represented as a char array that contains either H or W where:

H = Holiday
W = Workday

Given a number of Personal Time-Off days (PTO), maximize the length of the longest vacation you can take.

Example: [W, H, H, W, W, H, W], PTO/holiday/vacation = 2

[H, H, H, H, W, H, W] -- 4 days

[W, H, H, H, H, H, W] -- 5 days

--> Your maximum vacation is 5 days.
```

 */

/**
 * Finds the maximum vacation length possible with given PTO days
 * @param {string[]} calendar - Array of 'W' (workday) and 'H' (holiday)
 * @param {number} pto - Number of PTO days available
 * @return {number} - Maximum possible consecutive vacation days
 */
function maxVacationLength(calendar, pto) {
    // If calendar is empty, no vacation is possible
    if (!calendar || calendar.length === 0) {
        return 0;
    }

    let maxVacation = 0;     // Track the maximum vacation length found
    let currentVacation = 0; // Track current vacation length in the sliding window
    let ptoUsed = 0;         // Track PTO days used in the current window
    let left = 0;            // Left pointer for sliding window

    // Iterate through the calendar with right pointer
    for (let right = 0; right < calendar.length; right++) {
        // If current day is a holiday, extend vacation without using PTO
        if (calendar[right] === 'H') {
            currentVacation++;
        }
        // If current day is a workday, use PTO if available
        else {
            // Use a PTO day if we have any left
            if (ptoUsed < pto) {
                ptoUsed++;
                currentVacation++;
            }
            // If no PTO left, shrink window from left until we free up a PTO
            else {
                // Shrink window until we can accommodate the new workday
                while (ptoUsed >= pto && left <= right) {
                    if (calendar[left] === 'W') {
                        ptoUsed--;
                    }
                    currentVacation--;
                    left++;
                }

                // Now we can use PTO for the current workday
                ptoUsed++;
                currentVacation++;
            }
        }

        // Update the maximum vacation length
        maxVacation = Math.max(maxVacation, currentVacation);
    }

    return maxVacation;
}

/**
 * Test function to verify our solution
 */
function runTests() {
    // Test cases
    const tests = [
        {
            calendar: ['W', 'H', 'H', 'W', 'W', 'H', 'W'],
            pto: 2,
            expected: 5,
            description: "Example from problem statement"
        },
        {
            calendar: ['W', 'W', 'W', 'W', 'W'],
            pto: 2,
            expected: 2,
            description: "All workdays"
        },
        {
            calendar: ['H', 'H', 'H', 'H', 'H'],
            pto: 3,
            expected: 5,
            description: "All holidays"
        },
        {
            calendar: [],
            pto: 5,
            expected: 0,
            description: "Empty calendar"
        },
        {
            calendar: ['W', 'H', 'W', 'H', 'W', 'H', 'W'],
            pto: 0,
            expected: 1,
            description: "No PTO days"
        },
        {
            calendar: ['W', 'W', 'H', 'W', 'H', 'H', 'W', 'W', 'W', 'H', 'H'],
            pto: 3,
            expected: 7,
            description: "Complex pattern"
        }
    ];

    // Large test case
    const largeCalendar = [];
    for (let i = 0; i < 100000; i++) {
        largeCalendar.push(i % 3 === 0 ? 'H' : 'W');
    }
    tests.push({
        calendar: largeCalendar,
        pto: 10000,
        expected: 15000, // Every third day is a holiday, so with 10000 PTO we can cover 15000 days
        description: "Large input test"
    });

    // Run all tests
    let passCount = 0;
    for (const test of tests) {
        const result = maxVacationLength(test.calendar, test.pto);
        const passed = result === test.expected;

        console.log(`Test: ${test.description}`);
        console.log(`  Expected: ${test.expected}, Got: ${result}`);
        console.log(`  Status: ${passed ? 'PASS' : 'FAIL'}`);

        if (passed) {
            passCount++;
        }
    }

    console.log(`\nPassed ${passCount} out of ${tests.length} tests`);
}

// Run the tests
runTests();