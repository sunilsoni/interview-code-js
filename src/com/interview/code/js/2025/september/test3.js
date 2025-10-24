const express = require("express");
const app = express();
const PORT = 3000;

// Sample JSON data
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

// GET /user?userId=u123
app.get("/user", (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send("Please provide a userId parameter");

    const user = report.users.find(u => u.userId === userId);
    if (!user) return res.status(404).send("User not found");

    let responseMsg = `User ${user.userId} from ${user.country} has ${user.sessions.length} session(s):\n`;

    user.sessions.forEach(session => {
        responseMsg += `\nSession ${session.sessionId} (Start: ${session.startTime}, End: ${session.endTime}):\n`;
        session.pagesVisited.forEach(pv => {
            responseMsg += `  - Visited ${pv.page} for ${pv.duration} seconds\n`;
        });
    });

    res.type("text/plain").send(responseMsg);
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));