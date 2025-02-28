// Define the Storage interface.
interface Storage {
    /**
     * Attempts to store the given item.
     * @throws {Error} if it fails to store the item.
     */
    store(item: object): Promise<void>;
}
