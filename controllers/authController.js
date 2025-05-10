import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export const signUpUser = async (req, res) => {
    const { name, email, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server Error' });

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: 'Failed to register user' });

            res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
    });
};

// Login User
export const loginUser = (req, res) => {
    const { email, password } = req.body;

    console.log(email,'-------------user login email')

    const loginQuery = 'SELECT * FROM users WHERE email = ?';

    db.query(loginQuery, [email], async (err, results) => {
        if (err){
            console.log(err.message,'-----------error login')
            return res.status(500).json({ message: 'Server Error' }); 
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            {
                email: user.email,
                id: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Optional: generate token
        // const token = jwt.sign({ id: user.id }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', user, token });
    });
};
