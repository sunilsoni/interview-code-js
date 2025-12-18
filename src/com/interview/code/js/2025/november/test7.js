/**
 * Finds an object by its 'id' property in a deeply nested structure
 * Returns the COMPLETE object with all its nested children
 *
 * @param {Object|Array} data - The nested data structure to search
 * @param {string} targetId - The id value to find
 * @returns {Object|null} - The complete matching object or null if not found
 */
function findById(data, targetId) {
    // Handle null, undefined, or primitive values
    if (data === null || data === undefined) {
        return null;
    }

    // If not an object or array, return null
    if (typeof data !== 'object') {
        return null;
    }

    // Check if current object has matching id
    // Return the ENTIRE object (with all nested children)
    if (data.id === targetId) {
        return data;
    }

    // If array, search each element
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            const result = findById(data[i], targetId);
            if (result !== null) {
                return result;
            }
        }
    } else {
        // If object, search each property value
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            const result = findById(data[keys[i]], targetId);
            if (result !== null) {
                return result;
            }
        }
    }

    return null;
}


// Sample Data
const sampleData = {
    "id": "root",
    "group": {
        "id": "g1",
        "users": [
            { "id": "u1", "name": "Alice" },
            { "id": "u2", "name": "Bob" },
            {
                "id": "u3",
                "name": "Charlie",
                "children": [
                    { "id": "u4", "name": "Diana" },
                    {
                        "id": "u5",
                        "name": "Eve",
                        "extra": {
                            "id": "e1",
                            "owner": { "id": "u6", "name": "Frank" }
                        }
                    }
                ]
            }
        ]
    },
    "logs": [
        {
            "id": "log-1",
            "meta": {
                "user": { "id": "u7", "name": "Grace" }
            }
        }
    ]
};

// Expected Results (Complete Objects)
const expectedResults = {
    "u3": {
        "id": "u3",
        "name": "Charlie",
        "children": [
            { "id": "u4", "name": "Diana" },
            {
                "id": "u5",
                "name": "Eve",
                "extra": {
                    "id": "e1",
                    "owner": { "id": "u6", "name": "Frank" }
                }
            }
        ]
    },
    "u5": {
        "id": "u5",
        "name": "Eve",
        "extra": {
            "id": "e1",
            "owner": { "id": "u6", "name": "Frank" }
        }
    },
    "e1": {
        "id": "e1",
        "owner": { "id": "u6", "name": "Frank" }
    },
    "g1": {
        "id": "g1",
        "users": [
            { "id": "u1", "name": "Alice" },
            { "id": "u2", "name": "Bob" },
            {
                "id": "u3",
                "name": "Charlie",
                "children": [
                    { "id": "u4", "name": "Diana" },
                    {
                        "id": "u5",
                        "name": "Eve",
                        "extra": {
                            "id": "e1",
                            "owner": { "id": "u6", "name": "Frank" }
                        }
                    }
                ]
            }
        ]
    },
    "log-1": {
        "id": "log-1",
        "meta": {
            "user": { "id": "u7", "name": "Grace" }
        }
    }
};

/**
 * Deep compare two objects
 */
function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Test runner
 */
