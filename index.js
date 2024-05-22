const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bdParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(bdParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/send", (req, res, next) => {
  try {
    const io = require("./socket");

    io.getIO().emit("sendOTP", req.body);
    return res.status(200).json({ mes: "success" });
  } catch (err) {
    throw err;
  }
});

const server = app.listen(PORT, () => {
  console.log(`Worked on PORT ${PORT}`);
});

const io = require("./socket").init(server);
const otpNamespace = io.of("/otp"); // Initialize the /otp namespace
otpNamespace.on("connection", (socket) => {
  console.log("IO connected to /otp namespace ");

  socket.on("disconnect", () => {
    console.log("disconnected from /otp namespace");
  });
});
