function solve(capacity, ar) {
    class Node {
        constructor(key, val) {
            this.key = key;
            this.val = val;
            this.prev = null;
            this.next = null;
        }
    }

    class LRUCache {
        constructor(cap) {
            this.capacity = cap;
            this.map = new Map();
            this.head = new Node(0, 0);
            this.tail = new Node(0, 0);
            this.head.next = this.tail;
            this.tail.prev = this.head;
        }

        _add(node) {
            node.next = this.head.next;
            node.prev = this.head;
            this.head.next.prev = node;
            this.head.next = node;
        }

        _remove(node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        get(key) {
            if (!this.map.has(key)) return -1;
            const node = this.map.get(key);
            this._remove(node);
            this._add(node);
            return node.val;
        }

        put(key, value) {
            if (this.map.has(key)) {
                const node = this.map.get(key);
                node.val = value;
                this._remove(node);
                this._add(node);
                if (this.map.size === this.capacity) {
                    let lru = this.tail.prev;
                    if (lru.key !== key) {
                        this._remove(lru);
                        this.map.delete(lru.key);
                    }
                }
            } else {
                if (this.map.size === this.capacity) {
                    const lru = this.tail.prev;
                    this._remove(lru);
                    this.map.delete(lru.key);
                }
                const node = new Node(key, value);
                this._add(node);
                this.map.set(key, node);
            }
        }
    }

    const cache = new LRUCache(capacity);
    const result = [];
    for (let cmd of ar) {
        const parts = cmd.split(",");
        if (parts[0] === "PUT") {
            cache.put(parseInt(parts[1]), parseInt(parts[2]));
        } else if (parts[0] === "GET") {
            result.push(cache.get(parseInt(parts[1])));
        }
    }
    return result;
}

function main() {
    const testCases = [
        {
            capacity: 3,
            commands: ["PUT,11,25", "PUT,22,50", "PUT,11,75", "GET,11", "GET,22"],
            expected: [75, 50]
        },
        {
            capacity: 2,
            commands: ["PUT,1,100", "PUT,2,125", "PUT,2,150", "GET,1", "GET,2"],
            expected: [-1, 150]
        }
    ];

    testCases.forEach((tc, i) => {
        const output = solve(tc.capacity, tc.commands);
        const pass = JSON.stringify(output) === JSON.stringify(tc.expected);
        console.log(`Test Case #${i + 1}: ${pass ? "PASS" : "FAIL"}`);
    });
}

main();
