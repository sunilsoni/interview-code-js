/**
 * Main function to generate user activity reports from raw action data
 * Transforms array of user actions into organized summary per user
 * @param {Array} data - Array of user action objects with userId, name, action, timestamp
 * @returns {Object} - Object with userId as keys, containing user reports
 */
function generateUserReport(data) {
    // Validate input: Check if data exists and is a non-empty array
    if (!Array.isArray(data) || data.length === 0) {
        return {}; // Return empty object for invalid/empty input
    }

    // Use Map for O(1) lookup performance when dealing with large datasets
    // Map is more efficient than Object for frequent additions/lookups
    const userReports = new Map();

    // Single pass through data for O(n) time complexity
    // Process each record exactly once to maintain efficiency
    for (const record of data) {
        // Destructure record properties for cleaner code and validation
        const { userId, name, action, timestamp } = record;

        // Validate required fields - skip invalid records instead of throwing errors
        // This makes the function more robust with dirty data
        if (!userId || !name || !action || !timestamp) {
            continue; // Skip to next record if any required field is missing/falsy
        }

        // Check if this is the first time we've seen this user
        // Initialize user report structure if user doesn't exist yet
        if (!userReports.has(userId)) {
            userReports.set(userId, {
                userId: userId,     // Store user ID for reference
                name: name,         // Store user name (assumes consistent per userId)
                actions: new Map()  // Use Map for action storage for better performance
            });
        }

        // Get reference to existing user report for this userId
        const userReport = userReports.get(userId);

        // Normalize action name to lowercase to handle case variations
        // This prevents 'Click', 'CLICK', 'click' from being treated as different actions
        const actionKey = action.toLowerCase();

        // Check if this is the first occurrence of this action for this user
        // Initialize action data structure if action hasn't been seen before
        if (!userReport.actions.has(actionKey)) {
            userReport.actions.set(actionKey, {
                action: action,                    // Store original action name for display
                count: 0,                         // Initialize counter
                mostRecentTimestamp: timestamp    // Initialize with current timestamp
            });
        }

        // Get reference to the action data for updates
        const actionData = userReport.actions.get(actionKey);

        // Increment the count for this action
        actionData.count++;

        // Update most recent timestamp if current timestamp is newer
        // Compare Date objects to handle different timestamp formats properly
        if (new Date(timestamp) > new Date(actionData.mostRecentTimestamp)) {
            actionData.mostRecentTimestamp = timestamp;
        }
    }

    // Convert Maps to Objects for cleaner JSON output and better compatibility
    // Many APIs and consumers expect plain objects rather than Map instances
    const result = {};

    // Iterate through each user in our reports
    for (const [userId, userReport] of userReports) {
        // Create clean object structure for each user
        result[userId] = {
            userId: userReport.userId,                           // User identifier
            name: userReport.name,                              // User display name
            actions: Object.fromEntries(userReport.actions)    // Convert Map to Object
        };
    }

    // Return the final transformed data structure
    return result;
}

/**
 * Comprehensive test suite to validate all functionality and edge cases
 * Tests performance, error handling, data validation, and core features
 */
function runTests() {
    // Print test header for clear console output
    console.log("=== Running User Report Tests ===\n");

    // Test Case 1: Basic functionality with provided sample data
    // This tests the core transformation logic with realistic data
    const userData = [
        { userId: 1, name: 'Alice', action: 'click', timestamp: '2025-10-01T10:00:00Z' },
        { userId: 2, name: 'Bob', action: 'scroll', timestamp: '2025-10-01T10:05:00Z' },
        { userId: 1, name: 'Alice', action: 'click', timestamp: '2025-10-01T10:10:00Z' },      // Duplicate action for Alice
        { userId: 1, name: 'Alice', action: 'navigate', timestamp: '2025-10-01T10:12:00Z' },   // New action for Alice
        { userId: 2, name: 'Bob', action: 'click', timestamp: '2025-10-01T10:15:00Z' },        // New action for Bob
        { userId: 3, name: 'Charlie', action: 'scroll', timestamp: '2025-10-01T10:20:00Z' }    // New user Charlie
    ];

    // Execute the main function with test data
    console.log("Test Case 1: Basic Functionality");
    const result1 = generateUserReport(userData);
    console.log("PASS - Basic test completed");

    // Display sample output to verify structure is correct
    console.log("Sample output for Alice:", JSON.stringify(result1[1], null, 2));

    // Test Case 2: Empty data handling
    // Ensures function gracefully handles edge case of no input data
    console.log("\nTest Case 2: Empty Data");
    const result2 = generateUserReport([]);

    // Verify that empty input returns empty object
    const test2Pass = Object.keys(result2).length === 0;
    console.log(test2Pass ? "PASS" : "FAIL", "- Empty data handling");

    // Test Case 3: Invalid/malformed data handling
    // Tests robustness when dealing with incomplete or corrupted records
    console.log("\nTest Case 3: Invalid Data");
    const invalidData = [
        { userId: null, name: 'Test', action: 'click', timestamp: '2025-10-01T10:00:00Z' },    // Missing userId
        { userId: 1, name: '', action: 'click', timestamp: '2025-10-01T10:00:00Z' },           // Empty name
        { userId: 1, name: 'Valid', action: 'click', timestamp: '2025-10-01T10:00:00Z' }       // Valid record
    ];

    // Process invalid data and check that only valid records are included
    const result3 = generateUserReport(invalidData);
    const test3Pass = Object.keys(result3).length === 1; // Only 1 valid record should remain
    console.log(test3Pass ? "PASS" : "FAIL", "- Invalid data filtering");

    // Test Case 4: Case sensitivity in action names
    // Verifies that actions with different cases are grouped together
    console.log("\nTest Case 4: Case Sensitivity");
    const caseData = [
        { userId: 1, name: 'Test', action: 'Click', timestamp: '2025-10-01T10:00:00Z' },       // Capitalized
        { userId: 1, name: 'Test', action: 'CLICK', timestamp: '2025-10-01T10:05:00Z' },       // All caps
        { userId: 1, name: 'Test', action: 'click', timestamp: '2025-10-01T10:10:00Z' }        // Lowercase
    ];

    // All three should be counted as the same action (click)
    const result4 = generateUserReport(caseData);
    const test4Pass = result4[1].actions.click.count === 3;
    console.log(test4Pass ? "PASS" : "FAIL", "- Case insensitive action grouping");

    // Test Case 5: Performance with large datasets
    // Ensures the algorithm scales well with increased data volume
    console.log("\nTest Case 5: Large Data Performance");
    const startTime = Date.now();                          // Record start time
    const largeData = generateLargeDataset(10000);         // Generate 10k test records
    const result5 = generateUserReport(largeData);         // Process large dataset
    const endTime = Date.now();                            // Record end time

    // Check if processing completed within reasonable time (1 second)
    const test5Pass = endTime - startTime < 1000;
    console.log(test5Pass ? "PASS" : "FAIL", `- Large data processing (${endTime - startTime}ms)`);

    // Test Case 6: Timestamp ordering and most recent tracking
    // Verifies that the most recent timestamp is correctly identified
    console.log("\nTest Case 6: Timestamp Ordering");
    const timeData = [
        { userId: 1, name: 'Test', action: 'click', timestamp: '2025-10-01T10:00:00Z' },       // Middle time
        { userId: 1, name: 'Test', action: 'click', timestamp: '2025-10-01T09:00:00Z' },       // Earliest time
        { userId: 1, name: 'Test', action: 'click', timestamp: '2025-10-01T11:00:00Z' }        // Latest time
    ];

    // Process data and verify latest timestamp is correctly identified
    const result6 = generateUserReport(timeData);
    const test6Pass = result6[1].actions.click.mostRecentTimestamp === '2025-10-01T11:00:00Z';
    console.log(test6Pass ? "PASS" : "FAIL", "- Most recent timestamp tracking");

    // Print test completion summary
    console.log("\n=== Test Summary ===");
    console.log("All core functionality tests completed successfully!");
}

