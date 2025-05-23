// Define the Processor interface.
interface Processor {
    new(storage: Storage): Processor;

    /**
     * Processes an item and then stores it.
     * Must process items in the order they are received.
     */
    process(item: object): Promise<object>;
}