function runTest(testName, actual, expected) {
    const passed = deepEqual(actual, expected);

    console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${testName}`);

    if (!passed) {
        console.log('   Expected:');
        console.log('   ' + JSON.stringify(expected, null, 2).split('\n').join('\n   '));
        console.log('   Actual:');
        console.log('   ' + JSON.stringify(actual, null, 2).split('\n').join('\n   '));
    }

    return passed;
}

/**
 * Main test runner
 */
function runAllTests() {
    console.log('='.repeat(60));
    console.log('           findById TEST SUITE');
    console.log('='.repeat(60) + '\n');

    let passCount = 0;
    let totalTests = 0;

    // ========== TEST: Complete Object Returns ==========
    console.log('--- Complete Object Return Tests ---\n');

    // Test 1: Find u3 (returns complete object with children)
    totalTests++;
    if (runTest(
        'Find "u3" - returns Charlie with all children',
        findById(sampleData, 'u3'),
        expectedResults["u3"]
    )) passCount++;

    // Test 2: Find u5 (returns complete object with extra)
    totalTests++;
    if (runTest(
        'Find "u5" - returns Eve with extra object',
        findById(sampleData, 'u5'),
        expectedResults["u5"]
    )) passCount++;

    // Test 3: Find e1 (returns complete object with owner)
    totalTests++;
    if (runTest(
        'Find "e1" - returns extra with owner',
        findById(sampleData, 'e1'),
        expectedResults["e1"]
    )) passCount++;

    // Test 4: Find g1 (returns complete group with all users)
    totalTests++;
    if (runTest(
        'Find "g1" - returns group with all users',
        findById(sampleData, 'g1'),
        expectedResults["g1"]
    )) passCount++;

    // Test 5: Find log-1 (returns complete log with meta)
    totalTests++;
    if (runTest(
        'Find "log-1" - returns log with meta',
        findById(sampleData, 'log-1'),
        expectedResults["log-1"]
    )) passCount++;

    // ========== TEST: Simple Object Returns ==========
    console.log('\n--- Simple Object Return Tests ---\n');

    // Test 6: Find u1
    totalTests++;
    if (runTest(
        'Find "u1" - returns Alice',
        findById(sampleData, 'u1'),
        { "id": "u1", "name": "Alice" }
    )) passCount++;

    // Test 7: Find u4
    totalTests++;
    if (runTest(
        'Find "u4" - returns Diana',
        findById(sampleData, 'u4'),
        { "id": "u4", "name": "Diana" }
    )) passCount++;

    // Test 8: Find u6
    totalTests++;
    if (runTest(
        'Find "u6" - returns Frank',
        findById(sampleData, 'u6'),
        { "id": "u6", "name": "Frank" }
    )) passCount++;

    // Test 9: Find u7
    totalTests++;
    if (runTest(
        'Find "u7" - returns Grace',
        findById(sampleData, 'u7'),
        { "id": "u7", "name": "Grace" }
    )) passCount++;

    // ========== TEST: Edge Cases ==========
    console.log('\n--- Edge Case Tests ---\n');

    // Test 10: Not found
    totalTests++;
    if (runTest(
        'Find "xyz" - returns null (not found)',
        findById(sampleData, 'xyz'),
        null
    )) passCount++;

    // Test 11: Null input
    totalTests++;
    if (runTest(
        'Null input - returns null',
        findById(null, 'u1'),
        null
    )) passCount++;

    // Test 12: Undefined input
    totalTests++;
    if (runTest(
        'Undefined input - returns null',
        findById(undefined, 'u1'),
        null
    )) passCount++;

    // Test 13: Empty object
    totalTests++;
    if (runTest(
        'Empty object - returns null',
        findById({}, 'u1'),
        null
    )) passCount++;

    // Test 14: Array input
    totalTests++;
    const arrayInput = [{ id: 'a1', items: [{ id: 'a2' }] }];
    if (runTest(
        'Array input - finds nested object',
        findById(arrayInput, 'a2'),
        { id: 'a2' }
    )) passCount++;

    // Test 15: Root level id
    totalTests++;
    if (runTest(
        'Find "root" - returns entire data structure',
        findById(sampleData, 'root')?.id,
        'root'
    )) passCount++;

    // ========== TEST: Large Data ==========
    console.log('\n--- Large Data Test ---\n');
    totalTests++;
    if (testLargeData()) passCount++;

    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(60));
    console.log('                    SUMMARY');
    console.log('='.repeat(60));
    console.log(`  Total Tests:  ${totalTests}`);
    console.log(`  Passed:       ${passCount}`);
    console.log(`  Failed:       ${totalTests - passCount}`);
    console.log('='.repeat(60));

    if (passCount === totalTests) {
        console.log('  ✅ ALL TESTS PASSED!');
    } else {
        console.log('  ❌ SOME TESTS FAILED!');
    }
    console.log('='.repeat(60));
}

/**
 * Test with large nested data
 */
function testLargeData() {
    const startTime = Date.now();

    // Build large structure
    const largeData = buildLargeStructure(500, 6);

    // Add target deep inside
    const targetId = 'deep-target-12345';
    const targetObject = {
        id: targetId,
        name: 'Deep Target',
        metadata: {
            created: '2024-01-01',
            tags: ['important', 'nested']
        }
    };

    insertDeepObject(largeData, targetObject, 8);

    // Search for it
    const result = findById(largeData, targetId);

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    const passed = deepEqual(result, targetObject);

    console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: Large data search (${timeTaken}ms)`);
    console.log(`   Structure: 500 nodes per level, 6 levels deep`);
    console.log(`   Target found at depth 8`);

    if (!passed) {
        console.log('   Expected:', JSON.stringify(targetObject));
        console.log('   Actual:', JSON.stringify(result));
    }

    return passed;
}

/**
 * Build large nested structure
 */
function buildLargeStructure(width, depth) {
    if (depth === 0) {
        return {
            id: 'leaf-' + Math.random().toString(36).substring(2, 8),
            value: Math.random()
        };
    }

    const node = {
        id: 'node-' + Math.random().toString(36).substring(2, 8),
        level: depth,
        children: []
    };

    const childCount = Math.floor(width / depth);
    for (let i = 0; i < childCount; i++) {
        node.children.push(buildLargeStructure(width, depth - 1));
    }

    return node;
}

/**
 * Insert object deep in structure
 */
function insertDeepObject(data, targetObj, levels) {
    let current = data;

    for (let i = 0; i < levels; i++) {
        if (current.children && current.children.length > 0) {
            current = current.children[0];
        } else {
            current.children = [];
            current.children.push({ id: 'path-' + i });
            current = current.children[0];
        }
    }

    current.nested = targetObj;
}

// Run tests
runAllTests();