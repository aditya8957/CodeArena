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

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://codearena-two.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // server-to-server or Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// Optional: Session setup if you use session cookies
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'none', // important for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

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
