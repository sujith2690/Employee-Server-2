import db from '../db.js';

export const getUserById = async (id) => {
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const results = await new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) {
                    reject('Server Error');
                }
                resolve(results);
            });
        });

        if (results.length === 0) {
            throw new Error('user not found', Error.message);
        }
        return results[0]; // Return the first employee data if found
    } catch (error) {
        console.error('Error occurred:', error.message);
        throw new Error(error.message || 'An unknown error occurred');
    }

};