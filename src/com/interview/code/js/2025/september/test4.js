// Import the Express library
const express = require("express");

// Create an Express app instance
const app = express();

// Define the port number
const PORT = 3000;

// -----------------------------------------------------
// 🧠 Step 1: Mock data — same as before
// -----------------------------------------------------
const report = {
    reportDate: "2024-06-10",
    application: "MyApp",
    users: [
        {
            userId: "u123",
            country: "USA",
            sessions: [
                {
                    sessionId: "s1",
                    startTime: "2024-06-10T08:15:00Z",
                    endTime: "2024-06-10T08:45:00Z",
                    pagesVisited: [
                        {page: "Home", duration: 120},
                        {page: "Profile", duration: 180}
                    ],
                    events: [
                        {eventType: "login", timestamp: "2024-06-10T08:15:05Z"},
                        {eventType: "purchase", timestamp: "2024-06-10T08:30:00Z", amount: 19.99}
                    ]
                }
            ]
        },
        {
            userId: "u456",
            country: "Canada",
            sessions: [
                {
                    sessionId: "s3",
                    startTime: "2024-06-10T09:00:00Z",
                    endTime: "2024-06-10T09:30:00Z",
                    pagesVisited: [
                        {page: "Home", duration: 100},
                        {page: "Shop", duration: 200}
                    ],
                    events: [
                        {eventType: "login", timestamp: "2024-06-10T09:00:10Z"},
                        {eventType: "logout", timestamp: "2024-06-10T09:30:00Z"}
                    ]
                }
            ]
        }
    ]
};

// -----------------------------------------------------
// 🧩 Step 2: Endpoint 1 → GET /user?userId=<id>
// Returns data for a specific user
// -----------------------------------------------------
app.get("/user", (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({
            error: "MissingParameter",
            message: "Please provide a userId parameter"
        });
    }

    const user = report.users.find(u => u.userId === userId);

    if (!user) {
        return res.status(404).json({
            error: "UserNotFound",
            message: `No data found for userId: ${userId}`
        });
    }

    // Build structured response
    const response = {
        userId: user.userId,
        country: user.country,
        totalSessions: user.sessions.length,
        sessions: user.sessions.map(session => ({
            sessionId: session.sessionId,
            startTime: session.startTime,
            endTime: session.endTime,
            pagesVisited: session.pagesVisited.map(pv => ({
                page: pv.page,
                durationInSeconds: pv.duration
            })),
            events: session.events.map(ev => ({
                eventType: ev.eventType,
                timestamp: ev.timestamp,
                ...(ev.amount && {amount: ev.amount})
            }))
        }))
    };

    res.json(response);
});

// -----------------------------------------------------
// 🧩 Step 3: Endpoint 2 → GET /popular-page
// Returns the most popular page across all users
// -----------------------------------------------------
app.get("/popular-page", (req, res) => {
    // Create a map to store total duration for each page
    const pageDurationMap = {};

    // Iterate over all users and their sessions
    report.users.forEach(user => {
        user.sessions.forEach(session => {
            session.pagesVisited.forEach(pv => {
                // If page already exists, add to duration; otherwise initialize it
                pageDurationMap[pv.page] = (pageDurationMap[pv.page] || 0) + pv.duration;
            });
        });
    });

    // Convert map to array of { page, totalDuration } objects
    const pages = Object.entries(pageDurationMap).map(([page, duration]) => ({
        page,
        totalDuration: duration
    }));

    // Sort pages in descending order of duration
    pages.sort((a, b) => b.totalDuration - a.totalDuration);

    // Pick the top one as the most popular
    const mostPopular = pages[0] || {page: null, totalDuration: 0};

    // Send response as JSON
    res.json({
        reportDate: report.reportDate,
        mostPopularPage: mostPopular,
        allPages: pages
    });
});

// -----------------------------------------------------
// 🚀 Step 4: Start the Express server
// -----------------------------------------------------
app.listen(PORT, () =>
    console.log(`✅ Server running at http://localhost:${PORT}`)
);