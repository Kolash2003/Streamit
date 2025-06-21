import dotenv from 'dotenv';
dotenv.config(); // Load env variables before anything else
import cookieParser from "cookie-parser";
import cors from 'cors';
import express from 'express';
import { connectDB } from './src/lib/db.js';
import authRoutes from './src/routes/auth.route.js'; // Assuming you have this
import userRoutes from './src/routes/user.route.js';
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // allow forontend to send cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
    console.log('server up and running');
    connectDB();
});
