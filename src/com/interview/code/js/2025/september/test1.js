const express = require('express');
const TaskRunner = require('./taskRunner');

const app = express();
app.use(express.json());

const PRIOR_TASKS_NOT_COMPLETED = -1;

app.post('/api/runTasks', async (req, res) => {
    try {
        const taskIds = req.body.taskIds;
        const totalTasks = taskIds.length;

        // Step 1: Validate all tasks
        for (const id of taskIds) {
            if (!TaskRunner.hasTask(id)) {
                return res.status(400).json({error: `Invalid Task: ${id}`});
            }
        }

        // Step 2: Launch all tasks in parallel
        let completionOrder = []; // will contain { index: original index, resolveTime: counter }
        let taskCompletionPromises = [];
        let globalCounter = 0;

        for (let i = 0; i < totalTasks; i++) {
            const id = taskIds[i];
            const promise = TaskRunner.runTask(id).then(() => {
                completionOrder.push({index: i, completedAt: globalCounter++});
            });
            taskCompletionPromises.push(promise);
        }

        // Step 3: Wait for all tasks to complete
        await Promise.all(taskCompletionPromises);

        // Step 4: Sort the order by completedAt
        completionOrder.sort((a, b) => a.completedAt - b.completedAt);

        // Step 5: Build map for completion position
        let finishedPosition = new Map(); // key: task index, value: position in completion
        for (let i = 0; i < completionOrder.length; i++) {
            finishedPosition.set(completionOrder[i].index, i);
        }

        // Step 6: Final output array
        let result = [];

        for (let i = 0; i < totalTasks; i++) {
            let completedBefore = 0;
            let isInvalid = false;

            for (let j = 0; j < i; j++) {
                if (finishedPosition.get(j) < finishedPosition.get(i)) {
                    completedBefore++;
                } else {
                    isInvalid = true;
                    break;
                }
            }

            result.push(isInvalid ? PRIOR_TASKS_NOT_COMPLETED : completedBefore);
        }

        res.status(200).json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Start server
const PORT = process.env.HTTP_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


async function main() {
    const mock = {
        hasTask: (id) => !id.includes('invalid'),
        runTask: (id) => new Promise((resolve) => {
            const delay = Math.floor(Math.random() * 50);
            setTimeout(() => resolve(), delay);
        })
    };

    global.TaskRunner = mock;

    const testCases = [
        {
            name: "Example 1",
            taskIds: ["A", "B", "C", "D"],
            execOrder: [0, 2, 1, 3],
            expected: [0, 1, -1, 3]
        },
        {
            name: "Example 2",
            taskIds: ["A", "B", "C", "D"],
            execOrder: [0, 1, 2, 3],
            expected: [0, 1, 2, 3]
        },
        {
            name: "Example 3",
            taskIds: ["A", "B", "C", "D"],
            execOrder: [3, 2, 1, 0],
            expected: [0, -1, -1, -1]
        },
        {
            name: "Invalid task ID",
            taskIds: ["A", "B", "invalidID", "D"],
            expected: "400"
        },
        {
            name: "Large dataset",
            taskIds: Array.from({length: 200}, (_, i) => `id${i}`),
            expectedLength: 200
        }
    ];

    for (const tc of testCases) {
        try {
            if (tc.expected === "400") {
                const result = tc.taskIds.every(TaskRunner.hasTask);
                console.log(`${tc.name}: ${!result ? "PASS" : "FAIL"}`);
            } else {
                const res = await runMockTest(tc.taskIds);
                const pass = tc.expectedLength
                    ? res.length === tc.expectedLength
                    : JSON.stringify(res) === JSON.stringify(tc.expected);
                console.log(`${tc.name}: ${pass ? "PASS" : "FAIL"}`);
            }
        } catch (err) {
            console.error(`${tc.name}: ERROR`, err);
        }
    }
}

async function runMockTest(taskIds) {
    let completionOrder = [];
    let taskCompletionPromises = [];
    let globalCounter = 0;

    for (let i = 0; i < taskIds.length; i++) {
        const id = taskIds[i];
        const promise = TaskRunner.runTask(id).then(() => {
            completionOrder.push({index: i, completedAt: globalCounter++});
        });
        taskCompletionPromises.push(promise);
    }

    await Promise.all(taskCompletionPromises);

    completionOrder.sort((a, b) => a.completedAt - b.completedAt);
    let finishedPosition = new Map();
    for (let i = 0; i < completionOrder.length; i++) {
        finishedPosition.set(completionOrder[i].index, i);
    }

    let result = [];
    for (let i = 0; i < taskIds.length; i++) {
        let completedBefore = 0;
        let isInvalid = false;
        for (let j = 0; j < i; j++) {
            if (finishedPosition.get(j) < finishedPosition.get(i)) {
                completedBefore++;
            } else {
                isInvalid = true;
                break;
            }
        }
        result.push(isInvalid ? -1 : completedBefore);
    }

    return result;
}

main();