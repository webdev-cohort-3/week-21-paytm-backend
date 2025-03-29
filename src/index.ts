import express from "express";

const app = express();

app.get("/home", (req, res) => {
    res.json("hello");
});

app.listen(3000);