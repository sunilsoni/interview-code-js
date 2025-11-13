// middleware.js
var shortid = require('shortid');

module.exports = function (req, res, next) {
    // build trace object
    req.trace = {
        id: shortid.generate(),
        timestamp: Date.now(),
        path: req.originalUrl || req.baseUrl || req.url
    };

    // set header with request id
    if (res && typeof res.setHeader === 'function') {
        res.setHeader('x-request-id', req.trace.id);
    } else if (res && typeof res.header === 'function') {
        res.header('x-request-id', req.trace.id);
    } else if (res && typeof res.set === 'function') {
        res.set('x-request-id', req.trace.id);
    }

    // pass control to next middleware/handler
    if (typeof next === 'function') {
        next();
    }
};
