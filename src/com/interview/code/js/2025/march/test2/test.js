class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    // Add a value to the end of the linked list
    add(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    // Print all values in the linked list
    print() {
        let current = this.head;
        const values = [];
        while (current) {
            values.push(current.value);
            current = current.next;
        }
        console.log(values.join(" -> "));
    }

    // Delete the first node with the specified value
    delete(value) {
        if (!this.head) {
            return;
        }

        // If the head node is the one to be deleted
        if (this.head.value === value) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next) {
            if (current.next.value === value) {
                // Skip over the node to be deleted
                current.next = current.next.next;
                return;
            }
            current = current.next;
        }
    }
}

// Example usage
const list = new LinkedList();
list.add(10);
list.add(20);
list.add(30);
console.log("Original list:");
list.print();

list.delete(20);
console.log("After deleting 20:");
list.print();