import db from '../db.js';


export const getEmployeeById = async (id) => {
    const q = 'SELECT * FROM employees WHERE id = ?';

    return new Promise((resolve, reject) => {
        db.query(q, [id], (err, result) => {
            if (err) {
                console.error('❌ Error fetching employee details:', err.message);
                return reject(new Error('Server Error: ' + err.message));
            }
            if (result.length === 0) {
                return reject(new Error('Employee not found'));
            }
            console.log(result[0], '*---------------- result[0]');
            resolve(result[0]); // ✅ This is what `await` will wait for
        });
    });
};
