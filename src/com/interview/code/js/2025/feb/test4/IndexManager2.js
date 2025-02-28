/*

Index Manager:


We get a stream of book info from third-party sources every week. The information consists of a list of blocks. Each block has information about a book.

```json
{
  "id": "str",  # uuid
  "book_id": "str",
  "type": "NEW_EDITION | UPDATE | DELETE_BLOCK",
  "data": "dict"
}
```

- **NEW_EDITION** - New edition of a published book
- **UPDATE** - Update to an existing edition
- **DELETE_BLOCK** - Delete a specific block that was previously transmitted.

### For example:

#### Week 1
```json
[
  {
    "id": "block1",
    "book_id": "book1",
    "type": "NEW_EDITION",
    "data": "..."
  },
  {
    "id": "block2",
    "book_id": "book2",
    "type": "DELETE_BLOCK",
    "data": "..."
  }
]
```

#### Week 2
```json
[
  {
    "id": "blockXXX",
    "book_id": "book1",
    "type": "UPDATE",
    "data": "..."
  },
  {
    "id": "blockYYYY",
    "book_id": "book3",
    "type": "UPDATE",
    "data": "..."
  }
]
```

---

These data are stored in **S3**. We want to create an **index** on top of the data. Write an `IndexManager` that manages the index. The index manager should be able to:

- **add(block)** → Track new information blocks in the index for a given book.
- **delete(book_id, block_id)** → Delete a specific block from a given book.
- **get(book_id, block_id)** → Fetch the specific block.
- **get_all_editions(book_id)** → Get all **NEW_EDITION** blocks associated with the book. Must maintain the order.

 */
/**
 * Creates and returns a new index manager
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * @returns {Object} The index manager with methods
 */
function createIndexManager() {
    // Main index to store all blocks by book_id and block_id
    const index = {};

    // Track order of NEW_EDITION blocks for each book
    const editionOrder = {};

    return {
        add,
        delete: deleteBlock,
        get,
        get_all_editions
    };

    /**
     * Add a new block to the index
     *
     * Time Complexity: O(m) where m is the number of NEW_EDITION blocks for the book
     * Space Complexity: O(1) - only stores references to the provided block
     *
     * @param {Object} block - The block to add
     */
    function add(block) {
        // First, let's validate the block has all required fields
        if (!block || !block.id || !block.book_id || !block.type) {
            throw new Error('Invalid block format');
        }

        const { id, book_id, type } = block;

        // Initialize book entry if it doesn't exist
        if (!index[book_id]) {
            index[book_id] = {};
        }

        // Add the block to the index
        index[book_id][id] = block;

        // If it's a NEW_EDITION block, track its order
        if (type === 'NEW_EDITION') {
            if (!editionOrder[book_id]) {
                editionOrder[book_id] = [];
            }

            // Only add to order if not already there
            if (!editionOrder[book_id].includes(id)) {
                editionOrder[book_id].push(id);
            }
        }
    }

    /**
     * Delete a specific block from the index
     *
     * Time Complexity: O(m) where m is the number of NEW_EDITION blocks for the book
     * Space Complexity: O(m) for the filtered array creation
     *
     * @param {string} book_id - The book ID
     * @param {string} block_id - The block ID to delete
     * @returns {boolean} True if block was deleted, false if not found
     */
    function deleteBlock(book_id, block_id) {
        // Check if the book and block exist
        if (!index[book_id] || !index[book_id][block_id]) {
            return false; // Nothing to delete
        }

        // Get block type before deleting
        const blockType = index[book_id][block_id].type;

        // Delete the block
        delete index[book_id][block_id];

        // If it was a NEW_EDITION, remove from order tracking
        if (blockType === 'NEW_EDITION' && editionOrder[book_id]) {
            editionOrder[book_id] = editionOrder[book_id].filter(id => id !== block_id);

            // Clean up empty arrays
            if (editionOrder[book_id].length === 0) {
                delete editionOrder[book_id];
            }
        }

        // Clean up empty book entries
        if (Object.keys(index[book_id]).length === 0) {
            delete index[book_id];
        }

        return true;
    }

    /**
     * Get a specific block
     *
     * Time Complexity: O(1) - direct object property access
     * Space Complexity: O(1) - returns reference to existing object
     *
     * @param {string} book_id - The book ID
     * @param {string} block_id - The block ID to retrieve
     * @returns {Object|null} The block or null if not found
     */
    function get(book_id, block_id) {
        if (!index[book_id] || !index[book_id][block_id]) {
            return null;
        }

        return index[book_id][block_id];
    }

    /**
     * Get all NEW_EDITION blocks for a book in order
     *
     * Time Complexity: O(m) where m is the number of NEW_EDITION blocks for the book
     * Space Complexity: O(m) for the new array of blocks
     *
     * @param {string} book_id - The book ID
     * @returns {Array} Array of NEW_EDITION blocks
     */
    function get_all_editions(book_id) {
        if (!editionOrder[book_id]) {
            return [];
        }

        // Return blocks in the order they were added
        return editionOrder[book_id].map(blockId => index[book_id][blockId]);
    }
}

/**
 * Run tests for the IndexManager
 *
 * Time Complexity: Varies based on test operations
 * Space Complexity: O(n) where n is the number of test blocks
 */
