// queue.js
const { EventEmitter } = require('events');

class AsyncQueue extends EventEmitter {
    constructor() {
        super();
        this._queue = [];
        this._interval = 250; // default interval in ms
        this._timer = null;

        // Listen for interval change events
        this.on('interval', (newInterval) => {
            if (typeof newInterval === 'number' && newInterval > 0) {
                this._interval = newInterval;
                if (this._timer) {
                    clearInterval(this._timer);
                    this._timer = null;
                    this._startTimer();
                }
            }
        });
    }

    // Validate and add item to queue, emit "enqueued"
    enqueue(item) {
        const t = typeof item;
        const isValid =
            (t === 'number' && !Number.isNaN(item)) ||
            t === 'string' ||
            (t === 'object' && item !== null);

        if (!isValid) {
            throw new Error('Invalid item type');
        }

        this._queue.push(item);
        this.emit('enqueued', item);
    }

    // Return item at head without removing
    peek() {
        return this._queue[0];
    }

    // Return current queue as array
    print() {
        return this._queue.slice();
    }

    // Return current dequeue interval
    getCurrentInterval() {
        return this._interval;
    }

    // Start dequeueing process
    start() {
        if (this._timer) return;
        this._startTimer();
    }

    // Internal: create the interval timer
    _startTimer() {
        if (this._timer) return;

        this._timer = setInterval(() => {
            if (this._queue.length > 0) {
                const item = this._queue.shift();
                this.emit('dequeued', item);
            }
            // If queue is empty, do nothing but keep listening for new items
        }, this._interval);
    }

    // Pause dequeueing (but still allow enqueue)
    pause() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
}

module.exports = AsyncQueue;
