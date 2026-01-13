const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const OTP_EXPIRY = 5 * 60 * 1000;
const BLOCK_TIME = 10 * 60 * 1000;

const users = {};
const sessions = {};

app.post("/auth/request-otp", (req, res) => {
    const { identifier } = req.body;
    const now = Date.now();

    if (!users[identifier]) users[identifier] = {};

    if (users[identifier].blockedUntil > now) {
        return res.status(403).json({ error: "Blocked for 10 minutes" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    users[identifier] = {
        otp,
        expiresAt: now + OTP_EXPIRY,
        attempts: 0,
        blockedUntil: null
    };

    console.log(`OTP for ${identifier}: ${otp}`);
    res.json({ message: "OTP sent" });
});

app.post("/auth/verify-otp", (req, res) => {
    const { identifier, otp } = req.body;
    const user = users[identifier];
    const now = Date.now();

    if (!user || user.expiresAt < now) return res.status(400).json({ error: "OTP expired" });

    if (user.otp !== otp) {
        user.attempts++;
        if (user.attempts >= 3) {
            user.blockedUntil = now + BLOCK_TIME;
            return res.status(403).json({ error: "Blocked for 10 minutes" });
        }
        return res.status(400).json({ error: "Invalid OTP" });
    }

    const token = uuid();
    sessions[token] = { identifier };
    res.json({ token });
});

app.get("/auth/me", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!sessions[token]) return res.status(401).json({ error: "Invalid token" });
    res.json({ identifier: sessions[token].identifier });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
