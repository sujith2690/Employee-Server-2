import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'No token Unauthorized' });
        }
        const decoded = jwt.verify(token, secret);
        req.userId = decoded?.id;
        console.log(decoded?.id,'---------------decoded?.id;')
        next();
    } catch (error) {
        console.error(error.message, '-----------middleware error');
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


export default authMiddleware;
