// Enhanced version with improvements
function getFamilyContracts(contractList, rootContractId) {
    // Input validation
    if (!contractList || !Array.isArray(contractList)) {
        return [];
    }

    if (rootContractId === null || rootContractId === undefined) {
        return [];
    }

    const contractMap = new Map();

    // Build parent-child relationship map
    for (const contract of contractList) {
        // Handle missing or null parent IDs
        const parentId = contract.ParentContractID;

        if (parentId !== null && parentId !== undefined) {
            if (!contractMap.has(parentId)) {
                contractMap.set(parentId, []);
            }
            contractMap.get(parentId).push(contract);
        }
    }

    const result = [];
    const visited = new Set();

    // Iterative DFS to handle large datasets without stack overflow
    function dfsIterative(startId) {
        const stack = [startId];

        while (stack.length > 0) {
            const currentId = stack.pop();
            const children = contractMap.get(currentId) || [];

            // Process children in reverse order to maintain DFS order
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (!visited.has(child.ContractID)) {
                    visited.add(child.ContractID);
                    result.push(child);
                    stack.push(child.ContractID);
                }
            }
        }
    }

    // Use iterative approach for better performance with large data
    dfsIterative(rootContractId);
    return result;
}

// Test harness with comprehensive test cases
function runTests() {
    console.log("Starting Test Suite for getFamilyContracts\n");
    console.log("=" .repeat(50));

    let totalTests = 0;
    let passedTests = 0;

    // Test Case 1: Simple hierarchy
    function testSimpleHierarchy() {
        totalTests++;
        const contracts = [
            { ContractID: 1, ParentContractID: null, Name: "Root" },
            { ContractID: 2, ParentContractID: 1, Name: "Child1" },
            { ContractID: 3, ParentContractID: 1, Name: "Child2" },
            { ContractID: 4, ParentContractID: 2, Name: "Grandchild1" }
        ];

        const result = getFamilyContracts(contracts, 1);
        const expectedIds = [2, 4, 3];
        const actualIds = result.map(c => c.ContractID);

        if (JSON.stringify(actualIds) === JSON.stringify(expectedIds)) {
            console.log("✓ Test 1: Simple hierarchy - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 1: Simple hierarchy - FAIL");
            console.log("  Expected:", expectedIds);
            console.log("  Actual:", actualIds);
        }
    }

    // Test Case 2: Empty contract list
    function testEmptyList() {
        totalTests++;
        const result = getFamilyContracts([], 1);

        if (result.length === 0) {
            console.log("✓ Test 2: Empty contract list - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 2: Empty contract list - FAIL");
        }
    }

    // Test Case 3: Non-existent root ID
    function testNonExistentRoot() {
        totalTests++;
        const contracts = [
            { ContractID: 1, ParentContractID: null },
            { ContractID: 2, ParentContractID: 1 }
        ];

        const result = getFamilyContracts(contracts, 999);

        if (result.length === 0) {
            console.log("✓ Test 3: Non-existent root ID - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 3: Non-existent root ID - FAIL");
        }
    }

    // Test Case 4: Circular reference handling
    function testCircularReference() {
        totalTests++;
        const contracts = [
            { ContractID: 1, ParentContractID: 3 },
            { ContractID: 2, ParentContractID: 1 },
            { ContractID: 3, ParentContractID: 2 }
        ];

        const result = getFamilyContracts(contracts, 1);
        const uniqueIds = new Set(result.map(c => c.ContractID));

        if (uniqueIds.size === result.length && result.length === 2) {
            console.log("✓ Test 4: Circular reference handling - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 4: Circular reference handling - FAIL");
        }
    }

    // Test Case 5: Large dataset performance test
    function testLargeDataset() {
        totalTests++;
        const largeContracts = [];
        const levels = 100;
        const childrenPerNode = 10;
        let contractId = 1;

        // Create a large tree structure
        for (let level = 0; level < levels; level++) {
            const nodesInLevel = Math.pow(childrenPerNode, level);
            for (let node = 0; node < Math.min(nodesInLevel, 10000); node++) {
                const parentId = level === 0 ? null :
                    Math.floor((contractId - 2) / childrenPerNode) + 1;

                largeContracts.push({
                    ContractID: contractId,
                    ParentContractID: parentId,
                    Name: `Contract_${contractId}`
                });
                contractId++;

                if (contractId > 50000) break;
            }
            if (contractId > 50000) break;
        }

        const startTime = Date.now();
        const result = getFamilyContracts(largeContracts, 1);
        const endTime = Date.now();
        const executionTime = endTime - startTime;

        if (result.length > 0 && executionTime < 5000) {
            console.log(`✓ Test 5: Large dataset (${largeContracts.length} contracts) - PASS`);
            console.log(`  Execution time: ${executionTime}ms`);
            console.log(`  Results found: ${result.length} contracts`);
            passedTests++;
        } else {
            console.log("✗ Test 5: Large dataset - FAIL");
            console.log(`  Execution time: ${executionTime}ms`);
        }
    }

    // Test Case 6: Multiple root nodes
    function testMultipleRoots() {
        totalTests++;
        const contracts = [
            { ContractID: 1, ParentContractID: null },
            { ContractID: 2, ParentContractID: 1 },
            { ContractID: 3, ParentContractID: null },
            { ContractID: 4, ParentContractID: 3 },
            { ContractID: 5, ParentContractID: 2 }
        ];

        const result = getFamilyContracts(contracts, 1);
        const expectedIds = [2, 5];
        const actualIds = result.map(c => c.ContractID);

        if (JSON.stringify(actualIds) === JSON.stringify(expectedIds)) {
            console.log("✓ Test 6: Multiple root nodes - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 6: Multiple root nodes - FAIL");
        }
    }

    // Test Case 7: Deep nesting
    function testDeepNesting() {
        totalTests++;
        const deepContracts = [];
        const depth = 1000;

        for (let i = 1; i <= depth; i++) {
            deepContracts.push({
                ContractID: i,
                ParentContractID: i === 1 ? null : i - 1,
                Name: `Level_${i}`
            });
        }

        const result = getFamilyContracts(deepContracts, 1);

        if (result.length === depth - 1) {
            console.log("✓ Test 7: Deep nesting (1000 levels) - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 7: Deep nesting - FAIL");
            console.log(`  Expected ${depth - 1} descendants, got ${result.length}`);
        }
    }

    // Test Case 8: Invalid input handling
    function testInvalidInputs() {
        totalTests++;
        let allPassed = true;

        // Null contract list
        if (getFamilyContracts(null, 1).length !== 0) allPassed = false;

        // Undefined root ID
        if (getFamilyContracts([], undefined).length !== 0) allPassed = false;

        // String instead of array
        if (getFamilyContracts("invalid", 1).length !== 0) allPassed = false;

        if (allPassed) {
            console.log("✓ Test 8: Invalid input handling - PASS");
            passedTests++;
        } else {
            console.log("✗ Test 8: Invalid input handling - FAIL");
        }
    }

    // Execute all tests
    testSimpleHierarchy();
    testEmptyList();
    testNonExistentRoot();
    testCircularReference();
    testMultipleRoots();
    testDeepNesting();
    testInvalidInputs();
    testLargeDataset();

    // Summary
    console.log("\n" + "=" .repeat(50));
    console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
        console.log("✓ ALL TESTS PASSED!");
    } else {
        console.log(`✗ ${totalTests - passedTests} tests failed`);
    }

    return passedTests === totalTests;
}

// Performance benchmark function
function benchmarkPerformance() {
    console.log("\n" + "=" .repeat(50));
    console.log("Performance Benchmark Results\n");

    const sizes = [100, 1000, 5000, 10000];

    for (const size of sizes) {
        const contracts = [];
        for (let i = 1; i <= size; i++) {
            contracts.push({
                ContractID: i,
                ParentContractID: i === 1 ? null : Math.floor(Math.random() * (i - 1)) + 1,
                Name: `Contract_${i}`
            });
        }

        const startTime = Date.now();
        const result = getFamilyContracts(contracts, 1);
        const endTime = Date.now();

        console.log(`Dataset size: ${size} contracts`);
        console.log(`  Execution time: ${endTime - startTime}ms`);
        console.log(`  Descendants found: ${result.length}`);
    }
}

// Run the test suite
runTests();
benchmarkPerformance();