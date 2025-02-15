function solution(laps) {
    let result = [];
    let drivers = new Map();

    // Initialize drivers with their first lap times
    laps[0].forEach(lap => {
        let [name, time] = lap.split(' ');
        drivers.set(name, Number(time));
    });

    // Process each lap
    for (let lap of laps) {
        // Update best times
        lap.forEach(record => {
            let [name, time] = record.split(' ');
            time = Number(time);
            if (drivers.has(name)) {
                drivers.set(name, Math.min(drivers.get(name), time));
            }
        });

        // Find slowest time
        let slowestTime = Math.min(...Array.from(drivers.values()));

        // Get drivers with slowest time
        let eliminated = Array.from(drivers.entries())
            .filter(([_, time]) => time === slowestTime)
            .map(([name, _]) => name)
            .sort();  // Sort alphabetically

        // Add eliminated drivers to result
        result.push(...eliminated);

        // Remove eliminated drivers
        eliminated.forEach(name => drivers.delete(name));

        // If only one driver remains, add them and break
        if (drivers.size === 1) {
            result.push(Array.from(drivers.keys())[0]);
            break;
        }
    }

    return result;
}

// Test function
function runTests() {
    const tests = [
        {
            name: "Example 1",
            input: [
                ["Harold 154", "Gina 155", "Juan 160"],
                ["Juan 152", "Gina 153", "Harold 160"],
                ["Harold 148", "Gina 150", "Juan 151"]
            ],
            expected: ["Juan", "Harold", "Gina"]
        },
        {
            name: "Example 2",
            input: [
                ["Gina 155", "Eddie 160", "Joy 161", "Harold 163"],
                ["Harold 151", "Gina 153", "Joy 160", "Eddie 160"],
                ["Harold 149", "Joy 150", "Gina 152", "Eddie 154"],
                ["Harold 148", "Gina 150", "Eddie 151", "Joy 155"]
            ],
            expected: ["Harold", "Eddie", "Joy", "Gina"]
        },
        {
            name: "Single Lap Test",
            input: [["Alice 100", "Bob 101", "Charlie 102"]],
            expected: ["Charlie", "Bob", "Alice"]
        },
        {
            name: "Tie Elimination Test",
            input: [
                ["A 100", "B 100", "C 99"],
                ["A 98", "B 98", "C 97"]
            ],
            expected: ["A", "B", "C"]
        }
    ];

    let allPassed = true;
    tests.forEach((test, index) => {
        const result = solution(test.input);
        const passed = JSON.stringify(result) === JSON.stringify(test.expected);

        console.log(`Test ${index + 1} (${test.name}): ${passed ? 'PASS' : 'FAIL'}`);
        if (!passed) {
            console.log('  Expected:', test.expected);
            console.log('  Got:', result);
            allPassed = false;
        }
    });

    console.log(`\nOverall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
}

// Run tests
console.log("Running tests...");
runTests();
