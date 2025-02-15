/*

## **Problem Description**

All the competitors in a **stock car race** have completed their qualifying laps.
Each lap, the driver with the **slowest** "best" time is **eliminated**.
- The **slowest driver** is the one with the **highest** personal best time.
- If **multiple drivers** tie for the slowest time, they **all** are eliminated.

You are given a **two-dimensional string array** with each driver's name and **lap time (in seconds)** for each lap.
Your task is to return the drivers **in the order they were eliminated**, ending with the **last remaining driver**.
- If **multiple drivers are eliminated** on the same lap, their names should be listed **alphabetically**.

---

### **Task Constraints**
- You are **not required** to provide the most optimal solution.
- A solution with time complexity **not worse than** `O(laps.length * laps[0].length)` will fit within the execution time limit.

---

## **Example Cases**

### **Example 1**
#### **Input:**
```plaintext
laps = [
  ["Harold 154", "Gina 155", "Juan 160"],
  ["Juan 152", "Gina 153", "Harold 160"],
  ["Harold 148", "Gina 150", "Juan 151"]
]
```
#### **Output:**
```plaintext
["Juan", "Harold", "Gina"]
```

#### **Explanation:**
1. **After the first lap:**
   - Harold's best time: **154**
   - Gina's best time: **155**
   - Juan's best time: **160**
   **→ Juan is eliminated**.

2. **After the second lap:**
   - Harold's best time: **154**
   - Gina's best time: **153**
   **→ Harold is eliminated**.

3. **Only Gina remains on the third lap.**

---

### **Example 2**
#### **Input:**
```plaintext
laps = [
  ["Gina 155", "Eddie 160", "Joy 161", "Harold 163"],
  ["Harold 151", "Gina 153", "Joy 160", "Eddie 160"],
  ["Harold 149", "Joy 150", "Gina 152", "Eddie 154"],
  ["Harold 148", "Gina 150", "Eddie 151", "Joy 155"]
]
```
#### **Output:**
```plaintext
["Harold", "Eddie", "Joy", "Gina"]
```

#### **Explanation:**
1. **After the first lap:**
   - Gina's best time: **155**
   - Eddie's best time: **160**
   - Joy's best time: **161**
   - Harold's best time: **163**
   **→ Harold is eliminated**.

2. **After the second lap:**
   - Gina's best time: **153**
   - Eddie's best time: **160**
   - Joy's best time: **160**
   **→ Eddie and Joy are eliminated (sorted alphabetically: "Eddie", "Joy")**.

3. **Only Gina remains for the third and fourth laps.**

---

## **Input/Output Format**

### **Input Constraints**
- **Execution Time Limit:** 4 seconds (JavaScript)
- **Memory Limit:** 1 GB

#### **Input:**
1. **array.array.string `laps`**
   - An **array of string arrays** containing each driver's **name** and **lap time**.
   - The **same drivers appear in every lap**.
   - Each `laps[i]` is given in format:
     ```plaintext
     "str(NAME) int(TIME)"
     ```
   - **Guaranteed constraints:**
     - `laps.length = laps[i].length`
     - `1 ≤ laps[i].length ≤ 100`
     - `1 ≤ TIME ≤ 10⁴`

#### **Output:**
- **array.string**
  - The list of drivers **sorted in the order they were eliminated**.
  - If **multiple drivers** are eliminated in the same lap, they should be **sorted alphabetically**.

---

 */

function solution(laps) {
    // Object to hold the best times for each driver.
    const bestTimes = {};
    // Set to track active drivers.
    const activeDrivers = new Set();

    // Parse the first lap to initialize drivers.
    if (laps.length > 0) {
        for (let entry of laps[0]) {
            const [name, timeStr] = entry.split(" ");
            const time = parseInt(timeStr, 10);
            bestTimes[name] = time; // initial best time for each driver
            activeDrivers.add(name);
        }
    }

    // Array to record the elimination order.
    const eliminationOrder = [];

    // Function to update best times for active drivers for a given lap.
    function updateLap(lapEntries) {
        for (let entry of lapEntries) {
            const [name, timeStr] = entry.split(" ");
            // Only update if driver is still active.
            if (activeDrivers.has(name)) {
                const time = parseInt(timeStr, 10);
                bestTimes[name] = Math.min(bestTimes[name], time);
            }
        }
    }

    // Process each lap.
    for (let i = 0; i < laps.length; i++) {
        // If there is only one driver, race is over.
        if (activeDrivers.size === 1) break;

        // Update best times for the lap.
        updateLap(laps[i]);

        // Determine the maximum (i.e. worst) best time among active drivers.
        let worstTime = -1;
        for (let driver of activeDrivers) {
            if (bestTimes[driver] > worstTime) {
                worstTime = bestTimes[driver];
            }
        }

        // Gather all drivers whose best time equals the worstTime.
        let eliminatedThisLap = [];
        for (let driver of activeDrivers) {
            if (bestTimes[driver] === worstTime) {
                eliminatedThisLap.push(driver);
            }
        }

        // If more than one driver is eliminated in the lap, sort them alphabetically.
        eliminatedThisLap.sort();

        // Remove eliminated drivers from active set and add them to elimination order.
        for (let driver of eliminatedThisLap) {
            activeDrivers.delete(driver);
            eliminationOrder.push(driver);
        }
    }

    // If one driver remains, add that driver as the winner.
    if (activeDrivers.size === 1) {
        eliminationOrder.push([...activeDrivers][0]);
    }

    return eliminationOrder;
}

