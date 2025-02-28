

// ProcessorImpl implements Processor.
// It ensures that each item is processed sequentially and
// the store method is retried until it succeeds.
class ProcessorImpl implements Processor {
    private storage: Storage;
    // A promise chain to guarantee sequential processing.
    private queue: Promise<void> = Promise.resolve();

    constructor(storage: Storage) {
        this.storage = storage;
    }

    process(item: object): Promise<object> {
        const resultPromise = new Promise<object>((resolve, reject) => {
            // Chain the processing to the previous operations.
            this.queue = this.queue
                .then(async () => {
                    try {
                        // Process the item (can be extended with additional logic).
                        const processedItem = this.processItem(item);

                        // Retry storing the item until it succeeds.
                        await this.retryStore(processedItem);

                        resolve(processedItem);
                    } catch (err) {
                        reject(err);
                    }
                })
                .catch((err) => {
                    // In case the chain fails.
                    reject(err);
                });
        });
        return resultPromise;
    }

    // Synchronous processing step.
    private processItem(item: object): object {
        // In this example, processing simply returns the same item.
        // Add any transformation or business logic as needed.
        return item;
    }

    // Retry storing the item indefinitely until success.
    private async retryStore(item: object): Promise<void> {
        while (true) {
            try {
                await this.storage.store(item);
                break; // Exit loop if store is successful.
            } catch (error) {
                console.error("Error storing item, retrying in 1 second...", error);
                await this.delay(1000); // Wait 1 second before retrying.
            }
        }
    }

    // Helper function to delay execution.
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// DummyStorage simulates a Storage implementation.
// It is configured to fail a number of times before storing successfully.
class DummyStorage implements Storage {
    private failCount: number;

    constructor(failCount: number) {
        this.failCount = failCount;
    }

    async store(item: object): Promise<void> {
        if (this.failCount > 0) {
            console.log(`DummyStorage: Simulating failure, ${this.failCount} failures remaining.`);
            this.failCount--;
            throw new Error("Simulated storage failure");
        }
        console.log("DummyStorage: Successfully stored item:", item);
    }
}

// Main function to demonstrate processing items.
async function main() {
    // Create a DummyStorage instance that will fail 2 times before succeeding for each item.
    const storage = new DummyStorage(2);
    const processor = new ProcessorImpl(storage);

    // An array of items to process.
    const items = [
        { id: 1, data: "Item 1" },
        { id: 2, data: "Item 2" },
        { id: 3, data: "Item 3" }
    ];

    // Process each item sequentially.
    for (const item of items) {
        try {
            const result = await processor.process(item);
            console.log("Processed and stored item:", result);
        } catch (err) {
            console.error("Failed to process item:", err);
        }
    }
}

// Run the main function.
main().catch(console.error);