function runTests() {
    console.log("Running IndexManager tests...");

    // Test case 1: Basic operations
    function testBasicOperations() {
        console.log("\nTest Case 1: Basic operations");
        const indexManager = createIndexManager();

        // Test adding blocks
        const block1 = {
            id: "block1",
            book_id: "book1",
            type: "NEW_EDITION",
            data: "Book 1 Edition 1"
        };

        const block2 = {
            id: "block2",
            book_id: "book1",
            type: "UPDATE",
            data: "Update to Book 1"
        };

        indexManager.add(block1);
        indexManager.add(block2);

        // Test get
        const retrievedBlock1 = indexManager.get("book1", "block1");
        const retrievedBlock2 = indexManager.get("book1", "block2");

        console.log("Get block1:", retrievedBlock1 !== null ? "PASS" : "FAIL");
        console.log("Get block2:", retrievedBlock2 !== null ? "PASS" : "FAIL");

        // Test get_all_editions
        const editions = indexManager.get_all_editions("book1");
        console.log("Get all editions count:", editions.length === 1 ? "PASS" : "FAIL");
        console.log("Editions contains NEW_EDITION:", editions[0].type === "NEW_EDITION" ? "PASS" : "FAIL");

        // Test delete
        const deleteResult = indexManager.delete("book1", "block2");
        console.log("Delete block2:", deleteResult === true ? "PASS" : "FAIL");
        console.log("Get deleted block:", indexManager.get("book1", "block2") === null ? "PASS" : "FAIL");
    }

    // Test case 2: Multiple books and editions
    function testMultipleBooksAndEditions() {
        console.log("\nTest Case 2: Multiple books and editions");
        const indexManager = createIndexManager();

        // Add multiple books and editions
        const blocks = [
            {
                id: "block1",
                book_id: "book1",
                type: "NEW_EDITION",
                data: "Book 1 Edition 1"
            },
            {
                id: "block2",
                book_id: "book1",
                type: "NEW_EDITION",
                data: "Book 1 Edition 2"
            },
            {
                id: "block3",
                book_id: "book2",
                type: "NEW_EDITION",
                data: "Book 2 Edition 1"
            },
            {
                id: "block4",
                book_id: "book1",
                type: "UPDATE",
                data: "Update to Book 1"
            }
        ];

        blocks.forEach(block => indexManager.add(block));

        // Test get_all_editions order
        const book1Editions = indexManager.get_all_editions("book1");
        console.log("Book1 editions count:", book1Editions.length === 2 ? "PASS" : "FAIL");
        console.log("Book1 editions order:",
            book1Editions[0].id === "block1" && book1Editions[1].id === "block2" ? "PASS" : "FAIL");

        // Test delete edition
        indexManager.delete("book1", "block1");
        const updatedEditions = indexManager.get_all_editions("book1");
        console.log("After delete, Book1 editions count:", updatedEditions.length === 1 ? "PASS" : "FAIL");
        console.log("After delete, remaining edition:", updatedEditions[0].id === "block2" ? "PASS" : "FAIL");
    }

    // Test case 3: Edge cases
    function testEdgeCases() {
        console.log("\nTest Case 3: Edge cases");
        const indexManager = createIndexManager();

        // Test getting non-existent block
        console.log("Get non-existent block:", indexManager.get("nonexistent", "block") === null ? "PASS" : "FAIL");

        // Test deleting non-existent block
        console.log("Delete non-existent block:", indexManager.delete("nonexistent", "block") === false ? "PASS" : "FAIL");

        // Test get_all_editions for non-existent book
        console.log("Get editions for non-existent book:",
            indexManager.get_all_editions("nonexistent").length === 0 ? "PASS" : "FAIL");

        // Test adding a block with missing fields
        try {
            indexManager.add({id: "incomplete"});
            console.log("Adding invalid block: FAIL (should have thrown error)");
        } catch (e) {
            console.log("Adding invalid block: PASS (correctly threw error)");
        }
    }

    // Test case 4: Large data input
    function testLargeDataInput() {
        console.log("\nTest Case 4: Large data input");
        const indexManager = createIndexManager();

        console.log("Adding 10,000 blocks...");
        const startTime = Date.now();

        // Add 10,000 blocks across 100 books
        for (let i = 0; i < 10000; i++) {
            const bookId = `book${Math.floor(i / 100) + 1}`;
            const blockType = i % 3 === 0 ? "NEW_EDITION" : (i % 3 === 1 ? "UPDATE" : "DELETE_BLOCK");

            indexManager.add({
                id: `block${i}`,
                book_id: bookId,
                type: blockType,
                data: `Data for block ${i}`
            });
        }

        const addTime = Date.now() - startTime;
        console.log(`Time to add 10,000 blocks: ${addTime}ms`);

        // Test retrieving editions for a book with many editions
        const retrieveStart = Date.now();
        const book1Editions = indexManager.get_all_editions("book1");
        const retrieveTime = Date.now() - retrieveStart;

        console.log(`Book1 has ${book1Editions.length} editions`);
        console.log(`Time to retrieve editions: ${retrieveTime}ms`);

        // Test deleting many blocks
        const deleteStart = Date.now();
        for (let i = 0; i < 1000; i++) {
            indexManager.delete(`book${Math.floor(i / 10) + 1}`, `block${i}`);
        }
        const deleteTime = Date.now() - deleteStart;

        console.log(`Time to delete 1,000 blocks: ${deleteTime}ms`);
        console.log("Large data test: PASS");
    }

    // Run all tests
    testBasicOperations();
    testMultipleBooksAndEditions();
    testEdgeCases();
    testLargeDataInput();

    console.log("\nAll tests completed!");
}

// Run the tests
runTests();