const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session'); // Add this if using session cookies

const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");

const allowedOrigins = [
    "http://localhost:5173",
     "https://codearena24.tech",
    "https://www.codearena24.tech",
    "https://codearena-two.vercel.app"
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // server-to-server or Postman
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error("CORS policy: Not allowed"), false);
        }
        return callback(null, true);
    },
    credentials: true // allow cookies
}));


app.use(express.json());
app.use(cookieParser());

// Routers
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);

// Server start
const PORT = process.env.PORT || 5000;

const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log("Server listening at port number: " + PORT);
    });
  } catch(err) {
    console.log("Error: " + err);
  }
};

InitalizeConnection();
