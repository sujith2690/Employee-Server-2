import express from "express";
import cors from "cors";
import db from "./db.js"; // 👈 Import the connection
import authRoute from "./routes/authRoute.js";
import employeeRoute from "./routes/employeeRoute.js";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', authRoute); 
app.use('/employees', employeeRoute); 

// app.get('/', (req, res) => {
//     res.json("Hello this is Backend");
// });

// app.get('/books', (req, res) => {
//     const q = "SELECT * FROM books";
//     db.query(q, (err, data) => {
//         if (err) return res.status(500).json({ error: err.message });
//         return res.json(data);  
//     });
// });

// app.post('/books', (req, res) => {
//     const q = 'INSERT INTO books (`title`,`desc`,`cover`) VALUES (?)';
//     const VALUES = [req.body.title, req.body.desc, req.body.cover];

//     db.query(q, [VALUES], (err, data) => {
//         if (err) return res.status(500).json({ error: err.message });
//         return res.json("📚 Book has been created");
//     });
// });

app.listen(8800, () => console.log('🚀 App is running on port 8800'));