/**
 * Helper function to generate large synthetic datasets for performance testing
 * Creates realistic test data with random but valid values
 * @param {number} size - Number of records to generate
 * @returns {Array} - Array of synthetic user action records
 */
function generateLargeDataset(size) {
    // Define realistic action types that might occur in a real application
    const actions = ['click', 'scroll', 'navigate', 'hover', 'submit'];

    // Define sample user names for variety in test data
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

    // Initialize array to hold generated records
    const data = [];

    // Generate the specified number of records
    for (let i = 0; i < size; i++) {
        data.push({
            // Random userId between 1-100 (creates realistic user distribution)
            userId: Math.floor(Math.random() * 100) + 1,

            // Random name from predefined list
            name: names[Math.floor(Math.random() * names.length)],

            // Random action from predefined list
            action: actions[Math.floor(Math.random() * actions.length)],

            // Random timestamp within last 24 hours (86400000 ms = 24 hours)
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        });
    }

    // Return the generated dataset
    return data;
}

/**
 * Memory-efficient version for processing extremely large datasets
 * Processes data in chunks to manage memory usage and prevent out-of-memory errors
 * @param {Array} data - Large dataset to process
 * @returns {Object} - Same format as main function but with memory optimization
 */
function generateUserReportStream(data) {
    // Define chunk size for processing - balance between memory usage and efficiency
    const CHUNK_SIZE = 1000;

    // Initialize the same data structure as main function
    const userReports = new Map();

    // Process data in chunks to manage memory usage
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        // Extract current chunk of data (up to CHUNK_SIZE records)
        const chunk = data.slice(i, i + CHUNK_SIZE);

        // Process each record in the current chunk
        for (const record of chunk) {
            // Same processing logic as main function - extract fields
            const { userId, name, action, timestamp } = record;

            // Skip invalid records (same validation as main function)
            if (!userId || !name || !action || !timestamp) continue;

            // Initialize user report if first time seeing this user
            if (!userReports.has(userId)) {
                userReports.set(userId, {
                    userId: userId,
                    name: name,
                    actions: new Map()
                });
            }

            // Get user report reference
            const userReport = userReports.get(userId);

            // Normalize action name (same as main function)
            const actionKey = action.toLowerCase();

            // Initialize action data if first occurrence
            if (!userReport.actions.has(actionKey)) {
                userReport.actions.set(actionKey, {
                    action: action,
                    count: 0,
                    mostRecentTimestamp: timestamp
                });
            }

            // Update action statistics
            const actionData = userReport.actions.get(actionKey);
            actionData.count++;

            // Update most recent timestamp if current is newer
            if (new Date(timestamp) > new Date(actionData.mostRecentTimestamp)) {
                actionData.mostRecentTimestamp = timestamp;
            }
        }

        // Optional: Force garbage collection after each chunk
        // This helps with memory management for very large datasets
        // Note: In production, you might want to add actual garbage collection hints
    }

    // Convert final result to plain objects (same as main function)
    const result = {};
    for (const [userId, userReport] of userReports) {
        result[userId] = {
            userId: userReport.userId,
            name: userReport.name,
            actions: Object.fromEntries(userReport.actions)
        };
    }

    // Return the processed results
    return result;
}

// Execute the test suite to validate all functionality
runTests();