// --------------------
// Simple Main Test Method
// --------------------
function main() {
    let testCases = [];

    // Example Test Case 1
    testCases.push({
        name: "Example 1",
        input: [
            ["Harold 154", "Gina 155", "Juan 160"],
            ["Juan 152", "Gina 153", "Harold 160"],
            ["Harold 148", "Gina 150", "Juan 151"]
        ],
        expected: ["Juan", "Harold", "Gina"]
    });

    // Example Test Case 2
    testCases.push({
        name: "Example 2",
        input: [
            ["Gina 155", "Eddie 160", "Joy 161", "Harold 163"],
            ["Harold 151", "Gina 153", "Joy 160", "Eddie 160"],
            ["Harold 149", "Joy 150", "Gina 152", "Eddie 154"],
            ["Harold 148", "Gina 150", "Eddie 151", "Joy 155"]
        ],
        expected: ["Harold", "Eddie", "Joy", "Gina"]
    });

    // Edge Case: Only one driver.
    testCases.push({
        name: "Edge: Single Driver",
        input: [
            ["Solo 100"],
            ["Solo 99"],
            ["Solo 98"]
        ],
        expected: ["Solo"]
    });

    // Additional test case: Multiple drivers eliminated in same lap.
    testCases.push({
        name: "Multiple Eliminations in Same Lap",
        input: [
            ["Alice 120", "Bob 130", "Charlie 130", "David 110"],
            ["Alice 115", "Bob 125", "Charlie 125", "David 105"],
            ["Alice 110", "Bob 120", "Charlie 120", "David 100"]
        ],
        // Explanation:
        // After lap 1: best times: Alice:120, Bob:130, Charlie:130, David:110.
        //    => Worst time is 130, so Bob and Charlie eliminated (alphabetically: Bob, Charlie).
        // After lap 2: Only Alice and David remain.
        //    => best times become: Alice:115, David:105. Worst is 115, so Alice is eliminated.
        // Remaining driver: David.
        expected: ["Bob", "Charlie", "Alice", "David"]
    });

    // Large Input Test Case
    // Generate 50 drivers and 50 laps with random times.
    const driverCount = 50;
    const lapCount = 50;
    let largeInput = [];
    let driverNames = [];
    for (let i = 0; i < driverCount; i++) {
        driverNames.push("Driver" + i);
    }

    // For reproducibility, use a simple pseudo-random generator.
    function getRandomTime() {
        return Math.floor(Math.random() * 10000) + 1;
    }

    for (let lap = 0; lap < lapCount; lap++) {
        let lapEntries = [];
        for (let i = 0; i < driverCount; i++) {
            lapEntries.push(driverNames[i] + " " + getRandomTime());
        }
        largeInput.push(lapEntries);
    }

    testCases.push({
        name: "Large Input",
        input: largeInput,
        // We don't have an expected value since elimination order is random.
        // Instead, we will verify that the output length equals the number of drivers.
        expectedLength: driverCount
    });

    // Run tests.
    for (let testCase of testCases) {
        let result = solution(testCase.input);
        let pass = false;

        if (testCase.hasOwnProperty("expected")) {
            pass = JSON.stringify(result) === JSON.stringify(testCase.expected);
        } else if (testCase.hasOwnProperty("expectedLength")) {
            pass = result.length === testCase.expectedLength;
        }

        console.log("Test:", testCase.name);
        console.log("Input:", JSON.stringify(testCase.input));
        console.log("Expected:", testCase.expected || ("Output length: " + testCase.expectedLength));
        console.log("Result:", result);
        console.log(pass ? "PASS" : "FAIL");
        console.log("----------------------------");
    }
}

// Run main to test the solution.
main();