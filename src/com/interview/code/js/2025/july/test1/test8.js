/**
 * Finds shared courses between pairs of students
 * @param {Array} enrollments - List of [studentId, courseName] pairs
 * @returns {Object} Dictionary of student pairs and their shared courses
 */
function find_pairs(enrollments) {
    // Create an object to store each student's courses as a Set
    const studentCourses = {};

    // Populate studentCourses object
    // Example: {"58": Set("Linear Algebra", "Mechanics", "Economics")}
    for (const [sid, course] of enrollments) {
        if (!studentCourses[sid]) studentCourses[sid] = new Set();
        studentCourses[sid].add(course);
    }

    // Get all student IDs and sort them numerically
    // This ensures consistent pair ordering (id1 < id2)
    const ids = Object.keys(studentCourses).sort((a,b)=>Number(a)-Number(b));

    // Store final results
    const result = {};

    // Compare each student with every other student (only once)
    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const a = ids[i], b = ids[j];
            const shared = [];

            // Find courses that both students share
            for (const c of studentCourses[a]) {
                if (studentCourses[b].has(c)) shared.push(c);
            }

            // Store result with smaller ID first
            result[`${a},${b}`] = shared;
        }
    }
    return result;
}

// Test helper function to compare results regardless of pair order
function deepEqualUnorderedPairs(actual, expected) {
    const seen = new Set();

    // Check each actual pair against expected
    for (const key of Object.keys(actual)) {
        const [x,y] = key.split(",");
        const rev = `${y},${x}`;
        const valA = actual[key];
        let valB = null, matchKey = null;

        // Look for matching pair in either order
        if (expected.hasOwnProperty(key)) {
            valB = expected[key];
            matchKey = key;
        } else if (expected.hasOwnProperty(rev)) {
            valB = expected[rev];
            matchKey = rev;
        } else {
            return false;
        }

        // Compare course lists
        if (valA.length !== valB.length) return false;
        for (let i = 0; i < valA.length; i++) {
            if (valA[i] !== valB[i]) return false;
        }
        seen.add(matchKey);
    }

    // Ensure no extra pairs in expected
    for (const key of Object.keys(expected)) {
        const [x,y] = key.split(",");
        const rev = `${y},${x}`;
        if (!seen.has(key) && !seen.has(rev)) {
            return false;
        }
    }
    return true;
}

// Add performance test
function performanceTest() {
    console.log("\nPerformance Test:");

    // Generate large dataset
    const largeEnrollments = [];
    for (let i = 0; i < 1000; i++) {
        largeEnrollments.push([
            Math.floor(Math.random() * 100).toString(),
            `Course${Math.floor(Math.random() * 20)}`
        ]);
    }

    console.time('Processing Time');
    const result = find_pairs(largeEnrollments);
    console.timeEnd('Processing Time');

    console.log(`Total pairs processed: ${Object.keys(result).length}`);
}

// Run all tests
runTests();
performanceTest();
