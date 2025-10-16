'use strict';

const express = require('express');
const TaskRunner = require('./taskRunner.js');

const app = express();
app.use(express.json());

const PRIOR_TASKS_NOT_COMPLETED = -1;

app.post('/api/runTasks', async (req, res, next) => {
    try {
        const taskIds = req.body.taskIds;

        // Step 1: Validate all task IDs before starting any task
        for (const id of taskIds) {
            if (!TaskRunner.hasTask(id)) {
                return res.status(400).json({ error: 'Invalid task ID: ' + id });
            }
        }

        // Step 2: Track order of task completions
        const completionList = [];
        const promises = taskIds.map(id =>
            TaskRunner.runTask(id).then(() => {
                completionList.push(id);
            })
        );

        await Promise.all(promises);

        // Step 3: Build a lookup map from taskId -> its position in completion order
        const completionIndexMap = new Map();
        completionList.forEach((id, index) => {
            completionIndexMap.set(id, index);
        });

        // Step 4: Build result array using new logic
        const result = taskIds.map((id, idx) => {
            const myIndex = completionIndexMap.get(id);
            if (myIndex === undefined) return PRIOR_TASKS_NOT_COMPLETED;

            // Check that ALL previous input taskIds finished before this one
            for (let j = 0; j < idx; j++) {
                const prevId = taskIds[j];
                const prevIndex = completionIndexMap.get(prevId);
                if (prevIndex === undefined || prevIndex > myIndex) {
                    return PRIOR_TASKS_NOT_COMPLETED;
                }
            }

            return i;
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

exports.default = app.listen(process.env.HTTP_PORT || 3000);