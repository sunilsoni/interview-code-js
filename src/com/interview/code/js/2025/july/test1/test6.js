// logger.test.js

const express = require('express');
const request = require('supertest');
const requestLogger = require('./logger');

describe('requestLogger middleware', () => {
    let app, logs = [];

    beforeAll(() => {
        // Monkey-patch console.log to capture output
        console._origLog = console.log;
        console.log = msg => logs.push(msg);

        app = express();
        app.use(requestLogger);
        app.get('/test', (req, res) => res.sendStatus(204));
    });

    afterAll(() => {
        console.log = console._origLog;
    });

    beforeEach(() => { logs.length = 0; });

    it('logs method and URL and does not alter response', async () => {
        const response = await request(app).get('/test?foo=bar');
        expect(response.status).toBe(204);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toBe('GET /test?foo=bar');
    });
});