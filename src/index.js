import express, { urlencoded, json } from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import passport from "passport";
import session from "express-session"
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import './config/passportConfig.js'


dotenv.config();
dbConnect();

const app = express();

// middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://thunderous-truffle-ccef1f.netlify.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(json({limit : "100mb"}));
app.use(urlencoded({limit : "100mb" , extended: true}));
app.use(session({
    secret: process.env.SECRET_SESSION || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3000 * 60
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/todo", todoRoutes)
app.get('/',(req, res)=>{
    res.send("server is running")
})

// listen app
const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})