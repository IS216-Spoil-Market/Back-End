const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { checkJwt } = require("./service/authService");

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5001;

// Initialize body parse, cors and logger
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (Object.keys(req.body).length !== 0) {
        console.log(req.body);
    }

    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Service is healthy!" });
});

// Protect routes with this checkJwt middleware
app.use(checkJwt);

// Here onwards are all the protected routes
app.use("/profile", require("./controller/profile"));
app.use("/chat", require("./controller/chat"));
app.use("/message", require("./controller/message"));
app.use("/user", require("./controller/user"));


// Needs to be the last app.use => Global error handler
app.use((err, req, res, next) => {
    if (err.status === 401) {
        return res.status(401).json({
            code: 401,
            error: "Not Authorized",
            message: "Unauthorized, please login first!",
        });
    }

    console.error(err.stack);

    res.status(500).json({
        code: 500,
        error: "Internal Server Error",
        message: "An unknown error has occured",
    });
});

app.listen(port, async () => {
    await mongoose.connect(process.env.MONGODB_CONN_URL);
    console.log(`Swaply backend listening on port ${port}`);
});
