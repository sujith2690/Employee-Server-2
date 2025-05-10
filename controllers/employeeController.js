import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from '../utils/userFun.js';
import { getEmployeeById } from '../utils/employeeFun.js';


export const getAllEmployees = async (req, res) => {
    try {
        const q = 'SELECT * FROM employees';

        db.query(q, (err, data) => {
            if (err) {
                console.error('❌ Error fetching employees:', err.message);
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ details: data });
        });
    } catch (error) {
        console.error('❌ Unexpected error get All employee---:', error.message);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};
export const addNewEmployee = async (req, res) => {
    try {
        const { name, email, phoneNumber, address, position, joiningDate, createdBy, salary } = req.body;

        if (!name || !email || !phoneNumber || !joiningDate || !createdBy || !salary) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }


        const id = uuidv4();
        const updatedBy = JSON.stringify([]);

        const query = `
            INSERT INTO employees 
            (id, name, email, phoneNumber, address, position, joiningDate, createdBy, salary, updatedBy) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        const values = [id, name, email, phoneNumber, address, position, joiningDate, createdBy, salary, updatedBy];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('❌ Error adding employee:', err.message);
                return res.status(500).json({ error: 'Failed to add employee', details: err.message });
            }

            return res.status(201).json({
                message: 'Employee added successfully',
                employeeId: id,
            });
        });

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const updateEmployDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const {
            name,
            email,
            phoneNumber,
            joiningDate,
            position,
            salary,
            address,
        } = req.body;

        // Validate required fields
        if (!name || !email || !phoneNumber || !joiningDate || !position || !salary || !address) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        // Get updater's name from user table
        const userData = await getUserById(userId);
        const updaterName = userData.name;

        // Confirm employee exists
        const employeeData = await getEmployeeById(id);
        if (!employeeData) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Safely parse the existing updatedBy field
        let updatedByList;
        try {
            updatedByList = JSON.parse(employeeData.updatedBy);
            if (!Array.isArray(updatedByList)) updatedByList = [];
        } catch {
            updatedByList = [];
        }

        // Push current updater
        updatedByList.push(updaterName);

        // Convert back to string for DB
        const updatedByStr = JSON.stringify(updatedByList);

        // Update query
        const q = `
            UPDATE employees 
            SET 
                name = ?, 
                email = ?, 
                phoneNumber = ?, 
                joiningDate = ?, 
                position = ?, 
                salary = ?, 
                address = ?, 
                updatedBy = ?
            WHERE id = ?
        `;

        await new Promise((resolve, reject) => {
            db.query(
                q,
                [name, email, phoneNumber, joiningDate, position, salary, address, updatedByStr, id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
        return res.status(200).json({ message: 'Employee updated successfully' });

    } catch (error) {
        console.error('❌ Error updating employee:', error.message);
        return res.status(500).json({ message: 'Failed to update employee', error: error.message });
    }
};


export const employDetails = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have a middleware that sets req.userId

        const { id } = req.params; // Extract employee ID from route params
        if (!id) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        const q = 'SELECT * FROM employees WHERE id = ?';

        // Execute the query using db.query with a callback
        db.query(q, [id], (err, result) => {
            if (err) {
                console.error('❌ Error fetching employee details:', err.message);
                return res.status(500).json({ error: 'Failed to fetch employee details', details: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Send the result (employee details) back in the response
            return res.status(200).json(result[0]); // Assuming you want to return the first employee from the result
        });

    } catch (error) {
        console.error('❌ Unexpected error fetching employee details:', error);
        return res.status(500).json({ message: 'Server error', details: error.message });
    }
};

export const deleteEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await getEmployeeById(id)
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const query = 'DELETE FROM employees WHERE id = ?';

        const result = await new Promise((resolve, reject) => {
            db.query(query, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error.message);
        return res.status(500).json({ message: 'Failed to delete employee' });
    }
};

export const findEmployees = async (req, res) => {
    try {
        const { search, minSalary, maxSalary } = req.body;

        // Base query
        let query = 'SELECT * FROM employees WHERE 1=1';
        const queryParams = [];

        // Search by name, email or phone
        if (search) {
            query += ` AND (name LIKE ? OR email LIKE ? OR phoneNumber LIKE ?)`;
            const likeSearch = `%${search}%`;
            queryParams.push(likeSearch, likeSearch, likeSearch);
        }

        // Salary range
        if (minSalary) {
            query += ' AND salary >= ?';
            queryParams.push(minSalary);
        }
        if (maxSalary) {
            query += ' AND salary <= ?';
            queryParams.push(maxSalary);
        }

        const employees = await new Promise((resolve, reject) => {
            db.query(query, queryParams, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error getting employees:', error.message);
        return res.status(500).json({ message: 'Failed to get employees' });
    }
};
