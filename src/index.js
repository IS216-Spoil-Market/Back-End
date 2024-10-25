const express = require("express");

const app = express();
const port = 5001;

app.use("/profile", require("./controller/profile"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

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

app.listen(port, () => {
    console.log(`Swaply backend listening on port ${port}`);
});
