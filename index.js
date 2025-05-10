import express from "express";
import cors from "cors";
import db from "./db.js"; 
import authRoute from "./routes/authRoute.js";
import employeeRoute from "./routes/employeeRoute.js";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoute); 
app.use('/employees', employeeRoute); 

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 App is running on port ${PORT}`));
